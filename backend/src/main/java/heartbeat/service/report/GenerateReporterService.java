package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.pipeline.dto.request.LeadTimeEnvironment;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.service.board.jira.JiraService;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.source.github.GitHubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2

public class GenerateReporterService {

	private final JiraService jiraService;

	private final GitHubService gitHubService;

	private final BuildKiteService buildKiteService;

	private final DeploymentFrequencyCalculator deploymentFrequency;

	private final List<PipelineLeadTime> leadTimes;

	// need add GitHubMetrics and BuildKiteMetrics
	private final List<String> kanbanMetrics = Stream
		.of(RequireDataEnum.VELOCITY, RequireDataEnum.CYCLE_TIME, RequireDataEnum.CLASSIFICATION)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> buildKiteMetrics = Stream
		.of(RequireDataEnum.CHANGE_FAILURE_RATE, RequireDataEnum.DEPLOYMENT_FREQUENCY)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> codebaseMetrics = Stream
		.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES)
		.map(RequireDataEnum::getValue)
		.toList();
	public static Map<String, String> getRepoMap(CodebaseSetting codebaseSetting) {
		Map<String, String> repoMap = new HashMap<>();
		for (LeadTimeEnvironment currentValue : codebaseSetting.getLeadTime()) {
			repoMap.put(currentValue.getId(), currentValue.getRepository());
		}
		return repoMap;
	}

	// todo: need remove private fields not use void function when finish GenerateReport
	private CardCollection cardCollection;

	private List<DeployTimes> deployTimesList = new ArrayList<>();

	private List<Map.Entry<String, List<BuildKiteBuildInfo>>> buildInfosList = new ArrayList<>();

	public ReportResponse generateReporter(GenerateReportRequest request) {
		// fetch data for calculate
		this.fetchOriginalData(request);

		// calculate all required data
		calculateClassification();
		calculateCycleTime();
		calculateLeadTime();

		ReportResponse reportResponse = new ReportResponse();
		request.getMetrics().forEach((metrics) -> {
			switch (metrics.toLowerCase()) {
				case "velocity" -> reportResponse.setVelocity(calculateVelocity());
				case "deployment frequency" ->
					reportResponse.setDeploymentFrequency(deploymentFrequency.calculate(deployTimesList,
							Long.parseLong(request.getStartTime()), Long.parseLong(request.getEndTime())));
				case "lead time for changes" ->
					reportResponse.setLeadTimeForChanges(calculateLeadTime(this.leadTimes));
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

	private void calculateClassification() {
		// todo:add calculate classification logic
	}

	private void calculateCycleTime() {
		// todo:add calculate CycleTime logic
	}

	private void calculateLeadTime() {
		// todo:add calculate LeadTime logic
	}
	private LeadTimeForChanges calculateLeadTime(List<PipelineLeadTime> PipelineLeadTime) {

		List<LeadTimeForChangesOfPipelines> leadTimeForChangesOfPipelinesList = new ArrayList<>();
		List<AvgLeadTimeForChanges> avgLeadTimeForChangesArrayList = new ArrayList<>();
		if (PipelineLeadTime.isEmpty()){
			avgLeadTimeForChangesArrayList.add(new AvgLeadTimeForChanges(0, 0));
			return new LeadTimeForChanges(leadTimeForChangesOfPipelinesList,avgLeadTimeForChangesArrayList);
		}
		PipelineLeadTime.stream().map(item -> {
			int times = item.getLeadTimes().size();
			if (times == 0) {
				item.getLeadTimes().add(new LeadTime(0, 0));
			}
			HashMap<Integer, Integer> totalDelayTime = item.getLeadTimes().stream().map((leadTime -> new HashMap<Integer, Integer>(
					leadTime.getPrDelayTime() == null ? 0 : leadTime.getPrDelayTime().intValue(),
					leadTime.getPipelineDelayTime().intValue()
				)))
				.reduce(new HashMap<Integer, Integer>(0, 0), (pre, now) -> now);
			int totalPrDelayTime = totalDelayTime.keySet().stream().reduce(0, Integer::sum);
			int totalPipelineDelayTime = totalDelayTime.values().stream().reduce(0, Integer::sum);

			int avgPrDelayTime = totalPrDelayTime / times;
			int avgPipelineDelayTime = totalPipelineDelayTime / times;


			return new LeadTimeForChanges(leadTimeForChangesOfPipelinesList, avgLeadTimeForChangesArrayList);
		});
		return new LeadTimeForChanges(leadTimeForChangesOfPipelinesList, avgLeadTimeForChangesArrayList);
	}

	private HashMap<Double, Double> transformDelayTimeMapWithLeadTime(LeadTime leadTime) {
		HashMap<Double, Double> delayTimeMap = new HashMap<>();
		delayTimeMap.put(leadTime.getPrDelayTime(), leadTime.getPipelineDelayTime());
		return delayTimeMap;
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
		for (LeadTimeEnvironment leadTimeEnvironment : request.getCodebaseSetting().getLeadTime()){
//			this.deployTimesListFromLeadTimeSetting.add(getDeployTimesListFromDeploy(request));
		}
		Map<String, String> repoMap = getRepoMap(request.getCodebaseSetting());
//		this.leadTimes = gitHubService.fetchPipelinesLeadTime(deployTimesListFromLeadTimeSetting, repoMap);
	}

	private synchronized void fetchBuildKiteData(GenerateReportRequest request) {
		deployTimesList.clear();
		buildInfosList.clear();
		for (DeploymentEnvironment deploymentEnvironment : request.getBuildKiteSetting().getDeploymentEnvList()) {
			List<BuildKiteBuildInfo> buildKiteBuildInfos = buildKiteService.fetchPipelineBuilds(
					request.getBuildKiteSetting().getToken(), deploymentEnvironment, request.getStartTime(),
					request.getEndTime());
			DeployTimes deployTimes = buildKiteService.countDeployTimes(deploymentEnvironment, buildKiteBuildInfos);
			deployTimesList.add(deployTimes);
			buildInfosList.add(Map.entry(deploymentEnvironment.getId(), buildKiteBuildInfos));
		}
	}

	private DeployTimes getDeployTimesListFromDeploy(GenerateReportRequest request) {
		DeployTimes deployTimes = new DeployTimes();
		for (DeploymentEnvironment deploymentEnvironment : request.getBuildKiteSetting().getDeploymentEnvList()) {
			List<BuildKiteBuildInfo> buildInfo = buildKiteService.fetchPipelineBuilds(
				request.getBuildKiteSetting().getToken(), deploymentEnvironment, request.getStartTime(),
				request.getEndTime());
			deployTimes = buildKiteService.countDeployTimes(deploymentEnvironment, buildInfo);
		}
		return deployTimes;
	}

}
