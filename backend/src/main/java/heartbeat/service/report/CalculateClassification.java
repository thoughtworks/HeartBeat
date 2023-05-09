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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j2

public class CalculateClassification {

	private static final String NONE_KEY = "None";

	public List<Classification> calculateClassification(List<TargetField> targetFields, CardCollection cards) {
		// todo:add calculate Classification logic
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
			Map<String, Object> tempFields = toMap(jiraCardFields);
			for (String tempFieldsKey : tempFields.keySet()) {
				Object obj = tempFields.get(tempFieldsKey);
				if (obj instanceof List) {
					mapArrayField(resultMap, tempFieldsKey, (List<Object>) obj);
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

	private void mapArrayField(Map<String, Map<String, Integer>> resultMap, String fieldsKey, List<Object> obj) {
		Map<String, Integer> map = resultMap.get(fieldsKey);
		if (map != null) {
			for (Object p1 : obj) {
				String displayName = pickDisplayNameFromObj(p1);
				Integer count = map.get(displayName);
				map.put(displayName, count != null ? count + 1 : 1);
			}
			if (!obj.isEmpty()) {
				map.put(NONE_KEY, map.get(NONE_KEY) - 1);
			}
		}
	}

	private static String pickDisplayNameFromObj(Object obj) {
		Map<String, Object> map = objectToMap(obj);
		if (map.containsKey("displayName")) {
			return map.get("displayName").toString();
		}
		if (map.containsKey("name")) {
			return map.get("name").toString();
		}
		if (map.containsKey("displayValue")) {
			return map.get("displayValue").toString();
		}
		return obj.toString();
	}

	private static Map<String, Object> getFieldsAsMap(Object object) {
		Map<String, Object> map = new HashMap<>();
		Field[] fields = object.getClass().getDeclaredFields();
		for (Field field : fields) {
			field.setAccessible(true);
			try {
				Object value = field.get(object);
				map.put(field.getName(), value);
			}
			catch (IllegalAccessException e) {
				e.printStackTrace();
			}
		}
		return map;
	}

	private Map<String, Object> toMap(JiraCardField cardFields) {
		return getFieldsAsMap(cardFields);
	}

	public static Map<String, Object> objectToMap(Object object) {
		return getFieldsAsMap(object);
	}

}
