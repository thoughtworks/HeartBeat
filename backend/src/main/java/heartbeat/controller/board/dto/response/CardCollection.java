package heartbeat.controller.board.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardCollection {

	private double storyPointSum;

	private int cardsNumber;

	private List<JiraCardDTO> jiraCardDTOList;

	private int reworkCardNumber;

	private double reworkRatio;

}
