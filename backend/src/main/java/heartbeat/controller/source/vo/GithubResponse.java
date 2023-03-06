package heartbeat.controller.source.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GithubResponse {

	private List<String> githubRepos;
}
