package heartbeat.client;

import heartbeat.client.decoder.BuildKiteFeignClientDecoder;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKitePipelineDTO;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteTokenInfo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@FeignClient(name = "buildKiteFeignClient", url = "${buildKite.url}", configuration = BuildKiteFeignClientDecoder.class)
public interface BuildKiteFeignClient {

	@Cacheable(cacheNames = "tokenInfo", key = "#token")
	@GetMapping(path = "v2/access-token")
	@ResponseStatus(HttpStatus.OK)
	BuildKiteTokenInfo getTokenInfo(@RequestHeader("Authorization") String token);

	@Cacheable(cacheNames = "buildKiteOrganizationInfo", key = "#token")
	@GetMapping(path = "v2/organizations")
	@ResponseStatus(HttpStatus.OK)
	List<BuildKiteOrganizationsInfo> getBuildKiteOrganizationsInfo(@RequestHeader("Authorization") String token);

	@GetMapping(path = "v2/organizations/{organizationId}/pipelines?page={page}&per_page={perPage}")
	@ResponseStatus(HttpStatus.OK)
	ResponseEntity<List<BuildKitePipelineDTO>> getPipelineInfo(@RequestHeader("Authorization") String token,
			@PathVariable String organizationId, @PathVariable String page, @PathVariable String perPage);

	@GetMapping(path = "v2/organizations/{organizationId}/pipelines/{pipelineId}/builds",
			consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	@ResponseStatus(HttpStatus.OK)
	ResponseEntity<List<BuildKiteBuildInfo>> getPipelineSteps(@RequestHeader("Authorization") String token,
			@PathVariable String organizationId, @PathVariable String pipelineId, @RequestParam String page,
			@RequestParam("per_page") String perPage, @RequestParam("created_from") String createdFrom,
			@RequestParam("created_to") String createdTo, @RequestParam("branch[]") List<String> branch);

	@Cacheable(cacheNames = "pipelineStepsInfo",
			key = "#token+'-'+#organizationId+'-'+#pipelineId+'-'+#page+'-'+#perPage+'-'"
					+ "+#createdFrom+'-'+#createdTo+'-'+(#branch!=null ? #branch.toString() : '')")
	@GetMapping(path = "v2/organizations/{organizationId}/pipelines/{pipelineId}/builds",
			consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	@ResponseStatus(HttpStatus.OK)
	List<BuildKiteBuildInfo> getPipelineStepsInfo(@RequestHeader("Authorization") String token,
			@PathVariable String organizationId, @PathVariable String pipelineId, @RequestParam String page,
			@RequestParam("per_page") String perPage, @RequestParam("created_from") String createdFrom,
			@RequestParam("created_to") String createdTo, @RequestParam("branch[]") List<String> branch);

}
