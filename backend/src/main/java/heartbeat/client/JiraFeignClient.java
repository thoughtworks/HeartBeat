package heartbeat.client;

import heartbeat.client.decoder.JiraFeignClientDecoder;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraBoardProject;
import heartbeat.client.dto.board.jira.JiraBoardVerifyDTO;
import heartbeat.client.dto.board.jira.StatusSelfDTO;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.net.URI;

@FeignClient(value = "jiraFeignClient", url = "${jira.url}", configuration = JiraFeignClientDecoder.class)
public interface JiraFeignClient {

	@Cacheable(cacheNames = "jiraConfig", key = "#boardId+'-'+#authorization")
	@GetMapping(path = "/rest/agile/1.0/board/{boardId}/configuration")
	JiraBoardConfigDTO getJiraBoardConfiguration(URI baseUrl, @PathVariable String boardId,
			@RequestHeader String authorization);

	@Cacheable(cacheNames = "jiraStatusCategory", key = "#statusNum+'-'+#authorization")
	@GetMapping(path = "/rest/api/2/status/{statusNum}")
	StatusSelfDTO getColumnStatusCategory(URI baseUrl, @PathVariable String statusNum,
			@RequestHeader String authorization);

	@Cacheable(cacheNames = "jiraCards", key = "#boardId+'-'+#queryCount+'-'+#startAt+'-'+#jql+'-'+#authorization")
	@GetMapping(path = "/rest/agile/1.0/board/{boardId}/issue?maxResults={queryCount}&startAt={startAt}&jql={jql}")
	String getJiraCards(URI baseUrl, @PathVariable String boardId, @PathVariable int queryCount,
			@PathVariable int startAt, @PathVariable String jql, @RequestHeader String authorization);

	@GetMapping(path = "/rest/internal/2/issue/{jiraCardKey}/activityfeed?startAt={startAt}&maxResults={queryCount}")
	@Cacheable(cacheNames = "jiraCardHistoryByCount",
			key = "#jiraCardKey+'-'+#queryCount+'-'+#startAt+'-'+#authorization")
	CardHistoryResponseDTO getJiraCardHistoryByCount(URI baseUrl, @PathVariable String jiraCardKey,
			@PathVariable int startAt, @PathVariable int queryCount, @RequestHeader String authorization);

	@Cacheable(cacheNames = "targetField", key = "#projectKey+'-'+#authorization")
	@GetMapping(path = "/rest/api/2/issue/createmeta?projectKeys={projectKey}&expand=projects.issuetypes.fields")
	FieldResponseDTO getTargetField(URI baseUrl, @PathVariable String projectKey, @RequestHeader String authorization);

	@GetMapping(path = "/rest/agile/1.0/board/{boardId}")
	JiraBoardVerifyDTO getBoard(URI baseUrl, @PathVariable String boardId, @RequestHeader String authorization);

	@Cacheable(cacheNames = "boardProject", key = "#projectIdOrKey+'-'+#authorization")
	@GetMapping(path = "rest/api/2/project/{projectIdOrKey}")
	JiraBoardProject getProject(URI baseUrl, @PathVariable String projectIdOrKey, @RequestHeader String authorization);

	// This api is solely used for site url checking
	@GetMapping(path = "/rest/api/3/dashboard")
	String getDashboard(URI baseUrl, @RequestHeader String authorization);

}
