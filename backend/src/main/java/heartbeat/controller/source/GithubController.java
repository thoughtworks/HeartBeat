package heartbeat.controller.source;

import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.service.source.github.GitHubService;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequiredArgsConstructor
@RequestMapping("/source-control")
@Validated
@Log4j2
public class GithubController {

	private final GitHubService gitHubService;

	@PostMapping
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	public GitHubResponse getRepos(@RequestBody @Pattern(regexp = "^(ghp|gho|ghu|ghs|ghr)_([a-zA-Z0-9]{36})$",
			message = "token's pattern is incorrect") String token) {
		log.info("Start to get repos by token");
		GitHubResponse gitHubRepos = gitHubService.verifyToken(token);
		log.info("Successfully get the repos by token, repos size: {}", gitHubRepos.getGithubRepos().size());
		return gitHubRepos;

	}

}
