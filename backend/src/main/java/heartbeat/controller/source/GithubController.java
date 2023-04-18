package heartbeat.controller.source;

import heartbeat.client.dto.codebase.github.GitHubRepos;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.service.source.github.GitHubService;
import heartbeat.util.TokenUtil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

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
@Log4j2
public class GithubController {

	private final GitHubService gitHubService;

	@GetMapping
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	public GitHubResponse getRepos(@RequestParam @NotBlank(message = "token must not be blank") @Pattern(
			regexp = "^(ghp|gho|ghu|ghs|ghr)_([a-zA-Z0-9]{36})$",
			message = "token's pattern is incorrect") String token) {
		String maskedToken = TokenUtil.mask(token);
		log.info("Start to get repos_token: {}", maskedToken);
		GitHubResponse gitHubRepos = gitHubService.verifyToken(token);
		log.info("Successfully get the repos_token: {}, repos: {}", maskedToken, gitHubRepos);
		return gitHubRepos;

	}

}
