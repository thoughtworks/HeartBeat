package heartbeat.service.report.calculator;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.service.report.ICardFieldDisplayName;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ClassificationCalculator {

	private static final String NONE_KEY = "None";

	private static final String[] FIELD_NAMES = { "assignee", "summary", "status", "issuetype", "reporter",
			"timetracking", "statusCategoryChangeData", "storyPoints", "fixVersions", "project", "parent", "priority",
			"labels" };

	public List<Classification> calculate(List<TargetField> targetFields, CardCollection cards) {
		List<Classification> classificationFields = new ArrayList<>();
		Map<String, Map<String, Integer>> resultMap = new HashMap<>();
		Map<String, String> nameMap = new HashMap<>();

		targetFields.stream().filter(TargetField::isFlag).forEach(targetField -> {
			Map<String, Integer> innerMap = new HashMap<>();
			innerMap.put(NONE_KEY, cards.getCardsNumber());
			resultMap.put(targetField.getKey(), innerMap);
			nameMap.put(targetField.getKey(), targetField.getName());
		});

		for (JiraCardDTO jiraCardResponse : cards.getJiraCardDTOList()) {
			JiraCardField jiraCardFields = jiraCardResponse.getBaseInfo().getFields();
			Map<String, Object> tempFields = extractFields(jiraCardFields);

			for (String tempFieldsKey : tempFields.keySet()) {
				Object object = tempFields.get(tempFieldsKey);
				if (object instanceof JsonArray objectArray) {
					List<JsonObject> objectList = new ArrayList<>();
					for (JsonElement element : objectArray) {
						if (element.isJsonObject()) {
							JsonObject jsonObject = element.getAsJsonObject();
							objectList.add(jsonObject);
						}
					}
					mapArrayField(resultMap, tempFieldsKey, (List.of(objectList)));
				}
				else if (object instanceof List) {
					mapArrayField(resultMap, tempFieldsKey, (List.of(object)));
				}
				else if (object != null) {
					Map<String, Integer> countMap = resultMap.get(tempFieldsKey);
					if (countMap != null) {
						String displayName = pickDisplayNameFromObj(object);
						Integer count = countMap.getOrDefault(displayName, 0);
						countMap.put(displayName, count > 0 ? count + 1 : 1);
						countMap.put(NONE_KEY, countMap.get(NONE_KEY) - 1);
					}
				}
			}
		}

		for (Map.Entry<String, Map<String, Integer>> entry : resultMap.entrySet()) {
			String fieldName = entry.getKey();
			Map<String, Integer> valueMap = entry.getValue();
			List<ClassificationNameValuePair> classificationNameValuePair = new ArrayList<>();

			if (valueMap.get(NONE_KEY) == 0) {
				valueMap.remove(NONE_KEY);
			}

			for (Map.Entry<String, Integer> mapEntry : valueMap.entrySet()) {
				String displayName = mapEntry.getKey();
				Integer count = mapEntry.getValue();
				classificationNameValuePair
					.add(new ClassificationNameValuePair(displayName, (double) count / cards.getCardsNumber()));
			}

			classificationFields.add(new Classification(nameMap.get(fieldName), classificationNameValuePair));
		}
		return classificationFields;
	}

	private void mapArrayField(Map<String, Map<String, Integer>> resultMap, String fieldsKey, List<Object> objects) {
		Map<String, Integer> countMap = resultMap.get(fieldsKey);
		if (countMap != null) {
			for (Object object : (List) objects.get(0)) {
				String displayName = pickDisplayNameFromObj(object);
				Integer count = countMap.getOrDefault(displayName, 0);
				countMap.put(displayName, count > 0 ? count + 1 : 1);
			}
			if (!objects.isEmpty() && objects.get(0) instanceof List && ((List<?>) objects.get(0)).isEmpty()) {
				countMap.put(NONE_KEY, countMap.get(NONE_KEY));
			}
			else {
				countMap.put(NONE_KEY, countMap.get(NONE_KEY) - 1);
			}
		}
	}

	public static String pickDisplayNameFromObj(Object object) {
		if (object instanceof ICardFieldDisplayName) {
			return ((ICardFieldDisplayName) object).getDisplayName();
		}

		if (object instanceof JsonObject jsonObject) {
			JsonElement nameValue = jsonObject.get("name");
			if (nameValue != null) {
				return removeQuotes(nameValue.getAsString());
			}
			JsonElement displayNameValue = jsonObject.get("displayName");
			if (displayNameValue != null) {
				return removeQuotes(displayNameValue.getAsString());
			}
			JsonElement valueName = jsonObject.get("value");
			if (valueName != null) {
				return removeQuotes(valueName.getAsString());
			}
			return NONE_KEY;
		}

		if (object instanceof JsonNull) {
			return NONE_KEY;
		}

		if (object instanceof JsonPrimitive) {
			return removeQuotes(((JsonPrimitive) object).getAsString());
		}

		return object.toString();
	}

	private static String removeQuotes(String value) {
		return value.replaceAll("\"", "");
	}

	public Map<String, Object> extractFields(JiraCardField jiraCardFields) {
		Map<String, Object> tempFields = new HashMap<>();
		for (Map.Entry<String, JsonElement> entry : jiraCardFields.getCustomFields().entrySet()) {
			String key = entry.getKey();
			JsonElement jsonElement = entry.getValue();
			tempFields.put(key, jsonElement);
		}

		for (String fieldName : ClassificationCalculator.FIELD_NAMES) {
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

}
