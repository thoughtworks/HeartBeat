package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@AllArgsConstructor
@Data
@Builder
public class StatusSelf {

	private String untranslatedName;

	private StatusCategory statusCategory;
}
