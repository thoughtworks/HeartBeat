package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HolidayDTO {

	private String name;

	private String date;

	private Boolean isOffDay;

}
