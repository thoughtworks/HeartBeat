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

	private static final String[] VALUE_KEYS = { "displayName", "name", "displayValue" };

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
			Map<String, Object> tempFields = getMapFromObject(jiraCardFields);
			for (String tempFieldsKey : tempFields.keySet()) {
				Object object = tempFields.get(tempFieldsKey);
				if (object instanceof List) {
					mapArrayField(resultMap, tempFieldsKey, (List<Object>) object);
				}
				else if (object != null) {
					Map<String, Integer> countMap = resultMap.get(tempFieldsKey);
					if (countMap != null) {
						String displayName = pickDisplayNameFromObj(object);
						Integer count = countMap.get(displayName);
						countMap.put(displayName, count != null ? count + 1 : 1);
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
				classificationNameValuePair.add(new ClassificationNameValuePair(displayName,
						String.format("%.2f%%", (count.floatValue() / cards.getCardsNumber()) * 100)));
			}

			classificationFields.add(new Classification(nameMap.get(fieldName), classificationNameValuePair));
		}
		return classificationFields;
	}

	private void mapArrayField(Map<String, Map<String, Integer>> resultMap, String fieldsKey, List<Object> objects) {
		Map<String, Integer> map = resultMap.get(fieldsKey);
		if (map != null) {
			for (Object object : objects) {
				String displayName = pickDisplayNameFromObj(object);
				Integer count = map.get(displayName);
				map.put(displayName, count != null ? count + 1 : 1);
			}
			if (!objects.isEmpty()) {
				map.put(NONE_KEY, map.get(NONE_KEY) - 1);
			}
		}
	}

	private static String pickDisplayNameFromObj(Object object) {
		Map<String, Object> map = getMapFromObject(object);
		for (String fieldName : VALUE_KEYS) {
			if (map.containsKey(fieldName)) {
				return map.get(fieldName).toString();
			}
		}
		return object.toString();
	}

	private static Map<String, Object> getMapFromObject(Object object) {
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

}
