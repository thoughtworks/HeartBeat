package heartbeat.controller.board.vo.request;

import heartbeat.controller.board.vo.response.JiraCardResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cards {

	private int storyPointSum;

	private int cardsNumber;

	private List<JiraCardResponse> jiraCardResponseList;

}
