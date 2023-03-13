package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.vo.BuildKiteResponse;
import heartbeat.service.pipeline.buildKite.BuildKiteService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pipeline")
@Validated
public class BuildKiteController {

	private final BuildKiteService buildKiteService;

	@GetMapping
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	public BuildKiteResponse getBuildKiteInfo() {
		return buildKiteService.fetchPipelineInfo();
	}

}
