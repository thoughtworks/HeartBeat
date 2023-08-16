package heartbeat.service.board.jira;

import heartbeat.controller.board.dto.response.JiraColumnDTO;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraColumnResult {

	private List<JiraColumnDTO> jiraColumnResponse;

	private List<String> jiraColumns;

}
