package heartbeat.controller.board.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardConfigResponse {

	@JsonProperty("jiraColumns")
	private List<JiraColumnResponse> jiraColumnResponses;

	private List<String> users;

	private List<TargetField> targetFields;

}
