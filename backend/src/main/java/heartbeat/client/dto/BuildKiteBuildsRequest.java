package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildKiteBuildsRequest {

	private String page;

	@JsonProperty("per_page")
	private String perPage;

	@JsonProperty("created_to")
	private String createdTo;

	@JsonProperty("finished_from")
	private String finishedFrom;

}
