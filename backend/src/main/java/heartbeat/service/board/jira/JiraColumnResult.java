package heartbeat.service.board.jira;

import heartbeat.controller.board.vo.response.JiraColumnResponse;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class JiraColumnResult {

	private List<JiraColumnResponse> jiraColumnResponses;

	private List<String> doneColumns;

}
