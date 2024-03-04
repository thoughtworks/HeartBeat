package heartbeat.service.report;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.JiraColumnDTO;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.board.dto.response.CycleTimeInfo;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.response.BoardCSVConfig;
import heartbeat.controller.report.dto.response.BoardCSVConfigEnum;
import heartbeat.service.board.jira.JiraColumnResult;
import heartbeat.service.board.jira.JiraService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Log4j2
@RequiredArgsConstructor
public class KanbanCsvService {

	private static final String[] FIELD_NAMES = { "assignee", "summary", "status", "issuetype", "reporter",
			"timetracking", "statusCategoryChangeData", "storyPoints", "fixVersions", "project", "parent", "priority",
			"labels" };

	private static final String[] IGNORE_COLUMNS = { CardStepsEnum.DONE.toString() };

	private final CSVFileGenerator csvFileGenerator;

	private final JiraService jiraService;

	private final JiraUriGenerator urlGenerator;

	public void generateCsvInfo(GenerateReportRequest request, CardCollection realDoneCardCollection,
			CardCollection nonDoneCardCollection) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		BoardRequestParam boardRequestParam = BoardRequestParam.builder()
			.boardId(jiraBoardSetting.getBoardId())
			.projectKey(jiraBoardSetting.getProjectKey())
			.site(jiraBoardSetting.getSite())
			.token(jiraBoardSetting.getToken())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.build();
		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());
		JiraBoardConfigDTO jiraBoardConfigDTO = jiraService.getJiraBoardConfig(baseUrl, boardRequestParam.getBoardId(),
				boardRequestParam.getToken());
		JiraColumnResult jiraColumns = jiraService.getJiraColumns(boardRequestParam, baseUrl, jiraBoardConfigDTO);

		this.generateCSVForBoard(realDoneCardCollection.getJiraCardDTOList(),
				nonDoneCardCollection.getJiraCardDTOList(), jiraColumns.getJiraColumnResponse(),
				jiraBoardSetting.getTargetFields(), request.getCsvTimeStamp());
	}

	private void generateCSVForBoard(List<JiraCardDTO> allDoneCards, List<JiraCardDTO> nonDoneCards,
			List<JiraColumnDTO> jiraColumns, List<TargetField> targetFields, String csvTimeStamp) {
		List<JiraCardDTO> cardDTOList = new ArrayList<>();
		List<JiraCardDTO> emptyJiraCard = List.of(JiraCardDTO.builder().build());

		if (allDoneCards != null) {
			if (allDoneCards.size() > 1) {
				allDoneCards.sort((preCard, nextCard) -> {
					Status preStatus = preCard.getBaseInfo().getFields().getStatus();
					Status nextStatus = nextCard.getBaseInfo().getFields().getStatus();
					Long preDateTimeStamp = preCard.getBaseInfo().getFields().getLastStatusChangeDate();
					Long nextDateTimeStamp = nextCard.getBaseInfo().getFields().getLastStatusChangeDate();
					if (Objects.isNull(preStatus) || Objects.isNull(nextStatus) || Objects.isNull(preDateTimeStamp)
							|| Objects.isNull(nextDateTimeStamp)) {
						return jiraColumns.size() + 1;
					}
					else {
						return nextDateTimeStamp.compareTo(preDateTimeStamp);
					}
				});
			}
			cardDTOList.addAll(allDoneCards);
		}

		cardDTOList.addAll(emptyJiraCard);

		if (nonDoneCards != null) {
			if (nonDoneCards.size() > 1) {
				nonDoneCards.sort((preCard, nextCard) -> {
					Status preStatus = preCard.getBaseInfo().getFields().getStatus();
					Status nextStatus = nextCard.getBaseInfo().getFields().getStatus();
					Long preDateTimeStamp = preCard.getBaseInfo().getFields().getLastStatusChangeDate();
					Long nextDateTimeStamp = nextCard.getBaseInfo().getFields().getLastStatusChangeDate();
					if (Objects.isNull(preStatus) || Objects.isNull(nextStatus)) {
						return jiraColumns.size() + 1;
					}
					else {
						String preCardStatusName = preStatus.getName();
						String nextCardStatusName = nextStatus.getName();
						int statusIndexComparison = getIndexForStatus(jiraColumns, nextCardStatusName)
								- getIndexForStatus(jiraColumns, preCardStatusName);

						if (statusIndexComparison == 0 && Objects.nonNull(preDateTimeStamp)
								&& Objects.nonNull(nextDateTimeStamp)) {
							return nextDateTimeStamp.compareTo(preDateTimeStamp);
						}

						return statusIndexComparison;
					}
				});
			}
			cardDTOList.addAll(nonDoneCards);
		}

		List<TargetField> enabledTargetFields = targetFields.stream().filter(TargetField::isFlag).toList();

		List<BoardCSVConfig> fixedBoardFields = getFixedBoardFields();
		List<BoardCSVConfig> extraFields = getExtraFields(enabledTargetFields, fixedBoardFields);

		List<BoardCSVConfig> newExtraFields = updateExtraFieldsWithCardField(extraFields, cardDTOList);
		List<BoardCSVConfig> allBoardFields = insertExtraFieldsAfterCycleTime(newExtraFields, fixedBoardFields);

		var ignoreColumns = Arrays.stream(IGNORE_COLUMNS).toList();

		// append OriginCycleTime
		cardDTOList.stream().flatMap(cardDTO -> {
			if (cardDTO.getOriginCycleTime() != null) {
				return cardDTO.getOriginCycleTime().stream();
			}
			else {
				return Stream.empty();
			}
		})
			.map(CycleTimeInfo::getColumn)
			.distinct()
			.filter(column -> !ignoreColumns.contains(column))
			.forEach(column -> allBoardFields.add(BoardCSVConfig.builder()
				.label("OriginCycleTime: " + column)
				.value("cycleTimeFlat." + column)
				.build()));

		cardDTOList.forEach(card -> {
			card.setCycleTimeFlat(card.buildCycleTimeFlatObject());
			card.setTotalCycleTimeDivideStoryPoints(card.getTotalCycleTimeDivideStoryPoints());
		});
		csvFileGenerator.convertBoardDataToCSV(cardDTOList, allBoardFields, newExtraFields, csvTimeStamp);
	}

	private List<BoardCSVConfig> insertExtraFieldsAfterCycleTime(final List<BoardCSVConfig> extraFields,
			final List<BoardCSVConfig> fixedBoardFields) {
		List<BoardCSVConfig> modifiedFields = new ArrayList<>(fixedBoardFields);
		int insertIndex = 0;
		for (int i = 0; i < modifiedFields.size(); i++) {
			BoardCSVConfig currentField = modifiedFields.get(i);
			if (currentField.getLabel().equals("Cycle Time")) {
				insertIndex = i + 1;
				break;
			}
		}
		modifiedFields.addAll(insertIndex, extraFields);
		return modifiedFields;
	}

	private List<BoardCSVConfig> updateExtraFieldsWithCardField(List<BoardCSVConfig> extraFields,
			final List<JiraCardDTO> cardDTOList) {
		List<BoardCSVConfig> updatedFields = new ArrayList<>();
		for (BoardCSVConfig field : extraFields) {
			boolean hasUpdated = false;
			for (JiraCardDTO card : cardDTOList) {
				if (card.getBaseInfo() != null) { // this is trying to filter out the
					// empty row
					Map<String, Object> tempFields = extractFields(card.getBaseInfo().getFields());
					if (!hasUpdated) {
						String extendField = getFieldDisplayValue(tempFields.get(field.getOriginKey()));
						if (extendField != null) {
							field.setValue(field.getValue() + extendField);
							hasUpdated = true;
						}
					}
				}
			}
			updatedFields.add(field);
		}
		return updatedFields;
	}

	private Map<String, Object> extractFields(JiraCardField jiraCardFields) {
		Map<String, Object> tempFields = new HashMap<>(jiraCardFields.getCustomFields());

		for (String fieldName : FIELD_NAMES) {
			switch (fieldName) {
				case "assignee" -> tempFields.put(fieldName, jiraCardFields.getAssignee());
				case "summary" -> tempFields.put(fieldName, jiraCardFields.getSummary());
				case "status" -> tempFields.put(fieldName, jiraCardFields.getStatus());
				case "issuetype" -> tempFields.put(fieldName, jiraCardFields.getIssuetype());
				case "reporter" -> tempFields.put(fieldName, jiraCardFields.getReporter());
				case "statusCategoryChangeData" -> tempFields.put(fieldName, jiraCardFields.getLastStatusChangeDate());
				case "storyPoints" -> tempFields.put(fieldName, jiraCardFields.getStoryPoints());
				case "fixVersions" -> tempFields.put(fieldName, jiraCardFields.getFixVersions());
				case "project" -> tempFields.put(fieldName, jiraCardFields.getProject());
				case "parent" -> tempFields.put(fieldName, jiraCardFields.getParent());
				case "priority" -> tempFields.put(fieldName, jiraCardFields.getPriority());
				case "labels" -> tempFields.put(fieldName, jiraCardFields.getLabels());
				default -> {
				}
			}
		}
		return tempFields;
	}

	private int getIndexForStatus(List<JiraColumnDTO> jiraColumns, String name) {
		for (int index = 0; index < jiraColumns.size(); index++) {
			List<String> statuses = jiraColumns.get(index).getValue().getStatuses();
			if (statuses.contains(name.toUpperCase())) {
				return index;
			}
		}
		return jiraColumns.size();
	}

	private List<BoardCSVConfig> getExtraFields(List<TargetField> targetFields, List<BoardCSVConfig> fixedBoardFields) {
		List<BoardCSVConfig> extraFields = new ArrayList<>();
		for (TargetField targetField : targetFields) {
			boolean isNotBelongTarget = fixedBoardFields.stream()
				.noneMatch(currentField -> currentField.getLabel().equalsIgnoreCase(targetField.getName())
						|| currentField.getValue().contains(targetField.getKey()));

			if (isNotBelongTarget) {
				extraFields.add(BoardCSVConfig.builder()
					.originKey(targetField.getKey())
					.label(targetField.getName())
					.value("baseInfo.fields.customFields." + targetField.getKey())
					.build());
			}
		}
		return extraFields;
	}

	private List<BoardCSVConfig> getFixedBoardFields() {
		return Arrays.stream(BoardCSVConfigEnum.values())
			.map(field -> BoardCSVConfig.builder().label(field.getLabel()).value(field.getValue()).build())
			.collect(Collectors.toList());
	}

	private String getFieldDisplayValue(Object object) {
		Gson gson = new Gson();
		String result = "";
		if (object == null || object instanceof JsonNull || object instanceof Double || object instanceof String
				|| object instanceof JsonPrimitive) {
			return result;
		}

		Object tempObject = object;

		if (tempObject instanceof List<?> list && !list.isEmpty()) {
			tempObject = list.get(0);
			result = "[0]";
		}
		else if (tempObject instanceof JsonArray jsonArray && !jsonArray.isEmpty()) {
			tempObject = jsonArray.get(0);
			result = "[0]";
		}
		else {
			return result;
		}

		JsonObject jsonObject = gson.toJsonTree(tempObject).getAsJsonObject();
		if (jsonObject.has("name")) {
			result += ".name";
		}
		else if (jsonObject.has("displayName")) {
			result += ".displayName";
		}
		else if (jsonObject.has("value")) {
			result += ".value";
		}
		else if (jsonObject.has("key")) {
			result += ".key";
		}

		return result;
	}

}
