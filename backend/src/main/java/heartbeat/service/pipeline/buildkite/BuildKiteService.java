package heartbeat.service.pipeline.buildkite;

import feign.FeignException;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteBuildInfo;
import heartbeat.client.dto.BuildKiteBuildsRequest;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.PipelineDTO;
import heartbeat.controller.pipeline.vo.request.PipelineStepsParam;
import heartbeat.controller.pipeline.vo.response.Pipeline;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.controller.pipeline.vo.response.PipelineTransformer;
import heartbeat.controller.pipeline.vo.response.PipelineStepsResponse;
import heartbeat.exception.RequestFailedException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class BuildKiteService {

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
		BuildKiteBuildsRequest kiteBuildsRequest = BuildKiteBuildsRequest.builder()
			.page("1")
			.perPage("100")
			.createdTo(stepsParam.getStartTime())
			.finishedFrom(stepsParam.getEndTime())
			.build();
		log.info("[BuildKite] Start to fetch pipeline steps, token: {},orgId: {},pipelineId: {},params: {}",
				partialToken, organizationId, pipelineId, stepsParam);
		ResponseEntity<List<BuildKiteBuildInfo>> pipelineStepsInfo = buildKiteFeignClient.getPipelineSteps(token,
				organizationId, pipelineId, "1", "100", stepsParam.getStartTime(), stepsParam.getEndTime());
		log.info("[BuildKite] Successfully get pipeline steps info, token: {},orgId: {},pipelineId: {},result: {}",
				partialToken, organizationId, pipelineId, pipelineStepsInfo);
		return null;
	}

}
