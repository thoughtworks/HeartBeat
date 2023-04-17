package heartbeat.controller.board.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ColumnValue {

	private String name;

	private List<String> statuses;

}
