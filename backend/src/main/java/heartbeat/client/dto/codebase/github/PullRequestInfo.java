package heartbeat.client.dto.codebase.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PullRequestInfo implements Serializable {

	private String url;

	private Integer id;

	@JsonProperty("node_id")
	private String nodeId;

	@JsonProperty("html_url")
	private String htmlUrl;

	@JsonProperty("diff_url")
	private String diffUrl;

	@JsonProperty("patch_url")
	private String patchUrl;

	@JsonProperty("issue_url")
	private String issueUrl;

	private Integer number;

	private String state;

	private Boolean lockedprivate;

	private String title;

	private User user;

	private String body;

	@JsonProperty("created_at")
	private String createdAt;

	@JsonProperty("updated_at")
	private String updatedAt;

	@JsonProperty("closed_at")
	private String closedAt;

	@JsonProperty("merged_at")
	private String mergedAt;

	@JsonProperty("merge_commit_sha")
	private String mergeCommitSha;

	private Object assignee;

	private List<Object> assignees;

	@JsonProperty("requested_reviewers")
	private List<Object> requestedReviewers;

	@JsonProperty("requested_teams")
	private List<Object> requestedTeams;

	private List<Object> labels;

	private Object milestone;

	private Boolean draft;

	@JsonProperty("commits_url")
	private String commitsUrl;

	@JsonProperty("review_comments_url")
	private String reviewCommentsUrl;

	@JsonProperty("review_comment_url")
	private String reviewCommentUrl;

	@JsonProperty("comments_url")
	private String commentsUrl;

	@JsonProperty("statuses_url")
	private String statusesUrl;

	private Head head;

	private Base base;

	@JsonProperty("_links")
	private LinkCollection linkCollection;

	@JsonProperty("author_association")
	private String authorAssociation;

	@JsonProperty("auto_merge")
	private Object autoMerge;

	@JsonProperty("active_lock_reason")
	private Object activeLockReason;

}
