package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.vo.request.PipelineStepsParam;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.controller.pipeline.vo.response.PipelineStepsResponse;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Validated
public class PipelineController {

	private final BuildKiteService buildKiteService;

	@GetMapping("/pipelines/{pipelineType}")
	public BuildKiteResponse getBuildKiteInfo(@PathVariable String pipelineType) {
		return buildKiteService.fetchPipelineInfo();
	}

	@GetMapping("/{pipelineType}/{organizationId}/pipelines/{pipelineId}/steps")
	public PipelineStepsResponse getPipelineSteps(
			@RequestHeader("Authorization") @NotBlank(message = "token must not be blank") String token,
			@PathVariable String pipelineType, @PathVariable String organizationId, @PathVariable String pipelineId,
			@Valid @ModelAttribute PipelineStepsParam params) {
		return buildKiteService.fetchPipelineSteps(token, organizationId, pipelineId, params);
	}

}
