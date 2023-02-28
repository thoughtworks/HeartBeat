package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@Data
@Builder
public class AllDoneCardsResponse implements Serializable {

	private String total;

	private List<DoneCard> issues;

}
