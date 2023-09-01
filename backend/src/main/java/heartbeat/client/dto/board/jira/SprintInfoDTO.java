package heartbeat.client.dto.board.jira;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Builder
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SprintInfoDTO {

	private Integer maxResults;

	private Integer startAt;

	private Boolean isLast;

	@JsonProperty("values")
	private List<SprintDetail> sprintDetails;
}
