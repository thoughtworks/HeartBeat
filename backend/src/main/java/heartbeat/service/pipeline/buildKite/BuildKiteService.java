package heartbeat.service.pipeline.buildKite;

import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.controller.pipeline.vo.BuildKiteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class BuildKiteService {

	private final BuildKiteFeignClient buildKiteFeignClient;

	public BuildKiteResponse fetchPipelineInfo() {

		List<BuildKiteOrganizationsInfo> buildKiteOrganizationsInfo = buildKiteFeignClient
			.getBuildKiteOrganizationsInfo();

		return BuildKiteResponse.builder().buildKiteOrganizationsInfoList(buildKiteOrganizationsInfo).build();
	}

}
