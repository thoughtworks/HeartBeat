package heartbeat.client.dto.board.jira;

import heartbeat.controller.board.dto.response.TargetField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JiraCardWithFields {

	private List<JiraCard> jiraCards;

	private List<TargetField> targetFields;

}
