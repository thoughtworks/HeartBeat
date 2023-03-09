package heartbeat.controller.source.vo;

import lombok.Builder;
import lombok.Data;

import java.util.LinkedHashSet;

@Data
@Builder
public class GithubResponse {

	private LinkedHashSet<String> githubRepos;

}
