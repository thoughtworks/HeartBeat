package heartbeat.client.dto;

import java.io.Serializable;
import java.util.List;

import heartbeat.controller.board.vo.response.CardParent;
import heartbeat.controller.board.vo.response.FixVersion;
import heartbeat.controller.board.vo.response.IssueType;
import heartbeat.controller.board.vo.response.JiraProject;
import heartbeat.controller.board.vo.response.Priority;
import heartbeat.controller.board.vo.response.Reporter;
import heartbeat.controller.board.vo.response.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class JiraCardFields implements Serializable {

	private Assignee assignee;

	private String summary;

	private Status status;

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
