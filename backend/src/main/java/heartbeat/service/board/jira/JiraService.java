package heartbeat.service.board.jira;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.gson.reflect.TypeToken;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.board.jira.AllCardsResponseDTO;
import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.HistoryDetail;
import heartbeat.client.dto.board.jira.IssueField;
import heartbeat.client.dto.board.jira.Issuetype;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraBoardVerifyDTO;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardWithFields;
import heartbeat.client.dto.board.jira.JiraColumn;
import heartbeat.client.dto.board.jira.Sprint;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.request.BoardVerifyRequestParam;
import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.request.ReworkTimesSetting;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.CardCustomFieldKey;
import heartbeat.controller.board.dto.response.CardCycleTime;
import heartbeat.controller.board.dto.response.ColumnValue;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.board.dto.response.CycleTimeInfoDTO;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.JiraColumnDTO;
import heartbeat.controller.board.dto.response.ReworkTimesInfo;
import heartbeat.controller.board.dto.response.StatusChangedItem;
import heartbeat.controller.board.dto.response.StepsDay;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.BaseException;
import heartbeat.exception.InternalServerErrorException;
import heartbeat.exception.NoContentException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.util.BoardUtil;
import heartbeat.util.SystemUtil;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static heartbeat.controller.board.dto.request.CardStepsEnum.BLOCK;
import static heartbeat.controller.board.dto.request.CardStepsEnum.FLAG;
import static heartbeat.controller.board.dto.request.CardStepsEnum.fromValue;
import static heartbeat.controller.board.dto.request.CardStepsEnum.reworkJudgmentMap;
import static java.lang.Long.parseLong;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	public static final String STATUS_FIELD_ID = "status";

	public static final int QUERY_COUNT = 100;

	public static final int NONE_DONE_MAX_QUERY_COUNT = 50;

	public static final List<String> FIELDS_IGNORE = List.of("summary", "description", "attachment", "duedate",
			"issuelinks", "Development", "Start date", "Rank", "Issue color");

	private static final String DONE_CARD_TAG = "done";

	private static final String NONE_DONE_CARD_TAG = "nonDone";

	public static final String FLAGGED = "flagged";

	public static final String IMPEDIMENT = "impediment";

	private final ThreadPoolTaskExecutor customTaskExecutor;

	private final JiraFeignClient jiraFeignClient;

	private final JiraUriGenerator urlGenerator;

	private final BoardUtil boardUtil;

	private final SystemUtil systemUtil;

	private static final String STORY_POINT_KEY = "STORY_POINT_KEY";

	@PreDestroy
	public void shutdownExecutor() {
		customTaskExecutor.shutdown();
	}

	public String verify(BoardType boardType, BoardVerifyRequestParam boardVerifyRequestParam) {
		URI baseUrl = urlGenerator.getUri(boardVerifyRequestParam.getSite());
		verifyBoardTypeIsJira(boardType);

		try {
			jiraFeignClient.getDashboard(baseUrl, boardVerifyRequestParam.getToken());
		}
		catch (NotFoundException e) {
			throw new NotFoundException("site is incorrect");
		}
		try {
			JiraBoardVerifyDTO jiraBoardVerifyDTO = jiraFeignClient.getBoard(baseUrl,
					boardVerifyRequestParam.getBoardId(), boardVerifyRequestParam.getToken());

			return jiraBoardVerifyDTO.getLocation().getProjectKey();
		}
		catch (NotFoundException e) {
			log.error("Failed to call Jira to verify board url, url: {}", baseUrl);
			throw new NotFoundException("boardId is incorrect");
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call Jira to verify board, board id: {}, e: {}", boardVerifyRequestParam.getBoardId(),
					cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call Jira to verify board, cause is %s", cause.getMessage()));
		}
	}

	public BoardConfigDTO getInfo(BoardType boardType, BoardRequestParam boardRequestParam) {
		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());
		try {
			verifyBoardTypeIsJira(boardType);
			String jiraBoardStyle = jiraFeignClient
				.getProject(baseUrl, boardRequestParam.getProjectKey(), boardRequestParam.getToken())
				.getStyle();
			BoardType jiraBoardType = BoardType.fromStyle(jiraBoardStyle);

			Map<Boolean, List<TargetField>> partitions = getTargetFieldAsync(baseUrl, boardRequestParam).join()
				.stream()
				.collect(Collectors.partitioningBy(this::isIgnoredTargetField));
			List<TargetField> ignoredTargetFields = partitions.get(true);
			List<TargetField> neededTargetFields = partitions.get(false);

			return getJiraColumnsAsync(boardRequestParam, baseUrl,
					getJiraBoardConfig(baseUrl, boardRequestParam.getBoardId(), boardRequestParam.getToken()))
				.thenCombine(getUserAsync(jiraBoardType, baseUrl, boardRequestParam),
						(jiraColumnResult, users) -> BoardConfigDTO.builder()
							.targetFields(neededTargetFields)
							.jiraColumnResponse(jiraColumnResult.getJiraColumnResponse())
							.ignoredTargetFields(ignoredTargetFields)
							.users(users)
							.build())
				.join();
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call Jira to get board info, project key: {}, board id: {}, e: {}",
					boardRequestParam.getBoardId(), boardRequestParam.getProjectKey(), cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call Jira to get board info, cause is %s", cause.getMessage()));
		}
	}

	@Deprecated
	public BoardConfigDTO getJiraConfiguration(BoardType boardType, BoardRequestParam boardRequestParam) {
		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());
		try {

			Map<Boolean, List<TargetField>> partitions = getTargetFieldAsync(baseUrl, boardRequestParam).join()
				.stream()
				.collect(Collectors.partitioningBy(this::isIgnoredTargetField));
			List<TargetField> ignoredTargetFields = partitions.get(true);
			List<TargetField> neededTargetFields = partitions.get(false);

			return getJiraColumnsAsync(boardRequestParam, baseUrl,
					getJiraBoardConfig(baseUrl, boardRequestParam.getBoardId(), boardRequestParam.getToken()))
				.thenCombine(getUserAsync(boardType, baseUrl, boardRequestParam),
						(jiraColumnResult, users) -> BoardConfigDTO.builder()
							.targetFields(neededTargetFields)
							.jiraColumnResponse(jiraColumnResult.getJiraColumnResponse())
							.ignoredTargetFields(ignoredTargetFields)
							.users(users)
							.build())
				.join();
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call Jira to get board config, project key: {}, board id: {}, e: {}",
					boardRequestParam.getBoardId(), boardRequestParam.getProjectKey(), cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call Jira to get board config, cause is %s", cause.getMessage()));
		}
	}

	private static void verifyBoardTypeIsJira(BoardType boardType) {
		if (!BoardType.JIRA.equals(boardType)) {
			throw new BadRequestException("boardType param is not correct");
		}
	}

	private boolean isIgnoredTargetField(TargetField targetField) {
		return (FIELDS_IGNORE.contains(targetField.getKey())) || FIELDS_IGNORE.contains(targetField.getName());
	}

	public CardCollection getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users, String assigneeFilter) {
		BoardType boardType = BoardType.fromValue(request.getType());
		URI baseUrl = urlGenerator.getUri(request.getSite());
		BoardRequestParam boardRequestParam = BoardRequestParam.builder()
			.boardId(request.getBoardId())
			.projectKey(request.getProject())
			.site(request.getSite())
			.token(request.getToken())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.build();

		JiraCardWithFields jiraCardWithFields = getAllDoneCards(boardType, baseUrl, request.getStatus(),
				boardRequestParam, request.getOverrideFields());
		List<JiraCard> allDoneCards = jiraCardWithFields.getJiraCards();

		for (RequestJiraBoardColumnSetting boardColumn : boardColumns) {
			CardStepsEnum.fromValue(boardColumn.getValue());
		}
		List<JiraCardDTO> realDoneCards = getRealDoneCards(request, boardColumns, users, baseUrl, allDoneCards,
				jiraCardWithFields.getTargetFields(), assigneeFilter);

		double storyPointSum = realDoneCards.stream()
			.mapToDouble(card -> card.getBaseInfo().getFields().getStoryPoints())
			.sum();

		int reworkCardNumber = realDoneCards.stream()
			.filter(realDoneCard -> realDoneCard.getReworkTimesInfos()
				.stream()
				.anyMatch(reworkTimesInfo -> reworkTimesInfo.getTimes() != 0))
			.toList()
			.size();
		double reworkRatio = realDoneCards.isEmpty() ? 0
				: BigDecimal.valueOf(reworkCardNumber)
					.divide(BigDecimal.valueOf(realDoneCards.size()), 4, RoundingMode.HALF_UP)
					.doubleValue();

		return CardCollection.builder()
			.storyPointSum(storyPointSum)
			.cardsNumber(realDoneCards.size())
			.reworkCardNumber(reworkCardNumber)
			.reworkRatio(reworkRatio)
			.jiraCardDTOList(realDoneCards)
			.build();
	}

	private CompletableFuture<JiraColumnResult> getJiraColumnsAsync(BoardRequestParam boardRequestParam, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		return CompletableFuture.supplyAsync(() -> getJiraColumns(boardRequestParam, baseUrl, jiraBoardConfigDTO));
	}

	public JiraColumnResult getJiraColumns(BoardRequestParam boardRequestParam, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		log.info("Start to get jira columns, _projectKey: {}, _boardId: {}, _columnSize: {}",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(),
				jiraBoardConfigDTO.getColumnConfig().getColumns().size());
		List<String> jiraColumns = new CopyOnWriteArrayList<>();
		List<CompletableFuture<JiraColumnDTO>> futures = jiraBoardConfigDTO.getColumnConfig()
			.getColumns()
			.stream()
			.map(jiraColumn -> CompletableFuture.supplyAsync(
					() -> getColumnNameAndStatus(jiraColumn, baseUrl, jiraColumns, boardRequestParam.getToken())))
			.toList();

		List<JiraColumnDTO> columnResponse = futures.stream().map(CompletableFuture::join).toList();

		JiraColumnResult jiraColumnResult = JiraColumnResult.builder()
			.jiraColumnResponse(columnResponse)
			.jiraColumns(jiraColumns)
			.build();
		log.info(
				"Successfully get jira columns, _projectKey: {}, _boardId: {}, _columnResultSize: {}, _doneColumns: {}",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(),
				jiraColumnResult.getJiraColumnResponse().size(), jiraColumns);
		return jiraColumnResult;
	}

	private JiraColumnDTO getColumnNameAndStatus(JiraColumn jiraColumn, URI baseUrl, List<String> doneColumns,
			String token) {
		log.info("Start to get column and status, _columnName: {}, _columnStatus: {}", jiraColumn.getName(),
				jiraColumn.getStatuses());
		List<StatusSelfDTO> statusSelfList = getStatusSelfList(baseUrl, jiraColumn, token);
		String key = handleColumKey(doneColumns, statusSelfList);

		JiraColumnDTO jiraColumnDTO = JiraColumnDTO.builder()
			.key(key)
			.value(ColumnValue.builder()
				.name(jiraColumn.getName())
				.statuses(statusSelfList.stream()
					.map(statusSelf -> statusSelf.getUntranslatedName().toUpperCase())
					.toList())
				.build())
			.build();
		log.info("Successfully get column and status, _columnKey: {}, _status: {}", jiraColumnDTO.getKey(),
				jiraColumnDTO.getValue().getStatuses());
		return jiraColumnDTO;
	}

	private List<StatusSelfDTO> getStatusSelfList(URI baseUrl, JiraColumn jiraColumn, String token) {
		log.info("Start to get columns status self list, _columnName: {}", jiraColumn.getName());
		List<CompletableFuture<StatusSelfDTO>> futures = jiraColumn.getStatuses()
			.stream()
			.map(jiraColumnStatus -> CompletableFuture
				.supplyAsync(() -> jiraFeignClient.getColumnStatusCategory(baseUrl, jiraColumnStatus.getId(), token),
						customTaskExecutor)
				.exceptionally(e -> {
					log.error(
							"Failed to get Jira column status category, with  column name: {}, status: {} reason: {}:",
							jiraColumn.getName(), jiraColumn.getStatuses(), e.getMessage());
					return null;
				}))
			.toList();
		log.info("Successfully get columns status self list, _columnName: {}", jiraColumn.getName());

		return futures.stream().map(CompletableFuture::join).filter(Objects::nonNull).toList();
	}

	private String handleColumKey(List<String> doneColumn, List<StatusSelfDTO> statusSelfList) {
		List<String> keyList = new ArrayList<>();
		statusSelfList.forEach(statusSelf -> {
			if (statusSelf.getStatusCategory().getKey().equalsIgnoreCase(DONE_CARD_TAG)) {
				doneColumn.add(statusSelf.getUntranslatedName().toUpperCase());
				keyList.add(DONE_CARD_TAG);
			}
			else {
				keyList.add(statusSelf.getStatusCategory().getName());
			}
		});
		return keyList.contains(DONE_CARD_TAG) ? DONE_CARD_TAG
				: keyList.stream().reduce((pre, last) -> last).orElse("");
	}

	private CompletableFuture<List<String>> getUserAsync(BoardType boardType, URI baseUrl,
			BoardRequestParam boardRequestParam) {
		return CompletableFuture.supplyAsync(() -> getUsers(boardType, baseUrl, boardRequestParam));
	}

	private List<String> getUsers(BoardType boardType, URI baseUrl, BoardRequestParam boardRequestParam) {
		List<JiraCard> allCards = getAllCards(boardType, baseUrl, boardRequestParam).getJiraCards();

		if (allCards.isEmpty()) {
			throw new NoContentException("There is no cards.");
		}
		List<CompletableFuture<List<String>>> futures = allCards.stream()
			.map(jiraCard -> CompletableFuture
				.supplyAsync(() -> getAssigneeSet(baseUrl, jiraCard, boardRequestParam.getToken()), customTaskExecutor))
			.toList();

		List<List<String>> assigneeList = futures.stream().map(CompletableFuture::join).toList();
		return assigneeList.stream().flatMap(Collection::stream).distinct().toList();
	}

	private JiraCardWithFields getAllDoneCards(BoardType boardType, URI baseUrl, List<String> doneColumns,
			BoardRequestParam boardRequestParam, List<TargetField> overrideFields) {
		String jql = parseJiraJql(boardType, doneColumns, boardRequestParam);

		return getCardList(baseUrl, boardRequestParam, jql, "done", overrideFields, QUERY_COUNT);
	}

	private JiraCardWithFields getAllCards(BoardType boardType, URI baseUrl, BoardRequestParam boardRequestParam) {
		String jql;
		if (BoardType.JIRA.equals(boardType) || BoardType.CLASSIC_JIRA.equals(boardType)) {
			jql = String.format("status changed during (%s, %s)", boardRequestParam.getStartTime(),
					boardRequestParam.getEndTime());
		}
		else {
			throw new BadRequestException("boardType param is not correct");
		}
		return getCardList(baseUrl, boardRequestParam, jql, "all", null, QUERY_COUNT);
	}

	private AllCardsResponseDTO formatAllCards(String allCardResponse, List<TargetField> targetFields,
			List<TargetField> overrideFields) {
		AllCardsResponseDTO allCardsResponseDTO = new Gson().fromJson(allCardResponse, AllCardsResponseDTO.class);
		List<JiraCard> jiraCards = allCardsResponseDTO.getIssues();

		JsonArray elements = JsonParser.parseString(allCardResponse).getAsJsonObject().get("issues").getAsJsonArray();
		List<Map<String, JsonElement>> customFieldMapList = new ArrayList<>();
		ArrayList<Double> storyPointList = new ArrayList<>();
		Map<String, Sprint> sprintMap = new HashMap<>();
		Map<String, String> resultMap = targetFields.stream()
			.collect(Collectors.toMap(TargetField::getKey, TargetField::getName));
		CardCustomFieldKey cardCustomFieldKey = covertCustomFieldKey(targetFields, overrideFields);
		for (JsonElement element : elements) {
			JsonObject jsonElement = element.getAsJsonObject().get("fields").getAsJsonObject();
			JsonElement storyPoints = jsonElement.getAsJsonObject().get(cardCustomFieldKey.getStoryPoints());
			if (storyPoints == null || storyPoints.isJsonNull() || cardCustomFieldKey.isInTargetField()) {
				storyPointList.add(0.0);
			}
			else {
				Double storyPoint = jsonElement.getAsJsonObject()
					.get(cardCustomFieldKey.getStoryPoints())
					.getAsDouble();
				storyPointList.add(storyPoint);
			}
			for (int index = 0; index < jiraCards.size(); index++) {
				if (storyPointList.size() > index) {
					jiraCards.get(index).getFields().setStoryPoints(storyPointList.get(index));
				}
			}
			customFieldMapList.add(getCustomFieldMap(element, resultMap, jsonElement, sprintMap));
		}
		for (int index = 0; index < customFieldMapList.size(); index++) {
			jiraCards.get(index).getFields().setCustomFields(customFieldMapList.get(index));
		}

		jiraCards.forEach(jiraCard -> {
			Sprint sprint = sprintMap.get(jiraCard.getKey());
			jiraCard.getFields().setSprint(sprint);
		});
		return allCardsResponseDTO;
	}

	private Map<String, JsonElement> getCustomFieldMap(JsonElement element, Map<String, String> resultMap,
			JsonObject jsonElement, Map<String, Sprint> sprintMap) {
		Map<String, JsonElement> customFieldMap = new HashMap<>();
		resultMap.forEach((customFieldKey, customFieldValue) -> {
			if (jsonElement.has(customFieldKey)) {
				JsonElement fieldValue = jsonElement.get(customFieldKey);
				fieldValue = mapFieldValue(element, sprintMap, customFieldValue, fieldValue);
				customFieldMap.put(customFieldKey, fieldValue);
			}
		});
		return customFieldMap;
	}

	private JsonElement mapFieldValue(JsonElement element, Map<String, Sprint> sprintMap, String customFieldValue,
			JsonElement fieldValue) {
		switch (customFieldValue) {
			case "Sprint" -> Optional.ofNullable(getSprint(fieldValue))
				.ifPresentOrElse(it -> sprintMap.put(element.getAsJsonObject().get("key").getAsString(), it), () -> {
				});
			case "Story point estimate" -> {
				if (!fieldValue.isJsonNull() && fieldValue.isJsonPrimitive()) {
					JsonPrimitive jsonPrimitive = fieldValue.getAsJsonPrimitive();
					if (jsonPrimitive.isNumber()) {
						Number numberValue = jsonPrimitive.getAsNumber();
						double doubleValue = numberValue.doubleValue();
						fieldValue = new JsonPrimitive(doubleValue);
					}
				}
			}
			case "Flagged" -> {
				if (!fieldValue.isJsonNull() && fieldValue.isJsonArray()) {
					JsonArray jsonArray = fieldValue.getAsJsonArray();
					if (!jsonArray.isJsonNull() && !jsonArray.isEmpty()) {
						JsonElement targetField = jsonArray.get(jsonArray.size() - 1);
						fieldValue = targetField.getAsJsonObject().get("value");
					}
				}
			}
			default -> {
			}
		}
		return fieldValue;
	}

	private Sprint getSprint(JsonElement fieldValue) {
		if (!fieldValue.isJsonNull() && fieldValue.isJsonArray()) {
			JsonArray jsonArray = fieldValue.getAsJsonArray();
			if (!jsonArray.isJsonNull() && !jsonArray.isEmpty()) {
				Type listType = new TypeToken<List<Sprint>>() {
				}.getType();
				List<Sprint> sprints = new Gson().fromJson(jsonArray, listType);
				sprints.sort(Comparator.comparing(Sprint::getCompleteDate,
						Comparator.nullsLast(Comparator.comparing(ZonedDateTime::parse))));
				return sprints.get(sprints.size() - 1);
			}
		}
		return null;
	}

	private String parseJiraJql(BoardType boardType, List<String> doneColumns, BoardRequestParam boardRequestParam) {
		if (boardType == BoardType.JIRA) {
			return String.format("status in ('%s') AND status changed during (%s, %s)", String.join("','", doneColumns),
					boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		}
		else {
			StringBuilder subJql = new StringBuilder();
			for (int index = 0; index < doneColumns.size() - 1; index++) {
				subJql.append(String.format("status changed to '%s' during (%s, %s) or ", doneColumns.get(index),
						boardRequestParam.getStartTime(), boardRequestParam.getEndTime()));
			}
			subJql
				.append(String.format("status changed to '%s' during (%s, %s)", doneColumns.get(doneColumns.size() - 1),
						boardRequestParam.getStartTime(), boardRequestParam.getEndTime()));
			return String.format("status in ('%s') AND (%s)", String.join("', '", doneColumns), subJql);
		}
	}

	private List<String> getAssigneeSet(URI baseUrl, JiraCard jiraCard, String jiraToken) {
		log.info("Start to get jira card history, _cardKey: {}", jiraCard.getKey());
		CardHistoryResponseDTO cardHistoryResponseDTO = getJiraCardHistory(baseUrl, jiraCard.getKey(), 0, jiraToken);
		log.info("Successfully get jira card history, _cardKey: {}, _cardHistoryItemsSize: {}", jiraCard.getKey(),
				cardHistoryResponseDTO.getItems().size());

		List<String> assigneeSet = cardHistoryResponseDTO.getItems()
			.stream()
			.filter(assignee -> Objects.equals(assignee.getFieldId(), "assignee")
					&& assignee.getTo().getDisplayValue() != null)
			.map(assignee -> assignee.getTo().getDisplayValue())
			.toList();

		log.info("[assigneeSet] assigneeSet.isEmpty():{}", assigneeSet.isEmpty());

		if (assigneeSet.isEmpty() && nonNull(jiraCard.getFields().getAssignee())
				&& nonNull(jiraCard.getFields().getAssignee().getDisplayName())) {
			return List.of(jiraCard.getFields().getAssignee().getDisplayName());
		}
		log.info("Successfully get _assigneeSet:{}", assigneeSet);
		return assigneeSet;
	}

	private CompletableFuture<List<TargetField>> getTargetFieldAsync(URI baseUrl, BoardRequestParam boardRequestParam) {
		return CompletableFuture.supplyAsync(() -> getTargetField(baseUrl, boardRequestParam), customTaskExecutor);
	}

	private List<TargetField> getTargetField(URI baseUrl, BoardRequestParam boardRequestParam) {
		log.info("Start to get target field, _projectKey: {}, _boardId: {},", boardRequestParam.getProjectKey(),
				boardRequestParam.getBoardId());
		FieldResponseDTO fieldResponse = jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(),
				boardRequestParam.getToken());

		if (isNull(fieldResponse) || fieldResponse.getProjects().isEmpty()) {
			throw new PermissionDenyException("There is no enough permission.");
		}

		List<Issuetype> issueTypes = fieldResponse.getProjects().get(0).getIssuetypes();
		List<TargetField> targetFields = issueTypes.stream()
			.flatMap(issuetype -> getTargetIssueField(issuetype.getFields()).stream())
			.distinct()
			.toList();
		log.info("Successfully get _targetField, _projectKey: {}, _boardId: {}, _targetFieldsSize: {},",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(), targetFields.size());
		return targetFields;
	}

	private List<TargetField> getTargetIssueField(Map<String, IssueField> fields) {
		return fields.values()
			.stream()
			.map(issueField -> new TargetField(issueField.getKey(), issueField.getName(), false))
			.toList();
	}

	private List<JiraCardDTO> getRealDoneCards(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users, URI baseUrl,
			List<JiraCard> allDoneCards, List<TargetField> targetFields, String filterMethod) {

		CardCustomFieldKey cardCustomFieldKey = covertCustomFieldKey(targetFields, request.getOverrideFields());
		String keyFlagged = cardCustomFieldKey.getFlagged();
		List<JiraCardDTO> realDoneCards = new ArrayList<>();
		List<JiraCard> jiraCards = new ArrayList<>();

		for (JiraCard allDoneCard : allDoneCards) {
			CardHistoryResponseDTO jiraCardHistory = getJiraCardHistory(baseUrl, allDoneCard.getKey(), 0,
					request.getToken());
			if (isRealDoneCardByHistory(jiraCardHistory, request, allDoneCard)) {
				jiraCards.add(allDoneCard);
			}
		}
		jiraCards.forEach(doneCard -> {
			CardHistoryResponseDTO cardHistoryResponseDTO = getJiraCardHistory(baseUrl, doneCard.getKey(), 0,
					request.getToken());
			List<String> assigneeSet = getAssigneeSet(cardHistoryResponseDTO, filterMethod, doneCard);
			CycleTimeInfoDTO cycleTimeInfoDTO = getCycleTime(cardHistoryResponseDTO, request.isTreatFlagCardAsBlock(),
					keyFlagged, request.getStatus());
			if (users.stream().anyMatch(assigneeSet::contains)) {
				JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
					.baseInfo(doneCard)
					.cycleTime(cycleTimeInfoDTO.getCycleTimeInfos())
					.originCycleTime(cycleTimeInfoDTO.getOriginCycleTimeInfos())
					.cardCycleTime(calculateCardCycleTime(doneCard.getKey(), cycleTimeInfoDTO.getCycleTimeInfos(),
							boardColumns))
					.reworkTimesInfos(getReworkTimesInfo(cardHistoryResponseDTO, request.getReworkTimesSetting(),
							request.isTreatFlagCardAsBlock(), boardColumns))
					.build();
				jiraCardDTO.calculateTotalReworkTimes();
				realDoneCards.add(jiraCardDTO);
			}
		});
		return realDoneCards;
	}

	private List<ReworkTimesInfo> getReworkTimesInfo(CardHistoryResponseDTO jiraCardHistory,
			ReworkTimesSetting reworkTimesSetting, boolean considerFlagAsBlock,
			List<RequestJiraBoardColumnSetting> boardColumns) {
		if (Objects.isNull(reworkTimesSetting)) {
			return List.of();
		}
		Map<String, CardStepsEnum> stateMap = buildBoardStateMap(boardColumns);
		if (considerFlagAsBlock) {
			return getReworkTimesInfoWhenConsiderFlagAsBlock(jiraCardHistory, reworkTimesSetting.getEnumReworkState(),
					new HashSet<>(reworkTimesSetting.getEnumExcludeStates()), stateMap);
		}
		else {
			return getReworkTimesInfoWhenNotConsiderFlagAsBlock(jiraCardHistory,
					reworkTimesSetting.getEnumReworkState(), new HashSet<>(reworkTimesSetting.getEnumExcludeStates()),
					stateMap);
		}
	}

	private List<ReworkTimesInfo> getReworkTimesInfoWhenConsiderFlagAsBlock(CardHistoryResponseDTO jiraCardHistory,
			CardStepsEnum reworkState, Set<CardStepsEnum> excludedStates, Map<String, CardStepsEnum> stateMap) {
		Map<CardStepsEnum, Integer> reworkTimesMap = initializeReworkTimesMap(reworkState, excludedStates, stateMap);
		reworkTimesMap.put(FLAG, 0);
		AtomicReference<CardStepsEnum> currentState = new AtomicReference<>();
		AtomicBoolean hasFlag = new AtomicBoolean(false);
		jiraCardHistory.getItems()
			.stream()
			.filter(jiraCardHistoryItem -> STATUS_FIELD_ID.equalsIgnoreCase(jiraCardHistoryItem.getFieldId())
					|| FLAGGED.equalsIgnoreCase(jiraCardHistoryItem.getFieldDisplayName()))
			.forEach(jiraCardHistoryItem -> {
				if (STATUS_FIELD_ID.equalsIgnoreCase(jiraCardHistoryItem.getFieldId())) {
					currentState
						.set(convertBoardStateToEnumState(jiraCardHistoryItem.getTo().getDisplayName(), stateMap));
					if (!hasFlag.get()) {
						calculateReworkTimesMap(reworkState, excludedStates, reworkTimesMap, jiraCardHistoryItem,
								stateMap);
					}
				}
				else {
					if (IMPEDIMENT.equalsIgnoreCase(jiraCardHistoryItem.getTo().getDisplayName())) {
						hasFlag.set(true);
						CardStepsEnum from = Objects.requireNonNull(currentState).get();
						calculateTimes(reworkState, excludedStates, reworkTimesMap, from, FLAG);
					}
					else {
						hasFlag.set(false);
						CardStepsEnum to = Objects.requireNonNull(currentState).get();
						calculateTimes(reworkState, excludedStates, reworkTimesMap, FLAG, to);
					}
				}
			});
		if (reworkJudgmentMap.get(fromValue(reworkState.getValue())).contains(BLOCK)) {
			reworkTimesMap.put(BLOCK, reworkTimesMap.getOrDefault(BLOCK, 0) + reworkTimesMap.get(FLAG));
		}
		reworkTimesMap.remove(FLAG);
		return reworkTimesMap.entrySet()
			.stream()
			.map(entry -> new ReworkTimesInfo(entry.getKey(), entry.getValue()))
			.toList();
	}

	private static Map<CardStepsEnum, Integer> initializeReworkTimesMap(CardStepsEnum reworkState,
			Set<CardStepsEnum> excludedStates, Map<String, CardStepsEnum> stateMap) {
		Map<CardStepsEnum, Integer> reworkTimesMap = new EnumMap<>(CardStepsEnum.class);
		Set<CardStepsEnum> stateReworkEnums = new HashSet<>(reworkJudgmentMap.get(reworkState));
		stateReworkEnums.removeAll(excludedStates);
		stateReworkEnums.stream().filter(stateMap.values()::contains).forEach(state -> reworkTimesMap.put(state, 0));
		return reworkTimesMap;
	}

	private Map<String, CardStepsEnum> buildBoardStateMap(List<RequestJiraBoardColumnSetting> boardColumns) {
		return boardColumns.stream()
			.collect(Collectors.toMap(boardColumn -> boardColumn.getName().toUpperCase(),
					boardColumn -> CardStepsEnum.fromValue(boardColumn.getValue())));
	}

	private boolean isRework(CardStepsEnum from, CardStepsEnum to, Set<CardStepsEnum> excludedStates) {
		return !excludedStates.contains(from) && reworkJudgmentMap.get(to).contains(from);
	}

	private CardStepsEnum convertBoardStateToEnumState(String value, Map<String, CardStepsEnum> stateMap) {
		if (stateMap.containsKey(value.toUpperCase())) {
			return stateMap.get(value.toUpperCase());
		}
		return CardStepsEnum.UNKNOWN;
	}

	private List<ReworkTimesInfo> getReworkTimesInfoWhenNotConsiderFlagAsBlock(CardHistoryResponseDTO jiraCardHistory,
			CardStepsEnum reworkState, Set<CardStepsEnum> excludedStates, Map<String, CardStepsEnum> stateMap) {
		Map<CardStepsEnum, Integer> reworkTimesMap = initializeReworkTimesMap(reworkState, excludedStates, stateMap);
		reworkTimesMap.remove(FLAG);
		jiraCardHistory.getItems()
			.stream()
			.filter(jiraCardHistoryItem -> STATUS_FIELD_ID.equalsIgnoreCase(jiraCardHistoryItem.getFieldId()))
			.forEach(jiraCardHistoryItem -> calculateReworkTimesMap(reworkState, excludedStates, reworkTimesMap,
					jiraCardHistoryItem, stateMap));
		return reworkTimesMap.entrySet()
			.stream()
			.map(entry -> new ReworkTimesInfo(entry.getKey(), entry.getValue()))
			.toList();
	}

	private void calculateReworkTimesMap(CardStepsEnum reworkState, Set<CardStepsEnum> excludedStates,
			Map<CardStepsEnum, Integer> reworkTimesMap, HistoryDetail jiraCardHistoryItem,
			Map<String, CardStepsEnum> stateMap) {
		CardStepsEnum from = convertBoardStateToEnumState(jiraCardHistoryItem.getFrom().getDisplayName(), stateMap);
		CardStepsEnum to = convertBoardStateToEnumState(jiraCardHistoryItem.getTo().getDisplayName(), stateMap);
		calculateTimes(reworkState, excludedStates, reworkTimesMap, from, to);
	}

	private void calculateTimes(CardStepsEnum reworkState, Set<CardStepsEnum> excludedStates,
			Map<CardStepsEnum, Integer> reworkTimesMap, CardStepsEnum from, CardStepsEnum to) {
		if (!to.equals(reworkState)) {
			return;
		}
		if (isRework(from, to, excludedStates)) {
			reworkTimesMap.computeIfPresent(from, (key, value) -> value + 1);
		}
	}

	private List<String> getAssigneeSet(CardHistoryResponseDTO jiraCardHistory, String assigneeFilter,
			JiraCard doneCard) {
		List<String> assigneeSet = new ArrayList<>();
		Assignee assignee = doneCard.getFields().getAssignee();

		if (useLastAssignee(assigneeFilter)) {
			if (assignee != null) {
				assigneeSet.add(assignee.getDisplayName());
			}
			else {
				List<String> historicalAssignees = getHistoricalAssignees(jiraCardHistory);
				assigneeSet.add(getLastHistoricalAssignee(historicalAssignees));
			}
		}
		else {
			List<String> historicalAssignees = getHistoricalAssignees(jiraCardHistory);
			assigneeSet.addAll(historicalAssignees);
		}

		return assigneeSet;
	}

	private String getLastHistoricalAssignee(List<String> historicalAssignees) {
		return historicalAssignees.stream().filter(Objects::nonNull).findFirst().orElse(null);
	}

	private List<String> getHistoricalAssignees(CardHistoryResponseDTO jiraCardHistory) {
		return jiraCardHistory.getItems()
			.stream()
			.filter(item -> AssigneeFilterMethod.ASSIGNEE_FIELD_ID.getDescription().equalsIgnoreCase(item.getFieldId()))
			.sorted(Comparator.comparing(HistoryDetail::getTimestamp).reversed())
			.map(item -> item.getTo().getDisplayValue())
			.distinct()
			.toList();
	}

	private CardHistoryResponseDTO getJiraCardHistory(URI baseUrl, String cardKey, int startAt, String token) {
		int queryCount = 100;
		CardHistoryResponseDTO jiraCardHistory = jiraFeignClient.getJiraCardHistoryByCount(baseUrl, cardKey, startAt,
				queryCount, token);
		if (Boolean.FALSE.equals(jiraCardHistory.getIsLast())) {
			CardHistoryResponseDTO cardAllHistory = getJiraCardHistory(baseUrl, cardKey, startAt + queryCount, token);
			jiraCardHistory.getItems().addAll(cardAllHistory.getItems());
			jiraCardHistory.setIsLast(jiraCardHistory.getIsLast());
		}
		return jiraCardHistory;
	}

	private boolean useLastAssignee(String assigneeFilter) {
		return assigneeFilter.equals(AssigneeFilterMethod.LAST_ASSIGNEE.getDescription())
				|| StringUtils.isEmpty(assigneeFilter);
	}

	private boolean isRealDoneCardByHistory(CardHistoryResponseDTO jiraCardHistory,
			StoryPointsAndCycleTimeRequest request, JiraCard allDoneCard) {
		List<String> realDoneStatuses = request.getStatus().stream().map(String::toUpperCase).toList();
		long validStartTime = parseLong(request.getStartTime());
		long validEndTime = parseLong(request.getEndTime());

		Optional<Long> moveUndoneLastTime = jiraCardHistory.getItems()
			.stream()
			.filter(history -> STATUS_FIELD_ID.equals(history.getFieldId()))
			.filter(history -> realDoneStatuses.contains(history.getFrom().getDisplayValue().toUpperCase()))
			.filter(history -> !realDoneStatuses.contains(history.getTo().getDisplayValue().toUpperCase()))
			.map(HistoryDetail::getTimestamp)
			.filter(time -> time >= validStartTime && time <= validEndTime)
			.max(Long::compareTo);

		Optional<HistoryDetail> realDoneHistory = jiraCardHistory.getItems()
			.stream()
			.filter(history -> STATUS_FIELD_ID.equals(history.getFieldId()))
			.filter(history -> !realDoneStatuses.contains(history.getFrom().getDisplayValue().toUpperCase()))
			.filter(history -> realDoneStatuses.contains(history.getTo().getDisplayValue().toUpperCase()))
			.filter(history -> history.getTimestamp() >= validStartTime && history.getTimestamp() <= validEndTime)
			.filter(history -> history.getTimestamp() > moveUndoneLastTime.orElse(0L))
			.findFirst();

		if (realDoneHistory.isPresent()) {
			if (nonNull(allDoneCard.getFields().getStatus())) {
				allDoneCard.getFields().getStatus().setName(realDoneHistory.get().getTo().getDisplayValue());
				allDoneCard.getFields().setLastStatusChangeDate(realDoneHistory.get().getTimestamp());
			}
			return true;
		}
		else {
			return false;
		}
	}

	private CycleTimeInfoDTO getCycleTime(CardHistoryResponseDTO cardHistoryResponseDTO, Boolean treatFlagCardAsBlock,
			String keyFlagged, List<String> realDoneStatus) {
		List<StatusChangedItem> statusChangedArray = putStatusChangeEventsIntoAnArray(cardHistoryResponseDTO,
				keyFlagged);
		List<CycleTimeInfo> cycleTimeInfos = boardUtil.getCycleTimeInfos(statusChangedArray, realDoneStatus,
				treatFlagCardAsBlock);
		List<CycleTimeInfo> originCycleTimeInfos = boardUtil.getOriginCycleTimeInfos(statusChangedArray);

		return CycleTimeInfoDTO.builder()
			.cycleTimeInfos(cycleTimeInfos)
			.originCycleTimeInfos(originCycleTimeInfos)
			.build();
	}

	private List<StatusChangedItem> putStatusChangeEventsIntoAnArray(CardHistoryResponseDTO jiraCardHistory,
			String keyFlagged) {
		List<StatusChangedItem> statusChangedArray = new ArrayList<>();
		List<HistoryDetail> statusActivities = jiraCardHistory.getItems()
			.stream()
			.filter(activity -> STATUS_FIELD_ID.equals(activity.getFieldId()))
			.toList();

		if (jiraCardHistory.getItems().size() > 0 && statusActivities.size() > 0) {
			statusChangedArray.add(StatusChangedItem.builder()
				.timestamp(jiraCardHistory.getItems().get(0).getTimestamp() - 1)
				.status(statusActivities.get(0).getFrom().getDisplayValue())
				.build());

			jiraCardHistory.getItems()
				.stream()
				.filter(activity -> STATUS_FIELD_ID.equals(activity.getFieldId()))
				.forEach(activity -> statusChangedArray.add(StatusChangedItem.builder()
					.timestamp(activity.getTimestamp())
					.status(activity.getTo().getDisplayValue())
					.build()));
		}

		if (keyFlagged != null) {
			jiraCardHistory.getItems()
				.stream()
				.filter(activity -> keyFlagged.equals(activity.getFieldId()))
				.forEach(activity -> {
					if ("Impediment".equals(activity.getTo().getDisplayValue())) {
						statusChangedArray.add(StatusChangedItem.builder()
							.timestamp(activity.getTimestamp())
							.status(CardStepsEnum.FLAG.getValue())
							.build());
					}
					else {
						statusChangedArray.add(StatusChangedItem.builder()
							.timestamp(activity.getTimestamp())
							.status(CardStepsEnum.REMOVEFLAG.getValue())
							.build());
					}
				});
		}
		return statusChangedArray;

	}

	private CardCycleTime calculateCardCycleTime(String cardId, List<CycleTimeInfo> cycleTimeInfos,
			List<RequestJiraBoardColumnSetting> boardColumns) {
		Map<String, CardStepsEnum> boardMap = boardColumns.stream()
			.collect(Collectors.toMap(boardColumn -> boardColumn.getName().toUpperCase(),
					boardColumn -> CardStepsEnum.fromValue(boardColumn.getValue())));
		StepsDay stepsDay = StepsDay.builder().build();
		double total = 0;
		for (CycleTimeInfo cycleTimeInfo : cycleTimeInfos) {
			String swimLane = cycleTimeInfo.getColumn();
			if (swimLane.equalsIgnoreCase(CardStepsEnum.BLOCK.getValue())) {
				boardMap.put(swimLane, CardStepsEnum.BLOCK);
			}
			if (boardMap.containsKey(swimLane)) {
				CardStepsEnum cardStep = boardMap.get(swimLane);
				switch (cardStep) {
					case DEVELOPMENT -> {
						stepsDay.setDevelopment(stepsDay.getDevelopment() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case WAITING -> {
						stepsDay.setWaiting(stepsDay.getWaiting() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case TESTING -> {
						stepsDay.setTesting(stepsDay.getTesting() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case BLOCK -> {
						stepsDay.setBlocked(stepsDay.getBlocked() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case REVIEW -> {
						stepsDay.setReview(stepsDay.getReview() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case ANALYSE -> stepsDay.setAnalyse(stepsDay.getAnalyse() + cycleTimeInfo.getDay());
					default -> {
					}
				}
			}
		}
		return CardCycleTime.builder().name(cardId).steps(stepsDay).total(total).build();
	}

	private CardCustomFieldKey covertCustomFieldKey(List<TargetField> model, List<TargetField> overrideFields) {
		CardCustomFieldKey cardCustomFieldKey = CardCustomFieldKey.builder().build();
		for (TargetField value : model) {
			String lowercaseName = value.getName().toLowerCase();
			switch (lowercaseName) {
				case "story points", "story point estimate" -> cardCustomFieldKey.setStoryPoints(value.getKey());
				case "sprint" -> cardCustomFieldKey.setSprint(value.getKey());
				case FLAGGED -> cardCustomFieldKey.setFlagged(value.getKey());
				default -> {
				}
			}
		}
		if (!CollectionUtils.isEmpty(overrideFields)) {

			String storyPointsKey = overrideFields.stream()
				.filter(targetField -> ("story points").equalsIgnoreCase(targetField.getName()))
				.map(TargetField::getKey)
				.filter(key -> !key.isEmpty())
				.findFirst()
				.orElse("");

			String flaggedKey = overrideFields.stream()
				.filter(targetField -> FLAGGED.equalsIgnoreCase(targetField.getName()))
				.map(TargetField::getKey)
				.filter(key -> !key.isEmpty())
				.findFirst()
				.orElse("");

			if (!storyPointsKey.isEmpty()) {
				cardCustomFieldKey.setStoryPoints(storyPointsKey);
				cardCustomFieldKey
					.setInTargetField(model.stream().map(TargetField::getKey).toList().contains(storyPointsKey));
			}
			if (!flaggedKey.isEmpty()) {
				cardCustomFieldKey.setFlagged(flaggedKey);
			}
		}
		Map<String, String> envMap = systemUtil.getEnvMap();
		if (Objects.nonNull(envMap.get(STORY_POINT_KEY))) {
			cardCustomFieldKey.setStoryPoints(envMap.get(STORY_POINT_KEY));
		}
		return cardCustomFieldKey;
	}

	public CardCollection getStoryPointsAndCycleTimeForNonDoneCards(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users) {
		URI baseUrl = urlGenerator.getUri(request.getSite());
		BoardRequestParam boardRequestParam = BoardRequestParam.builder()
			.boardId(request.getBoardId())
			.projectKey(request.getProject())
			.site(request.getSite())
			.token(request.getToken())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.build();

		JiraCardWithFields jiraCardWithFields = getAllNonDoneCardsForActiveSprint(baseUrl, request.getStatus(),
				boardRequestParam, request.getOverrideFields());

		if (jiraCardWithFields.getJiraCards().isEmpty()) {
			jiraCardWithFields = getAllNonDoneCardsForKanBan(baseUrl, request.getStatus(), boardRequestParam,
					request.getOverrideFields());
		}

		List<JiraCardDTO> matchedNonCards = getMatchedNonDoneCards(request, boardColumns, users, baseUrl,
				jiraCardWithFields.getJiraCards(), jiraCardWithFields.getTargetFields());
		double storyPointSum = matchedNonCards.stream()
			.mapToDouble(card -> card.getBaseInfo().getFields().getStoryPoints())
			.sum();

		return CardCollection.builder()
			.storyPointSum(storyPointSum)
			.cardsNumber(matchedNonCards.size())
			.jiraCardDTOList(matchedNonCards)
			.build();
	}

	private List<JiraCardDTO> getMatchedNonDoneCards(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users, URI baseUrl,
			List<JiraCard> allNonDoneCards, List<TargetField> targetFields) {

		List<JiraCardDTO> matchedCards = new ArrayList<>();
		CardCustomFieldKey cardCustomFieldKey = covertCustomFieldKey(targetFields, request.getOverrideFields());
		String keyFlagged = cardCustomFieldKey.getFlagged();

		allNonDoneCards.forEach(card -> {
			CardHistoryResponseDTO cardHistoryResponseDTO = getJiraCardHistory(baseUrl, card.getKey(), 0,
					request.getToken());
			CycleTimeInfoDTO cycleTimeInfoDTO = getCycleTime(cardHistoryResponseDTO, request.isTreatFlagCardAsBlock(),
					keyFlagged, request.getStatus());

			setLastStatusChangeTimeInCard(card, cardHistoryResponseDTO);
			List<String> assigneeSet = getAssigneeSetWithDisplayName(baseUrl, card, request.getToken());
			if (users.stream().anyMatch(assigneeSet::contains)) {
				CardCycleTime cardCycleTime = calculateCardCycleTime(card.getKey(),
						cycleTimeInfoDTO.getCycleTimeInfos(), boardColumns);

				cardCycleTime.setTotal(0.0);

				JiraCardDTO jiraCardDTO = buildJiraCardDTO(card, cycleTimeInfoDTO, cardCycleTime);
				matchedCards.add(jiraCardDTO);
			}
		});
		return matchedCards;
	}

	private void setLastStatusChangeTimeInCard(JiraCard card, CardHistoryResponseDTO cardHistoryResponseDTO) {
		Optional<Long> lastStatusChangeTime = cardHistoryResponseDTO.getItems()
			.stream()
			.filter(history -> STATUS_FIELD_ID.equals(history.getFieldId()))
			.map(HistoryDetail::getTimestamp)
			.max(Long::compareTo);

		if (lastStatusChangeTime.isPresent() && nonNull(card.getFields())) {
			card.getFields().setLastStatusChangeDate(lastStatusChangeTime.get());
		}
	}

	private List<String> getAssigneeSetWithDisplayName(URI baseUrl, JiraCard card, String token) {
		List<String> assigneeSet = new ArrayList<>(getAssigneeSet(baseUrl, card, token));
		if (card.getFields().getAssignee() != null && card.getFields().getAssignee().getDisplayName() != null) {
			assigneeSet.add(card.getFields().getAssignee().getDisplayName());
		}
		return assigneeSet;
	}

	private JiraCardDTO buildJiraCardDTO(JiraCard card, CycleTimeInfoDTO cycleTimeInfoDTO,
			CardCycleTime cardCycleTime) {
		return JiraCardDTO.builder()
			.baseInfo(card)
			.cycleTime(cycleTimeInfoDTO.getCycleTimeInfos())
			.originCycleTime(cycleTimeInfoDTO.getOriginCycleTimeInfos())
			.cardCycleTime(cardCycleTime)
			.build();
	}

	private JiraCardWithFields getAllNonDoneCardsForActiveSprint(URI baseUrl, List<String> status,
			BoardRequestParam boardRequestParam, List<TargetField> overrideFields) {
		String jql;
		if (status.isEmpty()) {
			jql = "sprint in openSprints() ORDER BY updated DESC";
		}
		else {
			jql = "sprint in openSprints() AND status not in ('" + String.join("','", status)
					+ "') ORDER BY updated DESC";
		}

		return getCardList(baseUrl, boardRequestParam, jql, NONE_DONE_CARD_TAG, overrideFields,
				NONE_DONE_MAX_QUERY_COUNT);
	}

	private JiraCardWithFields getAllNonDoneCardsForKanBan(URI baseUrl, List<String> status,
			BoardRequestParam boardRequestParam, List<TargetField> overrideFields) {
		String jql;
		if (status.isEmpty()) {
			jql = "ORDER BY updated DESC";
		}
		else {
			jql = "status not in ('" + String.join("','", status) + "') ORDER BY updated DESC";
		}
		return getCardList(baseUrl, boardRequestParam, jql, NONE_DONE_CARD_TAG, overrideFields,
				NONE_DONE_MAX_QUERY_COUNT);
	}

	private JiraCardWithFields getCardList(URI baseUrl, BoardRequestParam boardRequestParam, String jql,
			String cardType, List<TargetField> overrideFields, int queryCount) {
		log.info("Start to get first-page xxx card information form kanban, _param {}", cardType);
		String allCardResponse = jiraFeignClient.getJiraCards(baseUrl, boardRequestParam.getBoardId(), queryCount, 0,
				jql, boardRequestParam.getToken());
		if (allCardResponse.isEmpty()) {
			return JiraCardWithFields.builder().jiraCards(Collections.emptyList()).build();
		}
		log.info("Successfully get first-page xxx card information form kanban, _param {}", cardType);

		List<TargetField> targetField = getTargetField(baseUrl, boardRequestParam);
		AllCardsResponseDTO allCardsResponseDTO = formatAllCards(allCardResponse, targetField, overrideFields);

		List<JiraCard> cards = new ArrayList<>(new LinkedHashSet<>(allCardsResponseDTO.getIssues()));
		int pages = (int) Math.ceil(Double.parseDouble(allCardsResponseDTO.getTotal()) / QUERY_COUNT);
		if (cardType.equals(NONE_DONE_CARD_TAG) || pages <= 1) {
			return JiraCardWithFields.builder().jiraCards(cards).targetFields(targetField).build();
		}

		log.info("Start to get more xxx card information form kanban, _param {}", cardType);
		List<Integer> range = IntStream.rangeClosed(1, pages - 1).boxed().toList();
		List<CompletableFuture<AllCardsResponseDTO>> futures = range.stream()
			.map(startFrom -> CompletableFuture
				.supplyAsync(() -> (formatAllCards(
						jiraFeignClient.getJiraCards(baseUrl, boardRequestParam.getBoardId(), QUERY_COUNT,
								startFrom * QUERY_COUNT, jql, boardRequestParam.getToken()),
						targetField, overrideFields)), customTaskExecutor))
			.toList();
		log.info("Successfully get more xxx card information form kanban, _param {}", cardType);

		List<AllCardsResponseDTO> nonDoneCardsResponses = futures.stream().map(CompletableFuture::join).toList();
		List<JiraCard> moreNonDoneCards = nonDoneCardsResponses.stream()
			.flatMap(moreDoneCardsResponses -> moreDoneCardsResponses.getIssues().stream())
			.toList();

		return JiraCardWithFields.builder()
			.jiraCards(Stream.concat(cards.stream(), moreNonDoneCards.stream()).toList())
			.targetFields(targetField)
			.build();
	}

	public JiraBoardConfigDTO getJiraBoardConfig(URI baseUrl, String boardId, String token) {
		log.info("Start to get configuration for board, _boardId: {}", boardId);
		JiraBoardConfigDTO jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardId, token);
		log.info("Successfully get configuration for board, _name: {}, _columnSize: {}", jiraBoardConfigDTO.getName(),
				jiraBoardConfigDTO.getColumnConfig().getColumns().size());
		return jiraBoardConfigDTO;
	}

}
