package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraCardField {

	private String summary;

	private Status status;

	private Assignee assignee;

	private IssueType issuetype;

	private Reporter reporter;

	private String statusCategoryChangeDate;

	private int storyPoints;

	private List<FixVersion> fixVersions;

	private JiraProject project;

	private Priority priority;

	private CardParent parent;

	private String label;

}
