package heartbeat.client;

import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.response.AllDoneCardsResponse;
import heartbeat.controller.board.vo.response.CardHistoryResponse;
import heartbeat.controller.board.vo.response.StatusSelf;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.net.URI;

@FeignClient(value = "jiraFeignClient", url = "https://demo.atlassian.net")
public interface JiraFeignClient {

	@GetMapping(path = "/rest/agile/1.0/board/{boardId}/configuration")
	JiraBoardConfigDTO getJiraBoardConfiguration(URI baseUrl, @PathVariable String boardId,
			@RequestHeader String authorization);

	@GetMapping(path = "/status/{statusNum}")
	StatusSelf getColumnStatusCategory(URI baseUrl, @PathVariable String statusNum,
			@RequestHeader String authorization);

	@GetMapping(path = "rest/agile/1.0/board/{boardId}/issue?maxResults={queryCount}&startAt={startAt}&jql={jql}")
	AllDoneCardsResponse getAllDoneCards(URI baseUrl, @PathVariable String boardId, @PathVariable int queryCount, @PathVariable int startAt, @PathVariable String jql,
										 @RequestHeader String authorization);

	@GetMapping(path = "rest/internal/2/issue/{jiraCardKey}/activityfeed")
	CardHistoryResponse getJiraCardHistory(URI baseUrl, @PathVariable String jiraCardKey,
										   @RequestHeader String authorization);
}
