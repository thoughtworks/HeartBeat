package heartbeat.service.pipeline.buildkite;

import feign.FeignException;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteTokenInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.pipeline.dto.request.PipelineParam;
import heartbeat.controller.pipeline.dto.request.PipelineStepsParam;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponseDTO;
import heartbeat.controller.pipeline.dto.response.Pipeline;
import heartbeat.controller.pipeline.dto.response.PipelineStepsDTO;
import heartbeat.controller.pipeline.dto.response.PipelineTransformer;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.RequestFailedException;
import heartbeat.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2
public class BuildKiteService {

	public static final String BUILD_KITE_LINK_HEADER = HttpHeaders.LINK;

	private static final List<String> permissions = List.of("read_builds", "read_organizations", "read_pipelines");

	private final BuildKiteFeignClient buildKiteFeignClient;

	public BuildKiteResponseDTO fetchPipelineInfo(PipelineParam pipelineParam) {
		try {
			String buildKiteToken = "Bearer " + pipelineParam.getToken();
			log.info("Start to query token permissions by token: {}", TokenUtil.mask(pipelineParam.getToken()));
			BuildKiteTokenInfo buildKiteTokenInfo = buildKiteFeignClient.getTokenInfo(buildKiteToken);
			log.info("Successfully use token:{} to get permissions: {}", TokenUtil.mask(pipelineParam.getToken()),
					buildKiteTokenInfo);
			verifyToken(buildKiteTokenInfo);
			log.info("Start to query organizations BuildKite_token:{}", buildKiteToken);
			List<BuildKiteOrganizationsInfo> buildKiteOrganizationsInfo = buildKiteFeignClient
				.getBuildKiteOrganizationsInfo(buildKiteToken);
			log.info("Successfully get organizations slug: {}", buildKiteOrganizationsInfo);

			log.info("Start to query buildKite pipelineInfo by organizations slug: {}", buildKiteOrganizationsInfo);
			List<Pipeline> buildKiteInfoList = buildKiteOrganizationsInfo.stream()
				.flatMap(org -> buildKiteFeignClient
					.getPipelineInfo(buildKiteToken, org.getSlug(), "1", "100", pipelineParam.getStartTime(),
							pipelineParam.getEndTime())
					.stream()
					.map(pipeline -> PipelineTransformer.fromBuildKitePipelineDto(pipeline, org.getSlug(),
							org.getName())))
				.collect(Collectors.toList());
			log.info("Successfully get buildKite pipelineInfo_slug:{}, pipelineInfoList size is:{}",
					buildKiteOrganizationsInfo, buildKiteInfoList.size());

			return BuildKiteResponseDTO.builder().pipelineList(buildKiteInfoList).build();
		}
		catch (FeignException e) {
			log.error("Failed to call BuildKite_pipelineParam: {}, e: {}", TokenUtil.mask(pipelineParam.getToken()),
					e.getMessage());
			throw new RequestFailedException(e);
		}
	}

	private void verifyToken(BuildKiteTokenInfo buildKiteTokenInfo) {
		for (String permission : permissions) {
			if (!buildKiteTokenInfo.getScopes().contains(permission)) {
				log.error("Failed to call BuildKite, because of insufficient permission, current permissions: {}",
						buildKiteTokenInfo.getScopes());
				throw new PermissionDenyException(403, "Permission deny!");
			}
		}
	}

	public PipelineStepsDTO fetchPipelineSteps(String token, String organizationId, String pipelineId,
			PipelineStepsParam stepsParam) {
		try {
			String partialToken = token.substring(0, token.length() / 2);
			List<BuildKiteBuildInfo> buildKiteBuildInfos = fetchPipelineStepsByPage(token, organizationId, pipelineId,
					stepsParam, partialToken);

			List<String> buildSteps = buildKiteBuildInfos.stream()
				.flatMap(buildKiteBuildInfo -> buildKiteBuildInfo.getJobs().stream())
				.filter(job -> job != null && job.getName() != null && !job.getName().isEmpty())
				.sorted(Comparator.comparing(BuildKiteJob::getName))
				.map(BuildKiteJob::getName)
				.distinct()
				.toList();
			log.info("Successfully get pipeline steps, finally build steps_buildSteps:{}", buildSteps);
			return PipelineStepsDTO.builder()
				.pipelineId(pipelineId)
				.steps(buildSteps)
				.name(stepsParam.getOrgName())
				.orgName(stepsParam.getOrgName())
				.repository(stepsParam.getRepository())
				.orgId(organizationId)
				.build();
		}
		catch (CompletionException e) {
			RequestFailedException requestFailedException = (RequestFailedException) e.getCause();
			if (requestFailedException.getStatus() == HttpStatus.NOT_FOUND.value()) {
				throw new RequestFailedException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Server Error");
			}
			throw requestFailedException;
		}
	}

	private List<BuildKiteBuildInfo> fetchPipelineStepsByPage(String token, String orgId, String pipelineId,
			PipelineStepsParam stepsParam, String partialToken) {
		String page = "1";
		String perPage = "100";
		log.info("Start to paginated pipeline steps info_token: {},orgId: {},pipelineId: {},stepsParam: {},page:{}",
				partialToken, orgId, pipelineId, stepsParam, page);
		ResponseEntity<List<BuildKiteBuildInfo>> pipelineStepsInfo = buildKiteFeignClient.getPipelineSteps(token, orgId,
				pipelineId, page, perPage, stepsParam.getStartTime(), stepsParam.getEndTime());
		log.info(
				"Successfully get paginated pipeline steps info_token:{},orgId: {},pipelineId: {},result status code: {},page:{}",
				partialToken, orgId, pipelineId, pipelineStepsInfo.getStatusCode(), page);

		int totalPage = parseTotalPage(pipelineStepsInfo.getHeaders().get(BUILD_KITE_LINK_HEADER));
		log.info("Successfully parse the total page_total page: {}", totalPage);

		List<BuildKiteBuildInfo> firstPageStepsInfo = pipelineStepsInfo.getBody();
		List<BuildKiteBuildInfo> pageStepsInfo = new ArrayList<>();
		if (firstPageStepsInfo != null) {
			pageStepsInfo.addAll(firstPageStepsInfo);
		}
		if (totalPage != 1) {
			Stream<CompletableFuture<List<BuildKiteBuildInfo>>> futureStream = IntStream
				.range(Integer.parseInt(page) + 1, totalPage + 1)
				.mapToObj(currentPage -> getBuildKiteStepsAsync(token, orgId, pipelineId, stepsParam, perPage,
						currentPage, partialToken));
			List<BuildKiteBuildInfo> buildKiteBuildInfos = futureStream.map(CompletableFuture::join)
				.flatMap(Collection::stream)
				.toList();
			pageStepsInfo.addAll(buildKiteBuildInfos);
		}
		return pageStepsInfo;
	}

	private CompletableFuture<List<BuildKiteBuildInfo>> getBuildKiteStepsAsync(String token, String organizationId,
			String pipelineId, PipelineStepsParam stepsParam, String perPage, int page, String partialToken) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				log.info(
						"Start to paginated pipeline steps info_token: {},orgId: {},pipelineId: {},stepsParam: {},page:{}",
						partialToken, organizationId, pipelineId, stepsParam, page);
				List<BuildKiteBuildInfo> pipelineStepsInfo = buildKiteFeignClient.getPipelineStepsInfo(token,
						organizationId, pipelineId, String.valueOf(page), perPage, stepsParam.getStartTime(),
						stepsParam.getEndTime());
				log.info(
						"Successfully get paginated pipeline steps info_token:{},orgId: {},pipelineId: {},pipeline steps size: {},page:{}",
						partialToken, organizationId, pipelineId, pipelineStepsInfo.size(), page);
				return pipelineStepsInfo;
			}
			catch (RequestFailedException e) {
				log.error(
						"Failed to get BuildKite_steps page_token: {},orgId: {},pipelineId: {}, exception occurred: {},page: {}",
						token, organizationId, pipelineId, e.getMessage(), page);
				throw e;
			}
		});
	}

	private int parseTotalPage(@Nullable List<String> linkHeader) {
		if (linkHeader == null) {
			return 1;
		}
		String lastLink = linkHeader.stream().map(link -> link.replaceAll("per_page=\\d+", "")).findFirst().orElse("");
		Matcher matcher = Pattern.compile("page=(\\d+)[^>]*>;\\s*rel=\"last\"").matcher(lastLink);
		if (matcher.find()) {
			return Integer.parseInt(matcher.group(1));
		}
		return 1;
	}

	public List<BuildKiteBuildInfo> fetchPipelineBuilds(String token, DeploymentEnvironment deploymentEnvironment,
			String startTime, String endTime) {
		String partialToken = token.substring(0, token.length() / 2);
		PipelineStepsParam stepsParam = PipelineStepsParam.builder().startTime(startTime).endTime(endTime).build();

		return this.fetchPipelineStepsByPage(token, deploymentEnvironment.getOrgId(), deploymentEnvironment.getId(),
				stepsParam, partialToken);
	}

	public DeployTimes countDeployTimes(DeploymentEnvironment deploymentEnvironment,
			List<BuildKiteBuildInfo> buildInfos, String startTime, String endTime) {
		if (deploymentEnvironment.getOrgId() == null) {
			throw new NotFoundException(HttpStatus.NOT_FOUND.value(), "miss orgId argument");
		}
		List<DeployInfo> passedBuilds = this.getBuildsByState(buildInfos, deploymentEnvironment, "passed", startTime,
				endTime);
		List<DeployInfo> failedBuilds = this.getBuildsByState(buildInfos, deploymentEnvironment, "failed", startTime,
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
			DeploymentEnvironment deploymentEnvironment, String states, String startTime, String endTime) {
		return buildInfos.stream()
			.map(build -> build.mapToDeployInfo(deploymentEnvironment.getStep(), states, startTime, endTime))
			.filter(job -> !job.equals(DeployInfo.builder().build()))
			.filter(job -> !job.getJobStartTime().isEmpty())
			.toList();
	}

}
