package heartbeat.controller.source;

import heartbeat.controller.source.vo.GithubResponse;
import heartbeat.service.source.github.GithubService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/source-control")
@Validated
public class GithubController {

	private final GithubService githubService;

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public GithubResponse getRepos(@RequestParam @NotBlank(message = "token must not be blank") @Pattern(
			regexp = "^(ghp|gho|ghu|ghs|ghr)_([a-zA-Z0-9]{36})$",
			message = "token's pattern is incorrect") String githubToken) {
		return githubService.verifyToken(githubToken);
	}

}
