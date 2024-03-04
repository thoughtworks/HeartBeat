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
public class BoardConfigDTO {

	@JsonProperty("jiraColumns")
	private List<JiraColumnDTO> jiraColumnResponse;

	private List<String> users;

	private List<TargetField> targetFields;

	private List<TargetField> ignoredTargetFields;

}
