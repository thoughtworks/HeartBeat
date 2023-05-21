package heartbeat.controller.board.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardCustomFieldKey {

	private String storyPoints;

	private String sprint;

	private String flagged;

	private String development;

	private String partner;

	private String startDate;

	private String QA;

	private String rank;

	private String issueColor;

	private String feature;

}
