package heartbeat.controller.source;

import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.controller.source.dto.SourceControlDTO;
import heartbeat.service.source.github.GitHubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
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
	@Deprecated
	@ResponseStatus(HttpStatus.OK)
	public GitHubResponse getRepos(@RequestBody @Valid SourceControlDTO sourceControlDTO) {
		log.info("Start to get repos by token");
		GitHubResponse gitHubRepos = gitHubService.verifyToken(sourceControlDTO.getToken());
		log.info("Successfully get the repos by token, repos size: {}", gitHubRepos.getGithubRepos().size());
		return gitHubRepos;

	}

	@PostMapping("/{sourceType}/verify")
	public ResponseEntity<Void> verifyToken(@PathVariable String sourceType,
			@RequestBody @Valid SourceControlDTO sourceControlDTO) {
		log.info("Start to verify token");
		gitHubService.verifyTokenV2(sourceControlDTO.getToken());
		log.info("Successfully to verify token");
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
