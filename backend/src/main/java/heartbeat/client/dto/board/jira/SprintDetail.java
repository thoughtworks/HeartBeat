package heartbeat.client.dto.board.jira;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@AllArgsConstructor
@Builder
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SprintDetail {

	private Integer id;

	private String self;

	private Boolean isLast;

	private String state;

	private String name;

	private String startDate;

	private String endDate;

	private String completeDate;

	private Integer originBoardId;

	private String goal;

	public Instant getInstantStartDate() {
		return Instant.parse(this.startDate);
	}
}
