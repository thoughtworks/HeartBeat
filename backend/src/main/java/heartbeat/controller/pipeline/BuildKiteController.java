package heartbeat.controller.pipeline;

import heartbeat.controller.pipeline.vo.BuildKiteResponse;
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

	@GetMapping("/{pipelineType}")
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	public BuildKiteResponse getBuildKiteInfo(@RequestParam @NotBlank(message = "type must not be blank") String type, String token) {
		return null;
	}

}
