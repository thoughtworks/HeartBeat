package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.pipeline.dto.request.LeadTimeEnvironment;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.service.board.jira.JiraService;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.report.calculator.ChangeFailureRateCalculator;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import heartbeat.service.source.github.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class GenerateReporterService {

	private final JiraService jiraService;

	private final ClassificationCalculator classificationCalculator;

	private final GitHubService gitHubService;

	private final BuildKiteService buildKiteService;

	private final DeploymentFrequencyCalculator deploymentFrequency;

	private final ChangeFailureRateCalculator changeFailureRate;

	private final CycleTimeCalculator cycleTimeCalculator;

	private List<PipelineLeadTime> leadTimes;

	private final LeadTimeForChangesCalculator leadTimeForChangesCalculator;

	private final List<String> kanbanMetrics = Stream
		.of(RequireDataEnum.VELOCITY, RequireDataEnum.CYCLE_TIME, RequireDataEnum.CLASSIFICATION)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> buildKiteMetrics = Stream
		.of(RequireDataEnum.CHANGE_FAILURE_RATE, RequireDataEnum.DEPLOYMENT_FREQUENCY)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> codebaseMetrics = Stream.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES)
		.map(RequireDataEnum::getValue)
		.toList();

	public static Map<String, String> getRepoMap(CodebaseSetting codebaseSetting) {
		Map<String, String> repoMap = new HashMap<>();
		for (LeadTimeEnvironment currentValue : codebaseSetting.getLeadTime()) {
			repoMap.put(currentValue.getId(), currentValue.getRepository());
		}
		return repoMap;
	}

	private CardCollection cardCollection;

	private List<DeployTimes> deployTimesList = new ArrayList<>();

	private List<Map.Entry<String, List<BuildKiteBuildInfo>>> buildInfosList = new ArrayList<>();

	public synchronized ReportResponse generateReporter(GenerateReportRequest request) {
		// fetch data for calculate
		this.fetchOriginalData(request);

		ReportResponse reportResponse = new ReportResponse();
		request.getMetrics().forEach((metrics) -> {
			switch (metrics.toLowerCase()) {
				case "velocity" -> reportResponse.setVelocity(calculateVelocity());
				case "cycle time" -> reportResponse.setCycleTime(cycleTimeCalculator.calculateCycleTime(cardCollection,
						request.getJiraBoardSetting().getBoardColumns()));
				case "classification" -> reportResponse.setClassificationList(classificationCalculator
					.calculate(request.getJiraBoardSetting().getTargetFields(), cardCollection));
				case "deployment frequency" ->
					reportResponse.setDeploymentFrequency(deploymentFrequency.calculate(deployTimesList,
							Long.parseLong(request.getStartTime()), Long.parseLong(request.getEndTime())));
				case "change failure rate" ->
					reportResponse.setChangeFailureRate(changeFailureRate.calculate(deployTimesList));
				case "lead time for changes" -> reportResponse
					.setLeadTimeForChanges(leadTimeForChangesCalculator.calculate(leadTimes));
				default -> {
					// TODO
				}
			}
		});

		return reportResponse;
	}

	private Velocity calculateVelocity() {
		return Velocity.builder()
			.velocityForSP(String.valueOf(cardCollection.getStoryPointSum()))
			.velocityForCards(String.valueOf(cardCollection.getCardsNumber()))
			.build();
	}

	private void fetchOriginalData(GenerateReportRequest request) {
		List<String> lowMetrics = request.getMetrics().stream().map(String::toLowerCase).toList();

		if (lowMetrics.stream().anyMatch(this.kanbanMetrics::contains)) {
			fetchDataFromKanban(request);
		}

		if (lowMetrics.stream().anyMatch(this.codebaseMetrics::contains)) {
			fetchGithubData(request);
		}

		if (lowMetrics.stream().anyMatch(this.buildKiteMetrics::contains)) {
			fetchBuildKiteData(request);
		}

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

	private void fetchGithubData(GenerateReportRequest request) {
		for (LeadTimeEnvironment ignored : request.getCodebaseSetting().getLeadTime()) {
			fetchBuildKiteData(request);
		}
		Map<String, String> repoMap = getRepoMap(request.getCodebaseSetting());
		this.leadTimes = gitHubService
			.fetchPipelinesLeadTime(this.deployTimesList, repoMap, request.getCodebaseSetting().getToken())
			.join();
	}

	private void fetchBuildKiteData(GenerateReportRequest request) {
		deployTimesList.clear();
		buildInfosList.clear();
		for (DeploymentEnvironment deploymentEnvironment : request.getBuildKiteSetting().getDeploymentEnvList()) {
			List<BuildKiteBuildInfo> buildKiteBuildInfos = buildKiteService.fetchPipelineBuilds(
					request.getBuildKiteSetting().getToken(), deploymentEnvironment, request.getStartTime(),
					request.getEndTime());
			DeployTimes deployTimes = buildKiteService.countDeployTimes(deploymentEnvironment, buildKiteBuildInfos,
					request.getStartTime(), request.getEndTime());
			deployTimesList.add(deployTimes);
			buildInfosList.add(Map.entry(deploymentEnvironment.getId(), buildKiteBuildInfos));
		}
	}

}
