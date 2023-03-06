package heartbeat.service.board.jira;

import java.util.List;
import heartbeat.controller.board.vo.response.JiraColumnResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraColumnResult {

	private List<JiraColumnResponse> jiraColumnResponses;

	private List<String> doneColumns;

}
