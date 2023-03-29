package heartbeat.service.pipeline.buildkite;

import feign.FeignException;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteBuildInfo;
import heartbeat.client.dto.BuildKiteJob;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.controller.pipeline.vo.request.PipelineStepsParam;
import heartbeat.controller.pipeline.vo.response.Pipeline;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.controller.pipeline.vo.response.PipelineTransformer;
import heartbeat.controller.pipeline.vo.response.PipelineStepsResponse;
import heartbeat.exception.RequestFailedException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class BuildKiteService {

	public static final String BUILD_KITE_LINK_HEADER = HttpHeaders.LINK;

	private final BuildKiteFeignClient buildKiteFeignClient;

	public BuildKiteResponse fetchPipelineInfo() {
		try {
			log.info("[BuildKite] Start to query organizations");
			List<BuildKiteOrganizationsInfo> buildKiteOrganizationsInfo = buildKiteFeignClient
				.getBuildKiteOrganizationsInfo();
			log.info("[BuildKite] Successfully get organizations slug:" + buildKiteOrganizationsInfo);

			log.info("[BuildKite] Start to query buildKite pipelineInfo by organizations slug:"
					+ buildKiteOrganizationsInfo);
			List<Pipeline> buildKiteInfoList = buildKiteOrganizationsInfo.stream()
				.flatMap(org -> buildKiteFeignClient.getPipelineInfo(org.getSlug(), "1", "100")
					.stream()
					.map(pipeline -> PipelineTransformer.fromBuildKitePipelineDto(pipeline, org.getSlug(),
							org.getName())))
				.collect(Collectors.toList());
			log.info("[BuildKite] Successfully get buildKite pipelineInfo, pipelineInfoList size is:"
					+ buildKiteInfoList.size());

			return BuildKiteResponse.builder().pipelineList(buildKiteInfoList).build();
		}
		catch (FeignException e) {
			log.error("[BuildKite] Failed when call BuildKite", e);
			throw new RequestFailedException(e);
		}
	}

	public PipelineStepsResponse fetchPipelineSteps(String token, String organizationId, String pipelineId,
			PipelineStepsParam stepsParam) {
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
		log.info("[BuildKite] Successfully get pipeline steps, finally build steps:{}", buildSteps);
		return PipelineStepsResponse.builder()
			.steps(buildSteps)
			.name(stepsParam.getOrgName())
			.orgName(stepsParam.getOrgName())
			.repository(stepsParam.getRepository())
			.orgId(organizationId)
			.build();
	}

	private List<BuildKiteBuildInfo> fetchPipelineStepsByPage(String token, String organizationId, String pipelineId,
			PipelineStepsParam stepsParam, String partialToken) {
		String page = "1";
		String perPage = "100";
		log.info("[BuildKite] Start to fetch page:{} pipeline steps, token: {},orgId: {},pipelineId: {},params: {}",
				page, partialToken, organizationId, pipelineId, stepsParam);
		ResponseEntity<List<BuildKiteBuildInfo>> pipelineStepsInfo = buildKiteFeignClient.getPipelineSteps(token,
				organizationId, pipelineId, page, perPage, stepsParam.getStartTime(), stepsParam.getEndTime());
		log.info(
				"[BuildKite] Successfully get page:{} pipeline steps info, token: {},orgId: {},pipelineId: {},result status code: {}",
				page, partialToken, organizationId, pipelineId, pipelineStepsInfo.getStatusCode());

		int totalPage = parseTotalPage(pipelineStepsInfo.getHeaders().get(BUILD_KITE_LINK_HEADER));
		log.info("[BuildKite] Successfully parse the total page: {}", totalPage);

		List<BuildKiteBuildInfo> firstPageStepsInfo = pipelineStepsInfo.getBody();
		List<BuildKiteBuildInfo> pageStepsInfo = new ArrayList<>();
		if (firstPageStepsInfo != null) {
			pageStepsInfo.addAll(firstPageStepsInfo);
		}
		if (totalPage != 1) {
			Stream<CompletableFuture<List<BuildKiteBuildInfo>>> futureStream = IntStream.range(1, totalPage + 1)
				.mapToObj(currentPage -> getBuildKiteStepsAsync(token, organizationId, pipelineId, stepsParam, perPage,
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
			log.info("[BuildKite] Start to fetch page:{} pipeline steps, token: {},orgId: {},pipelineId: {},params: {}",
					page, partialToken, organizationId, pipelineId, stepsParam);
			List<BuildKiteBuildInfo> pipelineStepsInfo = buildKiteFeignClient.getPipelineStepsInfo(token,
					organizationId, pipelineId, String.valueOf(page), perPage, stepsParam.getStartTime(),
					stepsParam.getEndTime());
			log.info(
					"[BuildKite] Successfully get page:{} pipeline steps info, token: {},orgId: {},pipelineId: {},pipelineStepsInfo size: {}",
					page, partialToken, organizationId, pipelineId, pipelineStepsInfo.size());
			return pipelineStepsInfo;
		}).exceptionally(e -> {
			log.error(
					"[BuildKite] Failed to get build kite steps page: {}, token: {},orgId: {},pipelineId: {}, exception occurred: {}",
					page, token, organizationId, pipelineId, e.getMessage());
			return Collections.emptyList();
		});
	}

	private int parseTotalPage(@Nullable List<String> linkHeader) {
		int currentPage = 1;
		if (linkHeader == null) {
			return currentPage;
		}
		String lastLink = linkHeader.stream().map(link -> link.replaceAll("per_page=\\d+", "")).findFirst().orElse("");
		Matcher matcher = Pattern.compile("page=(\\d+)[^>]*>;\\s*rel=\"last\"").matcher(lastLink);
		if (matcher.find()) {
			return Integer.parseInt(matcher.group(1));
		}
		return currentPage;
	}

}
