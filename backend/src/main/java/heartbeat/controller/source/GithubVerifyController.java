package heartbeat.controller.source;

import heartbeat.controller.source.vo.GithubResponse;
import heartbeat.service.source.github.GithubVerifyService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sourceControl")
@Validated
public class GithubVerifyController {

	private final GithubVerifyService githubVerifyService;

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public GithubResponse getRepos(@RequestParam @NotBlank String githubToken) {
		return githubVerifyService.verifyToken(githubToken);
	}
}
