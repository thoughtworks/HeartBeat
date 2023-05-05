package heartbeat.service.report;

import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Log4j2

public class CalculateClassification {

	private static final String NONE_KEY = "None";

	public List<Classification> calculateClassification(List<TargetField> targetFields, CardCollection cards) {
		// todo:add calculate Deployment logic
		List<Classification> classificationFields = new ArrayList<>();
		Map<String, Map<String, Integer>> resultMap = new HashMap<>();
		Map<String, String> nameMap = new HashMap<>();

		for (TargetField targetField : targetFields) {
			if (targetField.isFlag()) {
				Map<String, Integer> innerMap = new HashMap<>();
				innerMap.put(NONE_KEY, cards.getCardsNumber());
				resultMap.put(targetField.getKey(), innerMap);
				nameMap.put(targetField.getKey(), targetField.getName());
			}
		}

		targetFields.stream().filter(TargetField::isFlag).forEach(targetField -> {
			Map<String, Integer> innerMap = new HashMap<>();
			innerMap.put(NONE_KEY, cards.getCardsNumber());
			resultMap.put(targetField.getKey(), innerMap);
			nameMap.put(targetField.getKey(), targetField.getName());
		});

		for (JiraCardDTO jiraCardResponse : cards.getJiraCardDTOList()) {
			JiraCardField jiraCardFields = jiraCardResponse.getBaseInfo().getFields();
			Map<String, Object> tempFields = toMap(jiraCardFields);
			for (String tempFieldsKey : tempFields.keySet()) {
				Object obj = tempFields.get(tempFieldsKey);
				if (obj instanceof Object[]) {
					mapArrayField(resultMap, tempFieldsKey, (List<Map<String, Object>>) obj);
				}
				else if (obj != null) {
					Map<String, Integer> map = resultMap.get(tempFieldsKey);
					if (map != null) {
						String displayName = pickDisplayNameFromObj(obj);
						Integer count = map.get(displayName);
						map.put(displayName, count != null ? count + 1 : 1);
						map.put(NONE_KEY, map.get(NONE_KEY) - 1);
					}
				}
			}
		}

		for (Map.Entry<String, Map<String, Integer>> entry : resultMap.entrySet()) {
			String fieldName = entry.getKey();
			Map<String, Integer> map = entry.getValue();
			List<ClassificationNameValuePair> classificationNameValuePair = new ArrayList<>();

			if (map.get(NONE_KEY) == 0) {
				map.remove(NONE_KEY);
			}

			for (Map.Entry<String, Integer> mapEntry : map.entrySet()) {
				String displayName = mapEntry.getKey();
				Integer count = mapEntry.getValue();
				classificationNameValuePair.add(new ClassificationNameValuePair(displayName,
						String.format("%.2f%%", (count.floatValue() / cards.getCardsNumber()) * 100)));
			}

			classificationFields.add(new Classification(nameMap.get(fieldName), classificationNameValuePair));
		}
		return classificationFields;
	}

	public void mapArrayField(Map<String, Map<String, Integer>> resultMap, String fieldsKey,
			List<Map<String, Object>> obj) {
		Map<String, Integer> map = resultMap.get(fieldsKey);
		if (map != null && !obj.isEmpty()) {
			for (Map<String, Object> p1 : obj) {
				if (p1 != null) {
					String displayName = pickDisplayNameFromObj(p1);
					Integer count = map.get(displayName);
					map.put(displayName, count != null ? count + 1 : 1);
				}
			}
			if (!obj.isEmpty()) {
				map.put(NONE_KEY, map.get(NONE_KEY) - 1);
			}
		}
	}

	public static String pickDisplayNameFromObj(Object obj) {
		if (obj == null) {
			return "None";
		}
		if (obj instanceof Map) {
			Map<String, Object> map = (Map<String, Object>) obj;
			if (map.containsKey("displayName")) {
				return map.get("displayName").toString();
			}
			if (map.containsKey("name")) {
				return map.get("name").toString();
			}
			if (map.containsKey("key")) {
				return map.get("key").toString();
			}
			if (map.containsKey("value")) {
				return map.get("value").toString();
			}
		}
		else if (obj instanceof String) {
			String str = (String) obj;
			Matcher matcher = Pattern.compile("name=.*").matcher(str);
			if (matcher.find()) {
				return matcher.group().replace("name=", "").split(",")[0];
			}
		}
		return obj.toString();
	}

	public Map<String, Object> toMap(JiraCardField cardFields) {
		Map<String, Object> map = new HashMap<>();
		Field[] fields = cardFields.getClass().getDeclaredFields();
		for (Field field : fields) {
			field.setAccessible(true);
			try {
				Object value = field.get(cardFields);
				map.put(field.getName(), value);
			}
			catch (IllegalAccessException e) {
				e.printStackTrace();
			}
		}
		return map;
	}

}
