package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BoardConfigResponse {

	private List<JiraColumnResponse> jiraColumnResponses;

	private List<String> users;

	private List<TargetField> targetFields;

}
