package heartbeat.service.report;

import heartbeat.controller.board.vo.request.Cards;
import heartbeat.controller.board.vo.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.report.vo.request.GenerateReportRequest;
import heartbeat.controller.report.vo.request.JiraBoardSetting;
import heartbeat.controller.report.vo.request.RequireDataEnum;
import heartbeat.controller.report.vo.response.GenerateReportResponse;
import heartbeat.controller.report.vo.response.Velocity;
import heartbeat.service.board.jira.JiraService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2

public class GenerateReporterService {

	// todo: need remove private fields not use void function when finish
	// GenerateReporterService
	private Cards cards;

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
		calculateClassification();
		calculateDeployment();
		calculateCycleTime();
		calculateLeadTime();

		// combined data to GenerateReportResponse
		return GenerateReportResponse.builder().velocity(velocity).build();
	}

	private Velocity calculateVelocity() {
		return Velocity.builder()
			.velocityForSP(String.valueOf(cards.getStoryPointSum()))
			.velocityForCards(String.valueOf(cards.getCardsNumber()))
			.build();
	}

	private void calculateClassification() {
		// todo:add calculate classification logic
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
		cards = jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), jiraBoardSetting.getUsers());
	}

	private void fetchGithubData() {
		// todo:add fetchGithubData logic
	}

	private void fetchBuildKiteData() {
		// todo:add fetchBuildKiteData logic
	}

}
