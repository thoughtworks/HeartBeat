package heartbeat.service.board.github;

import heartbeat.controller.board.vo.response.GithubResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
@Log4j2
public class GithubVerifyService {
	public GithubResponse verifyToken(String githubToken) {
		return GithubResponse.builder().githubRepos(List.of("https://github.com/xxxx1/repo1","https://github.com/xxxx2/repo2")).build();
	}
}
