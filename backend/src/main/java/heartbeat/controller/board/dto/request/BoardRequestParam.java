package heartbeat.controller.board.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequestParam {

	@NotBlank(message = "Board Id cannot be empty.")
	private String boardId;

	@NotBlank(message = "Project Key cannot be empty.")
	private String projectKey;

	@NotBlank(message = "Site cannot be empty.")
	private String site;

	@Valid
	@NotBlank(message = "Token cannot be empty.")
	private String token;

	@NotNull(message = "Start time cannot be empty.")
	private String startTime;

	@NotBlank(message = "End time cannot be empty.")
	private String endTime;

}
