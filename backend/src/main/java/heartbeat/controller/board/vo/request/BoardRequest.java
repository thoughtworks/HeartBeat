package heartbeat.controller.board.vo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardRequest {

	private String boardName;
	private String boardId;
	private String email;
	private String projectKey;
	private String site;
	@NotBlank
	private String token;
}
