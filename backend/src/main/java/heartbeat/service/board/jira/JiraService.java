package heartbeat.service.board.jira;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.board.jira.AllDoneCardsResponseDTO;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.HistoryDetail;
import heartbeat.client.dto.board.jira.IssueField;
import heartbeat.client.dto.board.jira.Issuetype;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraColumn;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
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
import heartbeat.controller.board.dto.response.StatusChangedItem;
import heartbeat.controller.board.dto.response.StepsDay;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.exception.RequestFailedException;
import heartbeat.util.BoardUtil;
import jakarta.annotation.PreDestroy;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	public static final String STATUS_FIELD_ID = "status";

	private final ThreadPoolTaskExecutor customTaskExecutor;

	public static final int QUERY_COUNT = 100;

	private static final String DONE_CARD_TAG = "done";

	public static final List<String> FIELDS_IGNORE = List.of("summary", "description", "attachment", "duedate",
			"issuelinks");

	private final JiraFeignClient jiraFeignClient;

	private final JiraUriGenerator urlGenerator;

	private final BoardUtil boardUtil;

	@PreDestroy
	public void shutdownExecutor() {
		customTaskExecutor.shutdown();
	}

	public BoardConfigDTO getJiraConfiguration(BoardType boardType, BoardRequestParam boardRequestParam) {
		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());
		try {
			log.info("Start to get configuration for board, board info: " + boardRequestParam);
			JiraBoardConfigDTO jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl,
					boardRequestParam.getBoardId(), boardRequestParam.getToken());
			log.info("Successfully get configuration for board: " + boardRequestParam.getBoardId() + "response: "
					+ jiraBoardConfigDTO);

			CompletableFuture<List<TargetField>> targetFieldFuture = getTargetFieldAsync(baseUrl, boardRequestParam);
			CompletableFuture<JiraColumnResult> jiraColumnsFuture = getJiraColumnsAsync(boardRequestParam, baseUrl,
					jiraBoardConfigDTO);

			return jiraColumnsFuture.thenCombine(targetFieldFuture,
					(jiraColumnResult,
							targetFields) -> getUserAsync(boardType, baseUrl, boardRequestParam,
									jiraColumnResult.getDoneColumns())
								.thenApply(users -> BoardConfigDTO.builder()
									.targetFields(targetFields)
									.jiraColumnRespons(jiraColumnResult.getJiraColumnResponse())
									.users(users)
									.build())
								.join())
				.join();
		}
		catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
		catch (CompletionException e) {
			Throwable cause = e.getCause();
			log.error("Failed when call Jira to get board config", cause);
			if (cause instanceof FeignException feignException) {
				throw new RequestFailedException(feignException);
			}
			else if (cause instanceof RequestFailedException requestFailedException) {
				throw requestFailedException;
			}
			throw e;
		}
	}

	public CardCollection getStoryPointsAndCycleTime(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users) {
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

		List<JiraCard> allDoneCards = getAllDoneCards(boardType, baseUrl, request.getStatus(), boardRequestParam);
		List<JiraCardDTO> matchedCards = getMatchedCards(request, boardColumns, users, baseUrl, allDoneCards);
		int storyPointSum = matchedCards.stream()
			.mapToInt(card -> card.getBaseInfo().getFields().getStoryPoints())
			.sum();

		return CardCollection.builder()
			.storyPointSum(storyPointSum)
			.cardsNumber(matchedCards.size())
			.jiraCardDTOList(matchedCards)
			.build();
	}

	private CompletableFuture<JiraColumnResult> getJiraColumnsAsync(BoardRequestParam boardRequestParam, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		return CompletableFuture.supplyAsync(() -> getJiraColumns(boardRequestParam, baseUrl, jiraBoardConfigDTO),
				customTaskExecutor);
	}

	public JiraColumnResult getJiraColumns(BoardRequestParam boardRequestParam, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		log.info("Start to get jira columns, project key: {}, board id: {}, column size: {}",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(),
				jiraBoardConfigDTO.getColumnConfig().getColumns().size());
		List<String> doneColumns = new CopyOnWriteArrayList<>();
		List<CompletableFuture<JiraColumnDTO>> futures = jiraBoardConfigDTO.getColumnConfig()
			.getColumns()
			.stream()
			.map(jiraColumn -> CompletableFuture.supplyAsync(
					() -> getColumnNameAndStatus(jiraColumn, baseUrl, doneColumns, boardRequestParam.getToken()),
					customTaskExecutor))
			.toList();

		List<JiraColumnDTO> columnResponse = futures.stream().map(CompletableFuture::join).collect(Collectors.toList());

		JiraColumnResult jiraColumnResult = JiraColumnResult.builder()
			.jiraColumnResponse(columnResponse)
			.doneColumns(doneColumns)
			.build();
		log.info(
				"Successfully to get jira columns, project key: {}, board id: {}, column result size: {}, done columns: {}",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(),
				jiraColumnResult.getJiraColumnResponse().size(), doneColumns);
		return jiraColumnResult;
	}

	private JiraColumnDTO getColumnNameAndStatus(JiraColumn jiraColumn, URI baseUrl, List<String> doneColumns,
			String token) {
		log.info("Start to get column and status, the column name: {} column status: {}", jiraColumn.getName(),
				jiraColumn.getStatuses());
		List<StatusSelfDTO> statusSelfList = getStatusSelfList(baseUrl, jiraColumn, token);
		String key = handleColumKey(doneColumns, statusSelfList);

		JiraColumnDTO jiraColumnDTO = JiraColumnDTO.builder()
			.key(key)
			.value(ColumnValue.builder()
				.name(jiraColumn.getName())
				.statuses(statusSelfList.stream()
					.map(statusSelf -> statusSelf.getUntranslatedName().toUpperCase())
					.collect(Collectors.toList()))
				.build())
			.build();
		log.info("Successfully get column and status, the column key: {}, status: {}", jiraColumnDTO.getKey(),
				jiraColumnDTO.getValue().getStatuses());
		return jiraColumnDTO;
	}

	private List<StatusSelfDTO> getStatusSelfList(URI baseUrl, JiraColumn jiraColumn, String token) {
		log.info("Start to get columns status self list");
		List<CompletableFuture<StatusSelfDTO>> futures = jiraColumn.getStatuses()
			.stream()
			.map(jiraColumnStatus -> CompletableFuture.supplyAsync(
					() -> jiraFeignClient.getColumnStatusCategory(baseUrl, jiraColumnStatus.getId(), token),
					customTaskExecutor))
			.toList();
		log.info("Successfully get columns status self list");

		return futures.stream().map(CompletableFuture::join).collect(Collectors.toList());
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
			BoardRequestParam boardRequestParam, List<String> doneColumns) {
		return CompletableFuture.supplyAsync(() -> getUsers(boardType, baseUrl, boardRequestParam, doneColumns),
				customTaskExecutor);
	}

	private List<String> getUsers(BoardType boardType, URI baseUrl, BoardRequestParam boardRequestParam,
			List<String> doneColumns) {
		if (doneColumns.isEmpty()) {
			throw new RequestFailedException(204, "There is no done column.");
		}

		List<JiraCard> doneCards = getAllDoneCards(boardType, baseUrl, doneColumns, boardRequestParam);

		if (doneCards.isEmpty()) {
			throw new RequestFailedException(204, "There is no done cards.");
		}

		List<CompletableFuture<List<String>>> futures = doneCards.stream()
			.map(doneCard -> CompletableFuture
				.supplyAsync(() -> getAssigneeSet(baseUrl, doneCard, boardRequestParam.getToken()), customTaskExecutor))
			.toList();

		List<List<String>> assigneeList = futures.stream().map(CompletableFuture::join).toList();
		return assigneeList.stream().flatMap(Collection::stream).distinct().toList();
	}

	private List<JiraCard> getAllDoneCards(BoardType boardType, URI baseUrl, List<String> doneColumns,
			BoardRequestParam boardRequestParam) {
		String jql = parseJiraJql(boardType, doneColumns, boardRequestParam);

		return getCardList(baseUrl, boardRequestParam, jql, "done");
	}

	private AllDoneCardsResponseDTO formatAllDoneCards(String allDoneCardResponse, List<TargetField> targetFields) {
		Gson gson = new Gson();
		AllDoneCardsResponseDTO allDoneCardsResponseDTO = gson.fromJson(allDoneCardResponse,
				AllDoneCardsResponseDTO.class);
		List<JiraCard> jiraCards = allDoneCardsResponseDTO.getIssues();

		JsonArray elements = JsonParser.parseString(allDoneCardResponse)
			.getAsJsonObject()
			.get("issues")
			.getAsJsonArray();
		List<Map<String, JsonElement>> customFieldMapList = new ArrayList<>();
		ArrayList<Integer> storyPointList = new ArrayList<>();
		Map<String, String> resultMap = targetFields.stream()
			.collect(Collectors.toMap(TargetField::getKey, TargetField::getName));
		CardCustomFieldKey cardCustomFieldKey = covertCustomFieldKey(targetFields);
		for (JsonElement element : elements) {
			JsonObject jsonElement = element.getAsJsonObject().get("fields").getAsJsonObject();
			JsonElement storyPoints = jsonElement.getAsJsonObject().get(cardCustomFieldKey.getStoryPoints());
			if (storyPoints == null || storyPoints.isJsonNull()) {
				storyPointList.add(0);
			}
			else {
				int storyPoint = jsonElement.getAsJsonObject().get(cardCustomFieldKey.getStoryPoints()).getAsInt();
				storyPointList.add(storyPoint);
			}
			for (int index = 0; index < jiraCards.size(); index++) {
				if (storyPointList.size() > index) {
					jiraCards.get(index).getFields().setStoryPoints(storyPointList.get(index));
				}
			}
			Map<String, JsonElement> customFieldMap = new HashMap<>();
			for (Map.Entry<String, String> entry : resultMap.entrySet()) {
				String customFieldKey = entry.getKey();
				if (jsonElement.has(customFieldKey)) {
					JsonElement fieldValue = jsonElement.get(customFieldKey);
					customFieldMap.put(customFieldKey, fieldValue);
				}
			}
			customFieldMapList.add(customFieldMap);
		}
		for (int index = 0; index < customFieldMapList.size(); index++) {
			allDoneCardsResponseDTO.getIssues().get(index).getFields().setCustomFields(customFieldMapList.get(index));
		}
		return allDoneCardsResponseDTO;
	}

	private String parseJiraJql(BoardType boardType, List<String> doneColumns, BoardRequestParam boardRequestParam) {
		if (boardType == BoardType.JIRA) {
			return String.format(
					"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s",
					String.join("','", doneColumns), boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		}
		else if (boardType == BoardType.CLASSIC_JIRA) {
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
		else {
			throw new RequestFailedException(400, "boardType param is not correct");
		}
	}

	private List<String> getAssigneeSet(URI baseUrl, JiraCard donecard, String jiraToken) {
		log.info("Start to get jira card history, key: {},done cards: {}", donecard.getKey(), donecard);
		CardHistoryResponseDTO cardHistoryResponseDTO = jiraFeignClient.getJiraCardHistory(baseUrl, donecard.getKey(),
				jiraToken);
		log.info("Successfully get jira card history, key: {},items: {}", donecard.getKey(),
				cardHistoryResponseDTO.getItems());

		List<String> assigneeSet = cardHistoryResponseDTO.getItems()
			.stream()
			.filter(assignee -> Objects.equals(assignee.getFieldId(), "assignee")
					&& assignee.getTo().getDisplayValue() != null)
			.map(assignee -> assignee.getTo().getDisplayValue())
			.toList();

		log.info("[assigneeSet] assigneeSet.isEmpty():{}", assigneeSet.isEmpty());

		if (assigneeSet.isEmpty() && nonNull(donecard.getFields().getAssignee())
				&& nonNull(donecard.getFields().getAssignee().getDisplayName())) {
			return List.of(donecard.getFields().getAssignee().getDisplayName());
		}
		log.info("Successfully get assigneeSet:{}", assigneeSet);
		return assigneeSet;
	}

	private CompletableFuture<List<TargetField>> getTargetFieldAsync(URI baseUrl, BoardRequestParam boardRequestParam) {
		return CompletableFuture.supplyAsync(() -> getTargetField(baseUrl, boardRequestParam), customTaskExecutor);
	}

	private List<TargetField> getTargetField(URI baseUrl, BoardRequestParam boardRequestParam) {
		log.info("Start to get target field, project key: {}, board id: {},", boardRequestParam.getProjectKey(),
				boardRequestParam.getBoardId());
		FieldResponseDTO fieldResponse = jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(),
				boardRequestParam.getToken());
		log.info("Successfully get target field, project key: {}, board id: {},", boardRequestParam.getProjectKey(),
				boardRequestParam.getBoardId());

		if (isNull(fieldResponse) || fieldResponse.getProjects().isEmpty()) {
			throw new RequestFailedException(204, "There is no target field.");
		}

		List<Issuetype> issueTypes = fieldResponse.getProjects().get(0).getIssuetypes();
		List<TargetField> targetFields = issueTypes.stream()
			.flatMap(issuetype -> getTargetIssueField(issuetype.getFields()).stream())
			.distinct()
			.toList();
		log.info("Successfully get targetField:{}", targetFields);
		return targetFields;
	}

	private List<TargetField> getTargetIssueField(Map<String, IssueField> fields) {
		return fields.values()
			.stream()
			.filter(issueField -> !FIELDS_IGNORE.contains(issueField.getKey()))
			.map(issueField -> new TargetField(issueField.getKey(), issueField.getName(), false))
			.collect(Collectors.toList());
	}

	private List<JiraCardDTO> getMatchedCards(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users, URI baseUrl,
			List<JiraCard> allDoneCards) {
		List<JiraCardDTO> matchedCards = new ArrayList<>();
		List<CompletableFuture<JiraCard>> futures = allDoneCards.stream()
			.map(jiraCard -> CompletableFuture.supplyAsync(() -> {
				CardHistoryResponseDTO jiraCardHistory = jiraFeignClient.getJiraCardHistory(baseUrl, jiraCard.getKey(),
						request.getToken());
				if (isDoneCardByHistory(jiraCardHistory)) {
					return jiraCard;
				}
				else {
					return null;
				}
			}))
			.toList();
		List<JiraCard> jiraCards = futures.stream().map(CompletableFuture::join).filter(Objects::nonNull).toList();

		jiraCards.forEach(doneCard -> {
			CycleTimeInfoDTO cycleTimeInfoDTO = getCycleTime(baseUrl, doneCard.getKey(), request.getToken(),
					request.isTreatFlagCardAsBlock());
			List<String> assigneeSet = new ArrayList<>(getAssigneeSet(baseUrl, doneCard, request.getToken()));
			if (doneCard.getFields().getAssignee() != null
					&& doneCard.getFields().getAssignee().getDisplayName() != null) {
				assigneeSet.add(doneCard.getFields().getAssignee().getDisplayName());
			}
			if (users.stream().anyMatch(assigneeSet::contains)) {
				// TODO:this logic is unnecessary processCustomFieldsForCard(doneCard)

				JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
					.baseInfo(doneCard)
					.cycleTime(cycleTimeInfoDTO.getCycleTimeInfos())
					.originCycleTime(cycleTimeInfoDTO.getOriginCycleTimeInfos())
					.cardCycleTime(calculateCardCycleTime(doneCard.getKey(), cycleTimeInfoDTO.getCycleTimeInfos(),
							boardColumns))
					.build();
				matchedCards.add(jiraCardDTO);
			}
		});
		return matchedCards;
	}

	private boolean isDoneCardByHistory(CardHistoryResponseDTO jiraCardHistory) {
		HistoryDetail detail = jiraCardHistory.getItems()
			.stream()
			.filter(historyDetail -> STATUS_FIELD_ID.equals(historyDetail.getFieldId()))
			.reduce((pre, next) -> next)
			.orElse(null);
		if (detail == null) {
			return false;
		}
		String displayName = detail.getTo().getDisplayName();
		return CardStepsEnum.DONE.getValue().equalsIgnoreCase(displayName)
				|| CardStepsEnum.CLOSED.getValue().equalsIgnoreCase(displayName);
	}

	private CycleTimeInfoDTO getCycleTime(URI baseUrl, String doneCardKey, String token, Boolean treatFlagCardAsBlock) {
		CardHistoryResponseDTO cardHistoryResponseDTO = jiraFeignClient.getJiraCardHistory(baseUrl, doneCardKey, token);
		List<StatusChangedItem> statusChangedArray = putStatusChangeEventsIntoAnArray(cardHistoryResponseDTO,
				treatFlagCardAsBlock);
		List<StatusChangedItem> statusChangeArrayWithoutFlag = putStatusChangeEventsIntoAnArray(cardHistoryResponseDTO,
				true);
		List<StatusChangedItem> statusChangedItems = boardUtil.reformTimeLineForFlaggedCards(statusChangedArray);
		List<CycleTimeInfo> cycleTimeInfos = boardUtil.getCardTimeForEachStep(statusChangedItems);
		List<CycleTimeInfo> originCycleTimeInfos = boardUtil
			.getCardTimeForEachStep(boardUtil.reformTimeLineForFlaggedCards(statusChangeArrayWithoutFlag));

		return CycleTimeInfoDTO.builder()
			.cycleTimeInfos(cycleTimeInfos)
			.originCycleTimeInfos(originCycleTimeInfos)
			.build();
	}

	private List<StatusChangedItem> putStatusChangeEventsIntoAnArray(CardHistoryResponseDTO jiraCardHistory,
			Boolean treatFlagCardAsBlock) {
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

		if (treatFlagCardAsBlock) {
			jiraCardHistory.getItems()
				.stream()
				.filter(activity -> "flagged".equals(activity.getFieldId()))
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
			if (swimLane.equals("FLAG")) {
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
					default -> {
					}
				}
			}
		}
		return CardCycleTime.builder().name(cardId).steps(stepsDay).total(total).build();
	}

	private CardCustomFieldKey covertCustomFieldKey(List<TargetField> model) {
		CardCustomFieldKey cardCustomFieldKey = CardCustomFieldKey.builder().build();
		for (TargetField value : model) {
			String lowercaseName = value.getName().toLowerCase();
			switch (lowercaseName) {
				case "story points", "story point estimate" -> cardCustomFieldKey.setStoryPoints(value.getKey());
				case "sprint" -> cardCustomFieldKey.setSprint(value.getKey());
				case "flagged" -> cardCustomFieldKey.setFlagged(value.getKey());
				default -> {

				}
			}
		}
		return cardCustomFieldKey;
	}

	public CardCollection getStoryPointsAndCycleTimeForNonDoneCards(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns) {
		URI baseUrl = urlGenerator.getUri(request.getSite());
		BoardRequestParam boardRequestParam = BoardRequestParam.builder()
			.boardId(request.getBoardId())
			.projectKey(request.getProject())
			.site(request.getSite())
			.token(request.getToken())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.build();

		List<JiraCard> allNonDoneCards = getAllNonDoneCardsForActiveSprint(baseUrl, request.getStatus(),
				boardRequestParam);
		if (allNonDoneCards.isEmpty()) {
			allNonDoneCards = getAllNonDoneCardsForKanBan(baseUrl, request.getStatus(), boardRequestParam);
		}

		List<JiraCardDTO> matchedNonCards = getMatchedNonCards(boardColumns, allNonDoneCards);
		int storyPointSum = matchedNonCards.stream()
			.mapToInt(card -> card.getBaseInfo().getFields().getStoryPoints())
			.sum();

		return CardCollection.builder()
			.storyPointSum(storyPointSum)
			.cardsNumber(matchedNonCards.size())
			.jiraCardDTOList(matchedNonCards)
			.build();
	}

	private List<JiraCardDTO> getMatchedNonCards(List<RequestJiraBoardColumnSetting> boardColumns,
			List<JiraCard> allNonDoneCards) {
		List<JiraCardDTO> matchedNonCards = new ArrayList<>();
		allNonDoneCards.forEach(doneCard -> {

			JiraCardDTO jiraCardDTO = JiraCardDTO.builder()
				.baseInfo(doneCard)
				.cycleTime(Collections.emptyList())
				.originCycleTime(Collections.emptyList())
				.cardCycleTime(calculateCardCycleTime(doneCard.getKey(), Collections.emptyList(), boardColumns))
				.build();
			matchedNonCards.add(jiraCardDTO);
		});
		return matchedNonCards;
	}

	private List<JiraCard> getAllNonDoneCardsForActiveSprint(URI baseUrl, List<String> status,
			BoardRequestParam boardRequestParam) {
		String jql;
		if (status.isEmpty()) {
			jql = "sprint in openSprints() ";
		}
		else {
			jql = "sprint in openSprints() AND status not in ('" + String.join("','", status) + "')";
		}

		return getCardList(baseUrl, boardRequestParam, jql, "nonDone");
	}

	private List<JiraCard> getAllNonDoneCardsForKanBan(URI baseUrl, List<String> status,
			BoardRequestParam boardRequestParam) {
		String jql;
		if (status.isEmpty()) {
			jql = "";
		}
		else {
			jql = "status not in ('" + String.join("','", status) + "')";
		}
		return getCardList(baseUrl, boardRequestParam, jql, "nonDone");
	}

	private List<JiraCard> getCardList(URI baseUrl, BoardRequestParam boardRequestParam, String jql, String cardType) {
		log.info("Start to get first-page xxx card information form kanban, param {}", cardType);
		String allCardResponse = jiraFeignClient.getAllDoneCards(baseUrl, boardRequestParam.getBoardId(), QUERY_COUNT,
				0, jql, boardRequestParam.getToken());
		if (allCardResponse.isEmpty()) {
			return Collections.emptyList();
		}
		log.info("Successfully get first-page xxx card information form kanban, param {}", cardType);

		List<TargetField> targetField = getTargetField(baseUrl, boardRequestParam);
		AllDoneCardsResponseDTO allCardsResponseDTO = formatAllDoneCards(allCardResponse, targetField);

		List<JiraCard> cards = new ArrayList<>(new HashSet<>(allCardsResponseDTO.getIssues()));
		int pages = (int) Math.ceil(Double.parseDouble(allCardsResponseDTO.getTotal()) / QUERY_COUNT);
		if (pages <= 1) {
			return cards;
		}

		log.info("Start to get more xxx card information form kanban, param {}", cardType);
		List<Integer> range = IntStream.rangeClosed(1, pages - 1).boxed().toList();
		List<CompletableFuture<AllDoneCardsResponseDTO>> futures = range.stream()
			.map(startFrom -> CompletableFuture.supplyAsync(
					() -> (formatAllDoneCards(jiraFeignClient.getAllDoneCards(baseUrl, boardRequestParam.getBoardId(),
							QUERY_COUNT, startFrom * QUERY_COUNT, jql, boardRequestParam.getToken()), targetField)),
					customTaskExecutor))
			.toList();
		log.info("Successfully get more xxx card information form kanban, param {}", cardType);

		List<AllDoneCardsResponseDTO> nonDoneCardsResponses = futures.stream().map(CompletableFuture::join).toList();
		List<JiraCard> moreNonDoneCards = nonDoneCardsResponses.stream()
			.flatMap(moreDoneCardsResponses -> moreDoneCardsResponses.getIssues().stream())
			.toList();

		return Stream.concat(cards.stream(), moreNonDoneCards.stream()).toList();
	}

	public JiraBoardConfigDTO getJiraBoardConfig(URI baseUrl, String boardId, String token) {
		log.info("Start to get configuration for board, board info: " + boardId + token);
		JiraBoardConfigDTO jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardId, token);
		log.info("Successfully get configuration for board: " + boardId + "response: " + jiraBoardConfigDTO);
		return jiraBoardConfigDTO;
	}

}
