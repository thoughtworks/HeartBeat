package heartbeat.service.pipeline.buildkite;

import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteTokenInfo;
import heartbeat.client.dto.pipeline.buildkite.CachePageService;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.client.dto.pipeline.buildkite.PageStepsInfoDto;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.pipeline.dto.request.PipelineStepsParam;
import heartbeat.controller.pipeline.dto.request.TokenParam;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponseDTO;
import heartbeat.controller.pipeline.dto.response.Pipeline;
import heartbeat.controller.pipeline.dto.response.PipelineStepsDTO;
import heartbeat.controller.pipeline.dto.response.PipelineTransformer;
import heartbeat.exception.BaseException;
import heartbeat.exception.InternalServerErrorException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.util.TimeUtil;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Log4j2
public class BuildKiteService {

	private static final List<String> permissions = List.of("read_builds", "read_organizations", "read_pipelines");

	private final CachePageService cachePageService;

	private final ThreadPoolTaskExecutor customTaskExecutor;

	private final BuildKiteFeignClient buildKiteFeignClient;

	@PreDestroy
	public void shutdownExecutor() {
		customTaskExecutor.shutdown();
	}

	private void verifyTokenScopes(BuildKiteTokenInfo buildKiteTokenInfo) {
		for (String permission : permissions) {
			if (!buildKiteTokenInfo.getScopes().contains(permission)) {
				log.error("Failed to call BuildKite, because of insufficient permission, current permissions: {}",
						buildKiteTokenInfo.getScopes());
				throw new PermissionDenyException("Failed to call BuildKite, because of insufficient permission!");
			}
		}
	}

	public List<String> getPipelineStepNames(List<BuildKiteBuildInfo> buildKiteBuildInfos) {
		return buildKiteBuildInfos.stream()
			.flatMap(buildKiteBuildInfo -> buildKiteBuildInfo.getJobs().stream())
			.filter(job -> job != null && job.getName() != null && !job.getName().isEmpty())
			.map(BuildKiteJob::getName)
			.distinct()
			.toList();
	}

	public List<String> getPipelineCrewNames(List<BuildKiteBuildInfo> buildKiteBuildInfos) {
		return buildKiteBuildInfos.stream()
			.filter(buildKiteBuildInfo -> Objects.nonNull(buildKiteBuildInfo.getAuthor()))
			.map(buildKiteBuildInfo -> buildKiteBuildInfo.getAuthor().getName())
			.distinct()
			.sorted()
			.toList();
	}

	public List<String> getStepsBeforeEndStep(String endStep, List<String> steps) {
		int index = steps.indexOf(endStep);
		if (index != -1) {
			return steps.subList(0, index + 1);
		}
		return steps;
	}

	public PipelineStepsDTO fetchPipelineSteps(String token, String organizationId, String pipelineId,
			PipelineStepsParam stepsParam) {
		try {
			log.info("Start to get pipeline steps, organization id: {}, pipeline id: {}", organizationId, pipelineId);

			List<BuildKiteBuildInfo> buildKiteBuildInfos = fetchPipelineStepsByPage(token,
					DeploymentEnvironment.builder().id(pipelineId).orgId(organizationId).build(), stepsParam);

			List<String> sortedSteps = getPipelineStepNames(buildKiteBuildInfos).stream().sorted().toList();
			List<String> pipelineCrews = getPipelineCrewNames(buildKiteBuildInfos);

			List<String> sortedBranches = buildKiteBuildInfos.stream()
				.map(BuildKiteBuildInfo::getBranch)
				.distinct()
				.sorted()
				.toList();

			log.info("Successfully get pipeline steps, organization id: {}, pipeline id: {}, build steps: {}",
					organizationId, pipelineId, sortedSteps);
			return PipelineStepsDTO.builder()
				.pipelineId(pipelineId)
				.steps(sortedSteps)
				.name(stepsParam.getOrgName())
				.orgName(stepsParam.getOrgName())
				.repository(stepsParam.getRepository())
				.orgId(organizationId)
				.branches(sortedBranches)
				.pipelineCrews(pipelineCrews)
				.build();
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to get pipeline steps, organization id: {}, pipeline id: {}, e: {}", organizationId,
					pipelineId, cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to get pipeline steps, organization id: %s, pipeline id: %s, cause is %s",
							organizationId, pipelineId, cause.getMessage()));
		}
	}

	private List<BuildKiteBuildInfo> fetchPipelineStepsByPage(String token, DeploymentEnvironment deploymentEnvironment,
			PipelineStepsParam stepsParam) {
		String page = "1";
		String perPage = "100";
		String orgId = deploymentEnvironment.getOrgId();
		String pipelineId = deploymentEnvironment.getId();
		List<String> branches = deploymentEnvironment.getBranches();
		log.info(
				"Start to paginated pipeline steps pagination info, orgId: {}, pipelineId: {}, stepsParam: {}, page:{}",
				orgId, pipelineId, stepsParam, page);
		String realToken = "Bearer " + token;
		stepsParam.setStartTime(TimeUtil.convertToISOFormat(stepsParam.getStartTime()));
		stepsParam.setEndTime(TimeUtil.convertToISOFormat(stepsParam.getEndTime()));

		PageStepsInfoDto pageStepsInfoDto = cachePageService.fetchPageStepsInfo(realToken, orgId, pipelineId, page,
				perPage, stepsParam.getStartTime(), stepsParam.getEndTime(), branches);
		List<BuildKiteBuildInfo> firstPageStepsInfo = pageStepsInfoDto.getFirstPageStepsInfo();
		int totalPage = pageStepsInfoDto.getTotalPage();
		List<BuildKiteBuildInfo> pageStepsInfo = new ArrayList<>();
		if (firstPageStepsInfo != null) {
			pageStepsInfo.addAll(firstPageStepsInfo);
		}
		if (totalPage != 1) {
			List<CompletableFuture<List<BuildKiteBuildInfo>>> futures = IntStream
				.range(Integer.parseInt(page) + 1, totalPage + 1)
				.mapToObj(currentPage -> getBuildKiteStepsAsync(realToken, orgId, pipelineId, stepsParam, perPage,
						currentPage, branches))
				.toList();
			List<BuildKiteBuildInfo> buildKiteBuildInfos = futures.stream()
				.map(CompletableFuture::join)
				.flatMap(Collection::stream)
				.toList();
			pageStepsInfo.addAll(buildKiteBuildInfos);
		}
		return pageStepsInfo;
	}

	private CompletableFuture<List<BuildKiteBuildInfo>> getBuildKiteStepsAsync(String token, String organizationId,
			String pipelineId, PipelineStepsParam stepsParam, String perPage, int page, List<String> branch) {
		return CompletableFuture.supplyAsync(() -> {
			log.info("Start to paginated pipeline steps info, orgId: {}, pipelineId: {}, stepsParam: {}, page:{}",
					organizationId, pipelineId, stepsParam, page);
			List<BuildKiteBuildInfo> pipelineStepsInfo = buildKiteFeignClient.getPipelineStepsInfo(token,
					organizationId, pipelineId, String.valueOf(page), perPage, stepsParam.getStartTime(),
					stepsParam.getEndTime(), branch);
			log.info(
					"Successfully get paginated pipeline steps info, orgId: {}, pipelineId: {}, pipeline steps size: {}, page:{}",
					organizationId, pipelineId, pipelineStepsInfo.size(), page);
			return pipelineStepsInfo;
		}, customTaskExecutor);
	}

	public List<BuildKiteBuildInfo> fetchPipelineBuilds(String token, DeploymentEnvironment deploymentEnvironment,
			String startTime, String endTime) {
		try {
			log.info("Start to get pipeline builds, param: {}", deploymentEnvironment);
			PipelineStepsParam stepsParam = PipelineStepsParam.builder().startTime(startTime).endTime(endTime).build();
			List<BuildKiteBuildInfo> buildKiteBuildInfos = fetchPipelineStepsByPage(token, deploymentEnvironment,
					stepsParam);
			log.info("Successfully get pipeline builds, param: {}, buildKite build info size: {}",
					deploymentEnvironment, buildKiteBuildInfos.size());
			return buildKiteBuildInfos;
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to get pipeline builds_param:{}, e: {}", deploymentEnvironment, cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(String.format("Failed to get pipeline builds_param: %s, cause is %s",
					deploymentEnvironment, cause.getMessage()));
		}
	}

	public DeployTimes countDeployTimes(DeploymentEnvironment deploymentEnvironment,
			List<BuildKiteBuildInfo> buildInfos, String startTime, String endTime) {
		if (deploymentEnvironment.getOrgId() == null) {
			throw new NotFoundException("Failed to count deployment times due to miss orgId argument");
		}
		List<DeployInfo> passedBuilds = getBuildsByState(buildInfos, deploymentEnvironment, "passed", startTime,
				endTime);
		List<DeployInfo> failedBuilds = getBuildsByState(buildInfos, deploymentEnvironment, "failed", startTime,
				endTime);

		return DeployTimes.builder()
			.pipelineId(deploymentEnvironment.getId())
			.pipelineName(deploymentEnvironment.getName())
			.pipelineStep(deploymentEnvironment.getStep())
			.passed(passedBuilds)
			.failed(failedBuilds)
			.build();
	}

	private List<DeployInfo> getBuildsByState(List<BuildKiteBuildInfo> buildInfos,
			DeploymentEnvironment deploymentEnvironment, String state, String startTime, String endTime) {
		return buildInfos.stream()
			.map(build -> build.mapToDeployInfo(
					getStepsBeforeEndStep(deploymentEnvironment.getStep(), getPipelineStepNames(buildInfos)),
					List.of(state), startTime, endTime))
			.filter(job -> !job.equals(DeployInfo.builder().build()))
			.filter(job -> !job.getJobStartTime().isEmpty())
			.toList();
	}

	public void verifyToken(String token) {
		try {
			String buildKiteToken = "Bearer " + token;
			log.info("Start to query token permissions by token");
			BuildKiteTokenInfo buildKiteTokenInfo = buildKiteFeignClient.getTokenInfo(buildKiteToken);
			log.info("Successfully query token permissions by token, token info scopes: {}",
					buildKiteTokenInfo.getScopes());
			verifyTokenScopes(buildKiteTokenInfo);
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call BuildKite, e: {}", cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call BuildKite, cause is %s", cause.getMessage()));
		}
	}

	public BuildKiteResponseDTO getBuildKiteInfo(TokenParam tokenParam) {
		try {
			String buildKiteToken = "Bearer " + tokenParam.getToken();
			log.info("Start to query BuildKite organizations by token");
			List<BuildKiteOrganizationsInfo> buildKiteOrganizationsInfo = buildKiteFeignClient
				.getBuildKiteOrganizationsInfo(buildKiteToken);
			log.info("Successfully query BuildKite organizations by token, slug: {}", buildKiteOrganizationsInfo);

			log.info("Start to query BuildKite pipelineInfo by organizations slug: {}", buildKiteOrganizationsInfo);
			List<Pipeline> buildKiteInfoList = buildKiteOrganizationsInfo.stream()
				.flatMap(org -> buildKiteFeignClient.getPipelineInfo(buildKiteToken, org.getSlug(), "1", "100")
					.stream()
					.map(pipeline -> PipelineTransformer.fromBuildKitePipelineDto(pipeline, org.getSlug(),
							org.getName())))
				.toList();
			log.info("Successfully get BuildKite pipelineInfo, slug:{}, pipelineInfoList size:{}",
					buildKiteOrganizationsInfo, buildKiteInfoList.size());

			return BuildKiteResponseDTO.builder().pipelineList(buildKiteInfoList).build();
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call BuildKite, e: {}", cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call BuildKite, cause is %s", cause.getMessage()));

		}
	}

}
