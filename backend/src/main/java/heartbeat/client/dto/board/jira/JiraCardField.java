package heartbeat.client.dto.board.jira;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.JsonElement;
import heartbeat.controller.board.dto.response.CardParent;
import heartbeat.controller.board.dto.response.FixVersion;
import heartbeat.controller.board.dto.response.IssueType;
import heartbeat.controller.board.dto.response.JiraProject;
import heartbeat.controller.board.dto.response.Priority;
import heartbeat.controller.board.dto.response.Reporter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JiraCardField {

	private Assignee assignee;

	private String summary;

	private Status status;

	private IssueType issuetype;

	private Reporter reporter;

	private String statuscategorychangedate;

	private double storyPoints;

	private List<FixVersion> fixVersions;

	private JiraProject project;

	private Priority priority;

	private CardParent parent;

	private Sprint sprint;

	private List<String> labels;

	private Map<String, JsonElement> customFields;

}
