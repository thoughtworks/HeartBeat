package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HolidayDTO implements Serializable {

	private String name;

	private String date;

	private Boolean isOffDay;

}
