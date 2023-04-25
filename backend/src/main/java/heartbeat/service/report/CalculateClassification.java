package heartbeat.service.report;

import heartbeat.controller.board.dto.request.Cards;
import heartbeat.controller.board.dto.response.JiraCardResponse;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2

public class CalculateClassification {

	private static final String NONE_KEY = "None";

	public List<heartbeat.controller.report.dto.response.Classification> calculateClassification(
			List<TargetField> targetFields, Cards cards) {
		// todo:add calculate Deployment logic
		List<heartbeat.controller.report.dto.response.Classification> classificationFields = new ArrayList<>();
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

		for (JiraCardResponse card : cards.getJiraCardResponseList()) {
			Map<String, Object> fields = (Map<String, Object>) card.getBaseInfo().getFields();
			for (Map.Entry<String, Object> entry : fields.entrySet()) {
				String fieldName = entry.getKey();
				Object fieldValue = entry.getValue();
				if (resultMap.containsKey(fieldName)) {
					if (fieldValue instanceof Object[]) {
						mapArrayField(resultMap, fieldName, (List<Map<String, Object>>) fieldValue);
					}
					else {
						String displayName = pickDisplayNameFromObj(fieldValue);
						if (displayName != null) {
							Map<String, Integer> fieldCounts = resultMap.computeIfAbsent(fieldName,
									k -> new HashMap<>());
							fieldCounts.compute(displayName, (k, v) -> v != null ? v + 1 : 1);
							fieldCounts.computeIfPresent(NONE_KEY, (k, v) -> v - 1);
						}
					}
				}
			}
		}

		for (Map.Entry<String, Map<String, Integer>> entry : resultMap.entrySet()) {
			String fieldName = entry.getKey();
			Map<String, Integer> fieldCounts = entry.getValue();

			fieldCounts.remove(NONE_KEY, 0);

			List<ClassificationNameValuePair> nameValuePairs = fieldCounts.entrySet().stream().map(e -> {
				String name = e.getKey();
				float percentage = e.getValue().floatValue() / cards.getCardsNumber() * 100;
				String formattedPercentage = String.format("%.2f%%", percentage);
				return new ClassificationNameValuePair(name, formattedPercentage);
			}).collect(Collectors.toList());

			String displayName = nameMap.get(fieldName);
			classificationFields.add(new Classification(displayName, nameValuePairs));
		}
		return classificationFields;
	}

	public void mapArrayField(Map<String, Map<String, Integer>> resultMap, String fieldName,
			List<Map<String, Object>> fieldValues) {
		Map<String, Integer> fieldCounts = resultMap.get(fieldName);
		if (fieldCounts == null || fieldValues.isEmpty()) {
			return;
		}

		for (Map<String, Object> fieldValue : fieldValues) {
			if (fieldValue != null) {
				String displayName = pickDisplayNameFromObj(fieldValue);
				fieldCounts.compute(displayName, (k, v) -> v != null ? v + 1 : 1);
			}
		}

		fieldCounts.computeIfPresent(NONE_KEY, (k, v) -> v - 1);
	}

	public static String pickDisplayNameFromObj(Object obj) {
		if (obj == null) {
			return NONE_KEY;
		}

		if (obj instanceof Map) {
			Map<String, Object> map = (Map<String, Object>) obj;
			return Arrays.stream(new String[] { "displayName", "name", "key", "value" })
				.filter(map::containsKey)
				.map(map::get)
				.findFirst()
				.map(Object::toString)
				.orElse(obj.toString());
		}

		if (obj instanceof String) {
			String str = (String) obj;
			Matcher matcher = Pattern.compile("name=([^,]+)").matcher(str);
			if (matcher.find()) {
				return matcher.group(1);
			}
		}

		return obj.toString();
	}

}
