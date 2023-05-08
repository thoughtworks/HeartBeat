package heartbeat.controller.board.dto.response;

import heartbeat.client.dto.board.jira.JiraCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraCardCollection {

	private Integer total;

	private List<JiraCard> issues;

}
