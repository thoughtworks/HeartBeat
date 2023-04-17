package heartbeat.controller.source;

import heartbeat.controller.source.dto.GitHubResponse;
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
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequiredArgsConstructor
@RequestMapping("/source-control")
@Validated
public class GithubController {

	private final GithubService githubService;

	@GetMapping
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	public GitHubResponse getRepos(@RequestParam @NotBlank(message = "token must not be blank") @Pattern(
			regexp = "^(ghp|gho|ghu|ghs|ghr)_([a-zA-Z0-9]{36})$",
			message = "token's pattern is incorrect") String token) {
		return githubService.verifyToken(token);
	}

}
