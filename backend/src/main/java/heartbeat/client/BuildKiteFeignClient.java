package heartbeat.client;

import heartbeat.client.dto.BuildKiteBuildInfo;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.PipelineDTO;
import java.util.List;
import heartbeat.client.dto.BuildKitePipelineDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@FeignClient(name = "buildKiteFeignClient", url = "${buildKite.url}")
public interface BuildKiteFeignClient {

	@GetMapping(path = "v2/organizations")
	@ResponseStatus(HttpStatus.OK)
	List<BuildKiteOrganizationsInfo> getBuildKiteOrganizationsInfo();

	@GetMapping(path = "v2/organizations/{organizationId}/pipelines?page={page}&per_page={perPage}")
	@ResponseStatus(HttpStatus.OK)
	List<BuildKitePipelineDTO> getPipelineInfo(@PathVariable String organizationId, @PathVariable String page,
			@PathVariable String perPage);

	@GetMapping(path = "v2/organizations/{organizationId}/pipelines/{pipelineId}/builds")
	@ResponseStatus(HttpStatus.OK)
	ResponseEntity<List<BuildKiteBuildInfo>> getPipelineSteps(@RequestHeader("Authorization") String token,
			@PathVariable String organizationId, @PathVariable String pipelineId, @RequestParam String page,
			@RequestParam("per_page") String perPage, @RequestParam("created_to") String createdTo,
			@RequestParam("finished_from") String finishedFrom);

}
