package heartbeat.client.dto.codebase.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitInfo implements Serializable {

	private String sha;

	@JsonProperty("node_id")
	private String nodeId;

	private Commit commit;

	private String url;

	@JsonProperty("html_url")
	private String htmlUrl;

	@JsonProperty("comments_url")
	private String commentsUrl;

	private AuthorOuter author;

	private CommitterOuter committer;

	private List<Parent> parents;

	private Stats stats;

	private List<File> files;

}
