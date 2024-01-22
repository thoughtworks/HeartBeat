package heartbeat.controller.source.dto;

import lombok.Builder;
import lombok.Data;

import java.util.LinkedHashSet;

@Data
@Builder
@Deprecated
public class SourceControlResponse {

	private LinkedHashSet<String> githubRepos;

}
