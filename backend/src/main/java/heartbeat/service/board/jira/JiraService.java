package heartbeat.service.board.jira;

import static org.springframework.http.HttpMethod.GET;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.ColumnResponse;
import heartbeat.controller.board.vo.response.ColumnValue;
import heartbeat.controller.board.vo.response.StatusSelf;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	private final RestTemplate restTemplate;

	public BoardConfigResponse getJiraConfiguration(BoardRequest boardRequest) {
		String url = "https://" + boardRequest.getSite() + ".atlassian.net";
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(URI.create(url), boardRequest.getBoardId(),
					boardRequest.getToken());

			return BoardConfigResponse.builder().jiraColumns(
				jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
					.map(jiraColumn -> getColumnNameAndStatus(jiraColumn, boardRequest.getToken())).toList()
			).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
	}

	private ColumnResponse getColumnNameAndStatus (JiraColumn jiraColumn, String token) {
		return ColumnResponse.builder()
			.value(ColumnValue.builder()
				.name(jiraColumn.getName())
				.statuses(jiraColumn.getStatuses().stream()
					.map(jiraColumnStatus -> getColumnStatusCategory(jiraColumnStatus.getSelf(), token).getUntranslatedName().toUpperCase()).toList())
				.build())
			.build();
	}

	public StatusSelf getColumnStatusCategory(String url, String token) {
		return restTemplate.exchange(
			url,
			GET,
			new HttpEntity<>(buildHttpHeaders(token)),
			StatusSelf.class
		).getBody();
	}

	public HttpHeaders buildHttpHeaders(String token) {
		var headers = new HttpHeaders();
		headers.add("Authorization", token);
		return headers;
	}
}
