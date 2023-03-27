package heartbeat.service.pipeline.buildkite;

import feign.FeignException;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteBuildInfo;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.PipelineDTO;
import heartbeat.controller.pipeline.vo.request.PipelineStepsParam;
import heartbeat.controller.pipeline.vo.response.Pipeline;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.controller.pipeline.vo.response.PipelineTransformer;
import heartbeat.controller.pipeline.vo.response.PipelineStepsResponse;
import heartbeat.exception.RequestFailedException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
		try {
			String partialToken = token.substring(0, token.length() / 2);
			fetchPipelineStepsByPage(token, organizationId, pipelineId, stepsParam, partialToken);
			return PipelineStepsResponse.builder().build();
		} catch (FeignException e) {
			log.error("[BuildKite] Failed when fetch pipeline steps", e);
			throw new RequestFailedException(e);
		}
	}

	private void fetchPipelineStepsByPage(String token, String organizationId, String pipelineId,
			PipelineStepsParam stepsParam, String partialToken) {
		String page = "1";
		String perPage = "100";
		log.info("[BuildKite] Start to fetch page:{} pipeline steps, token: {},orgId: {},pipelineId: {},params: {}",
			page, partialToken, organizationId, pipelineId, stepsParam);
		ResponseEntity<List<BuildKiteBuildInfo>> pipelineStepsInfo = buildKiteFeignClient.getPipelineSteps(token,
				organizationId, pipelineId, page, perPage, stepsParam.getStartTime(), stepsParam.getEndTime());
		log.info(
				"[BuildKite] Successfully get page:{} pipeline steps info, token: {},orgId: {},pipelineId: {},result: {}",
			page, partialToken, organizationId, pipelineId, pipelineStepsInfo);
		if (pipelineStepsInfo != null && pipelineStepsInfo.getStatusCode() == HttpStatus.OK) {
			int totalPage = parseTotalPage(
				pipelineStepsInfo.getHeaders().get(BUILD_KITE_LINK_HEADER));
			log.info("[BuildKite] Successfully parse the total page: {}", totalPage);
		}
	}

	private int parseTotalPage(@Nullable List<String> linkHeader) {
		int currentPage = 1;
		if (linkHeader == null) {
			return currentPage;
		}
		Pattern pattern = Pattern.compile("page=(\\d+)[^>]*>;\\s*rel=\"last\"");
		Matcher matcher = pattern.matcher(
			linkHeader.stream().filter(link -> link.contains("rel=\"last\"")).findFirst().orElse(""));
		if (matcher.find()) {
			return Integer.parseInt(matcher.group(1));
		}
		return currentPage;
	}
}
