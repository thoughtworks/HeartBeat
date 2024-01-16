package heartbeat.controller.board;

import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.request.BoardVerifyRequestParam;
import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.controller.board.dto.response.JiraVerifyResponse;
import heartbeat.exception.BadRequestException;
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

	@Deprecated
	@PostMapping("/{boardType}")
	public BoardConfigDTO getBoard(@PathVariable @NotBlank BoardType boardType,
			@Valid @RequestBody BoardRequestParam boardRequestParam) {
		return jiraService.getJiraConfiguration(boardType, boardRequestParam);
	}

	@PostMapping("/{boardType}/verify")
	public JiraVerifyResponse verify(@PathVariable @NotBlank BoardType boardType,
			@Valid @RequestBody BoardVerifyRequestParam boardRequestParam) {
		String projectKey = jiraService.verify(boardType, boardRequestParam);
		return JiraVerifyResponse.builder().projectKey(projectKey).build();
	}

	@PostMapping("/{boardType}/info")
	public BoardConfigDTO getInfo(@PathVariable @NotBlank BoardType boardType,
			@Valid @RequestBody BoardRequestParam boardRequestParam) {
		checkTime(boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		return jiraService.getInfo(boardType, boardRequestParam);
	}

	private void checkTime(String startTimeString, String endTimeString) {
		long startTime = Long.parseLong(startTimeString);
		long endTime = Long.parseLong(endTimeString);
		if (startTime >= endTime) {
			throw new BadRequestException("Time inputs wrong.");
		}
	}

}
