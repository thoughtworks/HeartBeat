package heartbeat.service.board.jira;

import static org.springframework.http.HttpMethod.GET;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.JiraColumnStatus;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.ColumnResponse;
import heartbeat.controller.board.vo.response.ColumnValue;
import heartbeat.controller.board.vo.response.StatusSelf;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.val;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
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

			val columns = jiraBoardConfigDTO.getColumnConfig().getColumns();
			val processColumns = processColumns(columns, boardRequest.getToken());

			return BoardConfigResponse.builder()
				.jiraColumns(jiraBoardConfigDTO.getColumnConfig()
					.getColumns()
					.stream()
				.map(this::mapToResponseColumn)
					.collect(Collectors.toList()))
				.build();
		} catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
	}


	private ArrayList<ColumnResponse> processColumns(List<JiraColumn> columns, String token) {
		val jiraColumnNames = new ArrayList<ColumnResponse>();
		RestTemplate restTemplate = new RestTemplate();

		for (JiraColumn column : columns) {
			if (column.getStatuses().size() > 0) {
				ColumnValue columnValue = ColumnValue.builder().name(column.getName()).build();

				for (JiraColumnStatus status : column.getStatuses()) {
					HttpHeaders headers = new HttpHeaders();
					headers.set(HttpHeaders.AUTHORIZATION, token);
					HttpEntity<?> entity = new HttpEntity<>(headers);

					ResponseEntity<StatusSelf> response = restTemplate.exchange(
						status.getSelf(),
						HttpMethod.GET,
						entity,
						StatusSelf.class
					);

					for (String untranslatedName : response.getBody().getUntranslatedNames()) {
						String cardStatusName = untranslatedName.toUpperCase();
						columnValue.getStatuses().add(cardStatusName);
					}
				}

				jiraColumnNames.add(ColumnResponse.builder().value(columnValue).build());
			}
		}
		return jiraColumnNames;
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

	private ColumnResponse mapToResponseColumn(JiraColumn column) {
		return ColumnResponse.builder().value(ColumnValue.builder().name(column.getName()).build()).build();
	}

}
