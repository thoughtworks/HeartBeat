package heartbeat.controller.board;

import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.service.board.jira.JiraService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
public class JiraController {

	private final JiraService jiraService;

	@PostMapping("/{boardType}")
	public BoardConfigDTO getBoard(@PathVariable @NotBlank BoardType boardType,
			@Valid @RequestBody BoardRequestParam boardRequestParam) {
		return jiraService.getJiraConfiguration(boardType, boardRequestParam);
	}

}
