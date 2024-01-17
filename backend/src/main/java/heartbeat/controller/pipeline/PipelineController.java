package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.dto.request.PipelineType;
import heartbeat.controller.pipeline.dto.request.TokenParam;
import heartbeat.controller.pipeline.dto.request.PipelineStepsParam;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponseDTO;
import heartbeat.controller.pipeline.dto.response.PipelineStepsDTO;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pipelines")
@Validated
@Log4j2
public class PipelineController {

	private final BuildKiteService buildKiteService;

	@PostMapping("/{pipelineType}/verify")
	public ResponseEntity<Void> verifyBuildKiteToken(@PathVariable PipelineType pipelineType,
			@Valid @RequestBody TokenParam tokenParam) {
		buildKiteService.verifyToken(tokenParam.getToken());
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{pipelineType}/info")
	public ResponseEntity<BuildKiteResponseDTO> fetchBuildKiteInfo(@PathVariable PipelineType pipelineType,
			@Valid @RequestBody TokenParam tokenParam) {
		BuildKiteResponseDTO buildKiteResponse = buildKiteService.getBuildKiteInfo(tokenParam);
		if (buildKiteResponse.getPipelineList().isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		else {
			return ResponseEntity.ok(buildKiteResponse);
		}
	}

	@GetMapping("/{pipelineType}/{organizationId}/pipelines/{buildId}/steps")
	public ResponseEntity<PipelineStepsDTO> getPipelineSteps(
			@RequestHeader("Authorization") @NotBlank(message = "Token must not be blank") String token,
			@PathVariable String pipelineType, @PathVariable String organizationId,
			@PathVariable("buildId") String pipelineId, @Valid @ModelAttribute PipelineStepsParam params) {

		log.info("Start to get pipeline steps, organization id: {}, pipeline id: {}", organizationId, pipelineId);
		PipelineStepsDTO pipelineSteps = buildKiteService.fetchPipelineSteps(token, organizationId, pipelineId, params);
		if (pipelineSteps.getSteps().isEmpty()) {
			log.info("No steps in time range between {} and {}", params.getStartTime(), params.getEndTime());
			return ResponseEntity.noContent().build();
		}
		else {
			log.info("Successfully get pipeline steps, organization id: {}, pipeline id: {}, pipeline steps{}",
					organizationId, pipelineId, pipelineSteps.getSteps());
			return ResponseEntity.ok(pipelineSteps);
		}
	}

}
