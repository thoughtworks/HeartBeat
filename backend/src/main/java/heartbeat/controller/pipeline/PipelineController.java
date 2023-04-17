package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.dto.request.PipelineParam;
import heartbeat.controller.pipeline.dto.request.PipelineStepsParam;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponse;
import heartbeat.controller.pipeline.dto.response.PipelineStepsResponse;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pipelines")
@Validated
public class PipelineController {

	private final BuildKiteService buildKiteService;

	@GetMapping("/{pipelineType}")
	public BuildKiteResponse getBuildKiteInfo(@PathVariable String pipelineType, @Valid PipelineParam pipelineParam) {
		return buildKiteService.fetchPipelineInfo(pipelineParam);
	}

	@GetMapping("/{pipelineType}/{organizationId}/pipelines/{buildId}/steps")
	public PipelineStepsResponse getPipelineSteps(
			@RequestHeader("Authorization") @NotBlank(message = "Token must not be blank") String token,
			@PathVariable String pipelineType, @PathVariable String organizationId,
			@PathVariable("buildId") String pipelineId, @Valid @ModelAttribute PipelineStepsParam params) {
		return buildKiteService.fetchPipelineSteps(token, organizationId, pipelineId, params);
	}

}
