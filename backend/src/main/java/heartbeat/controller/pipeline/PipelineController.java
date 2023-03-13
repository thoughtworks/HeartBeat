package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.vo.BuildKiteResponse;
import heartbeat.service.pipeline.buildKite.BuildKiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pipelines")
@Validated
public class PipelineController {

	private final BuildKiteService buildKiteService;

	@GetMapping
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	public BuildKiteResponse getBuildKiteInfo() {
		return buildKiteService.fetchPipelineInfo();
	}

}
