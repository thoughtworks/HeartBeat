package heartbeat.service.pipeline.buildKite;

import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.PipelineDTO;
import heartbeat.controller.pipeline.vo.BuildKiteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class BuildKiteService {

	private final BuildKiteFeignClient buildKiteFeignClient;

	public BuildKiteResponse fetchPipelineInfo() {

		List<BuildKiteOrganizationsInfo> buildKiteOrganizationsInfo = buildKiteFeignClient
			.getBuildKiteOrganizationsInfo();

		List<PipelineDTO> lists = buildKiteOrganizationsInfo.stream()
			.map(org -> buildKiteFeignClient.getPipelineInfo(org.getSlug(), "1", "100", new Date(), new Date()))
			.flatMap(List::stream)
			.toList();

		return BuildKiteResponse.builder().pipelineList(lists).build();
	}

}
