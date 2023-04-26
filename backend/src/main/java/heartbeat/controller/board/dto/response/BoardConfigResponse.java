package heartbeat.controller.board.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardConfigResponse {

	@JsonProperty("jiraColumns")
	private List<JiraColumnResponse> jiraColumnResponses;

	private List<String> users;

	private List<TargetField> targetFields;

}
