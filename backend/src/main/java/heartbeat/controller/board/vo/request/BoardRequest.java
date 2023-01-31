package heartbeat.controller.board.vo.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
// TODO add info about invalid param
public class BoardRequest {

	private String boardName;

	private String boardId;

	private String email;

	private String projectKey;

	private String site;

	@Valid
	@NotBlank
	private String token;

}
