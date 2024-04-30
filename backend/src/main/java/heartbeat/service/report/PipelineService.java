package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.response.LeadTimeInfo;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.report.calculator.model.FetchedData;
import heartbeat.service.source.github.GitHubService;
import lombok.AllArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PipelineService {

	private static final List<String> REQUIRED_STATES = List.of("passed", "failed");

	private final BuildKiteService buildKiteService;

	private final GitHubService gitHubService;

	public FetchedData.BuildKiteData fetchGitHubData(GenerateReportRequest request) {
		FetchedData.BuildKiteData buildKiteData = fetchBuildKiteInfo(request);
		Map<String, String> repoMap = getRepoMap(request.getBuildKiteSetting().getDeploymentEnvList());
		List<PipelineLeadTime> pipelineLeadTimes = Collections.emptyList();
		if (Objects.nonNull(request.getCodebaseSetting())
				&& StringUtils.hasLength(request.getCodebaseSetting().getToken())) {
			pipelineLeadTimes = gitHubService.fetchPipelinesLeadTime(buildKiteData.getDeployTimesList(), repoMap,
					request.getCodebaseSetting().getToken());
		}
		buildKiteData.setPipelineLeadTimes(pipelineLeadTimes);
		return buildKiteData;
	}

	public FetchedData.BuildKiteData fetchBuildKiteInfo(GenerateReportRequest request) {
		String startTime = request.getStartTime();
		String endTime = request.getEndTime();
		FetchedData.BuildKiteData result = new FetchedData.BuildKiteData();

		request.getBuildKiteSetting().getDeploymentEnvList().forEach(deploymentEnvironment -> {
			List<BuildKiteBuildInfo> buildKiteBuildInfo = getBuildKiteBuildInfo(startTime, endTime,
					deploymentEnvironment, request.getBuildKiteSetting().getToken(),
					request.getBuildKiteSetting().getPipelineCrews());
			DeployTimes deployTimesList = buildKiteService.countDeployTimes(deploymentEnvironment, buildKiteBuildInfo,
					startTime, endTime);
			result.addBuildKiteBuildInfos(deploymentEnvironment.getId(), buildKiteBuildInfo);
			result.addDeployTimes(deployTimesList);
		});
		return result;
	}

	public List<PipelineCSVInfo> generateCSVForPipeline(String startTime, String endTime,
			FetchedData.BuildKiteData buildKiteData, List<DeploymentEnvironment> deploymentEnvironments) {
		List<PipelineCSVInfo> pipelineCSVInfos = new ArrayList<>();
		deploymentEnvironments.parallelStream().forEach(deploymentEnvironment -> {
			List<BuildKiteBuildInfo> buildInfos = getBuildInfos(buildKiteData.getBuildInfosList(),
					deploymentEnvironment.getId());
			if (!buildInfos.isEmpty()) {
				List<String> pipelineSteps = buildKiteService.getPipelineStepNames(buildInfos);
				if (!pipelineSteps.isEmpty()) {
					List<String> validSteps = buildKiteService.getStepsBeforeEndStep(deploymentEnvironment.getStep(),
							pipelineSteps);
					List<PipelineCSVInfo> pipelineCSVInfoList = buildInfos.stream()
						.filter(buildInfo -> isValidBuildInfo(buildInfo, validSteps, startTime, endTime))
						.map(buildInfo -> getPipelineCSVInfo(startTime, endTime, buildKiteData, deploymentEnvironment,
								buildInfo, validSteps))
						.toList();
					pipelineCSVInfos.addAll(pipelineCSVInfoList);
				}
			}
		});
		return pipelineCSVInfos;
	}

	private PipelineCSVInfo getPipelineCSVInfo(String startTime, String endTime,
			FetchedData.BuildKiteData buildKiteData, DeploymentEnvironment deploymentEnvironment,
			BuildKiteBuildInfo buildInfo, List<String> pipelineSteps) {
		DeployInfo deployInfo = buildKiteService.mapToDeployInfo(buildInfo, pipelineSteps, REQUIRED_STATES, startTime,
				endTime);

		return PipelineCSVInfo.builder()
			.organizationName(deploymentEnvironment.getOrgName())
			.pipeLineName(deploymentEnvironment.getName())
			.stepName(deployInfo.getJobName())
			.valid(deployInfo.getJobName().equals(deploymentEnvironment.getStep()))
			.piplineStatus(buildInfo.getState())
			.buildInfo(buildInfo)
			.deployInfo(deployInfo)
			.leadTimeInfo(new LeadTimeInfo(filterLeadTime(buildKiteData, deploymentEnvironment, deployInfo)))
			.build();
	}

	private boolean isValidBuildInfo(BuildKiteBuildInfo buildInfo, List<String> steps, String startTime,
			String endTime) {
		BuildKiteJob buildKiteJob = buildKiteService.getBuildKiteJob(buildInfo.getJobs(), steps, REQUIRED_STATES,
				startTime, endTime);
		return buildKiteJob != null && !buildInfo.getCommit().isEmpty();
	}

	private List<BuildKiteBuildInfo> getBuildInfos(List<Map.Entry<String, List<BuildKiteBuildInfo>>> buildInfosList,
			String deploymentEnvironmentId) {
		return buildInfosList.stream()
			.filter(entry -> entry.getKey().equals(deploymentEnvironmentId))
			.findFirst()
			.map(Map.Entry::getValue)
			.orElse(new ArrayList<>());
	}

	private LeadTime filterLeadTime(FetchedData.BuildKiteData buildKiteData,
			DeploymentEnvironment deploymentEnvironment, DeployInfo deployInfo) {
		if (Objects.isNull(buildKiteData.getPipelineLeadTimes())) {
			return null;
		}
		return buildKiteData.getPipelineLeadTimes()
			.stream()
			.filter(pipelineLeadTime -> Objects.equals(pipelineLeadTime.getPipelineName(),
					deploymentEnvironment.getName()))
			.flatMap(filteredPipeLineLeadTime -> filteredPipeLineLeadTime.getLeadTimes().stream())
			.filter(leadTime -> leadTime.getCommitId().equals(deployInfo.getCommitId()))
			.findFirst()
			.orElse(null);
	}

	private Map<String, String> getRepoMap(List<DeploymentEnvironment> deploymentEnvironments) {
		return deploymentEnvironments.stream()
			.collect(Collectors.toMap(DeploymentEnvironment::getId, DeploymentEnvironment::getRepository,
					(previousValue, newValue) -> newValue));
	}

	private List<BuildKiteBuildInfo> getBuildKiteBuildInfo(String startTime, String endTime,
			DeploymentEnvironment deploymentEnvironment, String token, List<String> pipelineCrews) {
		List<BuildKiteBuildInfo> buildKiteBuildInfo = buildKiteService.fetchPipelineBuilds(token, deploymentEnvironment,
				startTime, endTime);

		if (!CollectionUtils.isEmpty(pipelineCrews)) {
			buildKiteBuildInfo = buildKiteBuildInfo.stream()
				.filter(info -> ((pipelineCrews.contains("Unknown") && info.getAuthor() == null))
						|| (info.getAuthor() != null && pipelineCrews.contains(info.getAuthor().getName())))
				.toList();
		}
		return buildKiteBuildInfo;
	}

}
