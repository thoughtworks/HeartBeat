package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.controller.pipeline.vo.response.PipelineStepsResponse;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pipelines")
@Validated
public class PipelineController {

	private final BuildKiteService buildKiteService;

	@GetMapping("/{pipelineType}")
	public BuildKiteResponse getBuildKiteInfo(@PathVariable String pipelineType) {
		return buildKiteService.fetchPipelineInfo();
	}

	@GetMapping("/{org}/pipelines/{pipelineId}/steps")
	public PipelineStepsResponse getPipelineSteps(@PathVariable String org, @PathVariable String pipelineId) {
		return buildKiteService.fetchPipelineSteps();
	}

}
