package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ColumnValue {

	private String name;

	private List<String> statuses;

}
