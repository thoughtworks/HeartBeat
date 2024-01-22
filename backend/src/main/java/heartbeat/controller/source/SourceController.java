package heartbeat.controller.source;

import heartbeat.controller.source.dto.SourceControlResponse;
import heartbeat.controller.source.dto.SourceControlDTO;
import heartbeat.controller.source.dto.VerifyBranchRequest;
import heartbeat.service.source.github.GitHubService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Source Control")
@RequestMapping("/source-control")
@Validated
@Log4j2
public class SourceController {

	public static final String TOKEN_PATTER = "^(ghp|gho|ghu|ghs|ghr)_([a-zA-Z0-9]{36})$";

	private final GitHubService gitHubService;

	@PostMapping
	@CrossOrigin
	@Deprecated(since = "frontend completed")
	@ResponseStatus(HttpStatus.OK)
	public SourceControlResponse getRepos(@RequestBody @Valid SourceControlDTO sourceControlDTO) {
		log.info("Start to get repos by token");
		SourceControlResponse gitHubRepos = gitHubService.verifyToken(sourceControlDTO.getToken());
		log.info("Successfully get the repos by token, repos size: {}", gitHubRepos.getGithubRepos().size());
		return gitHubRepos;

	}

	@PostMapping("/{sourceType}/verify")
	public ResponseEntity<Void> verifyToken(
			@Schema(type = "string", allowableValues = { "github" },
					accessMode = Schema.AccessMode.READ_ONLY) @PathVariable SourceType sourceType,
			@RequestBody @Valid SourceControlDTO sourceControlDTO) {
		log.info("Start to verify source type: {} token.", sourceType);
		switch (sourceType) {
			case GITHUB -> {
				gitHubService.verifyTokenV2(sourceControlDTO.getToken());
				log.info("Successfully verify source type: {} token.", sourceType);
			}
			default -> {
			}
		}
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@PostMapping("/{sourceType}/repos/branches/verify")
	public ResponseEntity<Void> verifyBranch(
			@Schema(type = "string", allowableValues = { "github" },
					accessMode = Schema.AccessMode.READ_ONLY) @PathVariable SourceType sourceType,
			@RequestBody @Valid VerifyBranchRequest request) {
		log.info("Start to verify source type: {} branch: {}.", sourceType, request.getBranch());
		switch (sourceType) {
			case GITHUB -> {
				gitHubService.verifyCanReadTargetBranch(request.getRepository(), request.getBranch(),
						request.getToken());
				log.info("Successfully verify source type: {} branch: {}.", sourceType, request.getBranch());
			}
			default -> {
			}
		}
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
