package heartbeat.service.board.jira;

import heartbeat.controller.board.dto.response.JiraColumnResponse;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraColumnResult {

	private List<JiraColumnResponse> jiraColumnResponses;

	private List<String> doneColumns;

}
