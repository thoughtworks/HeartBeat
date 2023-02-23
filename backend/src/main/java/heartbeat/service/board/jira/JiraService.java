package heartbeat.service.board.jira;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	public BoardConfigResponse getJiraConfiguration(BoardRequest boardRequest) {
		URI baseUrl = URI.create("https://" + boardRequest.getSite() + ".atlassian.net");
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardRequest.getBoardId(),
					boardRequest.getToken());
			List<String> doneColumn = new ArrayList<>();

			return BoardConfigResponse.builder().jiraColumns(jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
					.map(jiraColumn -> getColumnNameAndStatus(jiraColumn, baseUrl, boardRequest.getToken(), doneColumn))
					.toList()).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
	}

	private ColumnResponse getColumnNameAndStatus(JiraColumn jiraColumn, URI baseUrl, String token,
			List<String> doneColumn) {
		List<StatusSelf> statusSelfList = getStatusSelfList(baseUrl, jiraColumn, token);
		String key = handleColumKey(doneColumn, statusSelfList);

		return ColumnResponse.builder().key(key)
				.value(ColumnValue.builder().name(jiraColumn.getName())
						.statuses(statusSelfList.stream()
								.map(statusSelf -> statusSelf.getUntranslatedName().toUpperCase()).toList())
						.build())
				.build();
	}

	private List<StatusSelf> getStatusSelfList(URI baseUrl, JiraColumn jiraColumn, String token) {
		List<Mono<StatusSelf>> statusSelfMonos = jiraColumn.getStatuses().stream()
				.map(jiraColumnStatus -> getColumnStatusCategory(baseUrl, jiraColumnStatus.getId(), token))
				.collect(Collectors.toList());

		return Flux.merge(statusSelfMonos).collectList().block();
	}

	private Mono<StatusSelf> getColumnStatusCategory(URI baseUrl, String jiraStatusId, String token) {
		return Mono.just(jiraFeignClient.getColumnStatusCategory(baseUrl, jiraStatusId, token));
	}

	private String handleColumKey(List<String> doneColumn, List<StatusSelf> statusSelfList) {
		String doneTag = "done";
		return statusSelfList.stream().map(statusSelf -> {
			if (statusSelf.getStatusCategory().getKey().equals(doneTag)) {
				doneColumn.add(statusSelf.getUntranslatedName().toUpperCase());
			}
			return statusSelf.getStatusCategory().getKey();
		}).anyMatch(statusSelf -> statusSelf.equals(doneTag)) ? doneTag : statusSelfList.stream()
				.reduce((pre, last) -> last).orElse(StatusSelf.builder().build()).getStatusCategory().getName();
	}

}
