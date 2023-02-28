package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@AllArgsConstructor
@Data
@Builder
public class StatusSelf implements Serializable {

	private String untranslatedName;

	private StatusCategory statusCategory;

}
