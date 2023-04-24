package heartbeat.service.report;

import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.JiraCardField;
import heartbeat.controller.board.dto.response.JiraCardResponse;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.GenerateReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.service.board.jira.JiraService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2

public class GenerateReporterService {

	// todo: need remove private fields not use void function when finish GenerateReport
	private CardCollection cardCollection;

	private final JiraService jiraService;

	// need add GitHubMetrics and BuildKiteMetrics
	private final List<String> kanbanMetrics = Stream
		.of(RequireDataEnum.VELOCITY, RequireDataEnum.CYCLE_TIME, RequireDataEnum.CLASSIFICATION)
		.map(RequireDataEnum::getValue)
		.toList();

	public GenerateReportResponse generateReporter(GenerateReportRequest request) {
		// fetch data for calculate
		this.fetchOriginalData(request);

		// calculate all required data
		Velocity velocity = calculateVelocity();
		calculateClassification(request.getJiraBoardSetting().getTargetFields());
		calculateDeployment();
		calculateCycleTime();
		calculateLeadTime();

		log.info("Successfully generate Report, request: {}, report: {}", request,
				GenerateReportResponse.builder().velocity(velocity).build());

		// combined data to GenerateReportResponse
		return GenerateReportResponse.builder().velocity(velocity).build();
	}

	private Velocity calculateVelocity() {
		return Velocity.builder()
			.velocityForSP(String.valueOf(cardCollection.getStoryPointSum()))
			.velocityForCards(String.valueOf(cardCollection.getCardsNumber()))
			.build();
	}

	private List<Classification> calculateClassification(List<TargetField> targetFields) {
		// todo:add calculate Deployment logic
		List<Classification> classificationFields = new ArrayList<>();
		Map<String, Map<String, Integer>> resultMap = new HashMap<>();
		Map<String, String> nameMap = new HashMap<>();

		for (TargetField targetField : targetFields) {
			if (targetField.isFlag()) {
				Map<String, Integer> innerMap = new HashMap<>();
				innerMap.put("None", this.cards.getCardsNumber());
				resultMap.put(targetField.getKey(), innerMap);
				nameMap.put(targetField.getKey(), targetField.getName());
			}
		}

		for (JiraCardResponse jiraCardResponse : this.cards.getJiraCardResponseList()) {
			Map<String, Object> tempFields = (Map<String, Object>) jiraCardResponse.getBaseInfo().getFields();
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
						map.put("None", map.get("None") - 1);
					}
				}
			}
		}

		for (Map.Entry<String, Map<String, Integer>> entry : resultMap.entrySet()) {
			String fieldName = entry.getKey();
			Map<String, Integer> map = entry.getValue();
			List<ClassificationNameValuePair> classificationNameValuePair = new ArrayList<>();

			if (map.get("None") == 0) {
				map.remove("None");
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
				map.put("None", map.get("None") - 1);
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

	private void calculateDeployment() {
		// todo:add calculate Deployment logic
	}

	private void calculateCycleTime() {
		// todo:add calculate CycleTime logic
	}

	private void calculateLeadTime() {
		// todo:add calculate LeadTime logic
	}

	private void fetchOriginalData(GenerateReportRequest request) {
		List<String> lowMetrics = request.getMetrics().stream().map(String::toLowerCase).toList();

		if (lowMetrics.stream().anyMatch(this.kanbanMetrics::contains)) {
			fetchDataFromKanban(request);
		}

		fetchGithubData();

		fetchBuildKiteData();

	}

	private void fetchDataFromKanban(GenerateReportRequest request) {
		JiraBoardSetting jiraBoardSetting = request.getJiraBoardSetting();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = StoryPointsAndCycleTimeRequest.builder()
			.token(jiraBoardSetting.getToken())
			.type(jiraBoardSetting.getType())
			.site(jiraBoardSetting.getSite())
			.project(jiraBoardSetting.getProjectKey())
			.boardId(jiraBoardSetting.getBoardId())
			.status(jiraBoardSetting.getDoneColumn())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.targetFields(jiraBoardSetting.getTargetFields())
			.treatFlagCardAsBlock(jiraBoardSetting.getTreatFlagCardAsBlock())
			.build();
		cardCollection = jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), jiraBoardSetting.getUsers());
	}

	private void fetchGithubData() {
		// todo:add fetchGithubData logic
	}

	private void fetchBuildKiteData() {
		// todo:add fetchBuildKiteData logic
	}

}
