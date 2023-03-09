package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequestParam;
import heartbeat.controller.board.vo.request.BoardType;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.service.board.jira.JiraService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
public class JiraController {

	private final JiraService jiraService;

	@GetMapping("/{boardType}")
	public BoardConfigResponse getBoard(@PathVariable @NotBlank BoardType boardType,
			@Valid BoardRequestParam boardRequestParam) {
		return jiraService.getJiraConfiguration(boardType, boardRequestParam);
	}

}
