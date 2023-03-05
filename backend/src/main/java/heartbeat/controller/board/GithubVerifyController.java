package heartbeat.controller.board;

import heartbeat.controller.board.vo.response.GithubResponse;
import heartbeat.service.board.github.GithubVerifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/codebase/fetch/repos")
public class GithubVerifyController {

	private final GithubVerifyService githubVerifyService;

	@GetMapping
	public GithubResponse getRepos(@RequestParam String githubToken) {
		return githubVerifyService.verifyToken(githubToken);
	}
}
