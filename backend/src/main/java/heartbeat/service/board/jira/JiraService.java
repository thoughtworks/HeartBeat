package heartbeat.service.board.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.*;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	private final static int QUERY_COUNT = 100;

	public BoardConfigResponse getJiraConfiguration(BoardRequest boardRequest) {
		URI baseUrl = URI.create("https://" + boardRequest.getSite() + ".atlassian.net");
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardRequest.getBoardId(),
					boardRequest.getToken());
			List<String> doneColumns = new ArrayList<>();

			return BoardConfigResponse.builder()
				.jiraColumns(jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
					.map(jiraColumn -> getColumnNameAndStatus(jiraColumn, baseUrl, boardRequest.getToken(), doneColumns))
					.toList())
				.users(getUsers(baseUrl, doneColumns, boardRequest))
				.build();
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

	private List<String> getUsers (URI baseUrl, List<String> doneColumns, BoardRequest boardRequest) {
		List<DoneCard> doneCards = getAllDoneCards(baseUrl, doneColumns, boardRequest);

		if (doneColumns.isEmpty() || isNull(doneCards)) {
			throw new RequestFailedException(404, "There is no done column.");
		}

		List<Mono<List<String>>> assigneeSetMonos = doneCards.stream()
			.map(doneCard -> Mono.just(getAssigneeSet(baseUrl, doneCard, boardRequest.getToken())))
			.collect(Collectors.toList());

		List<List<String>> assigneeSet = Flux.merge(assigneeSetMonos).collectList().block();

		if (isNull(assigneeSet)) {
			return Collections.emptyList();
		}

		return assigneeSet.stream()
			.flatMap(Collection::stream)
			.toList();
	}

	private List<DoneCard> getAllDoneCards(URI baseUrl, List<String> doneColumns, BoardRequest boardRequest) {
		if (doneColumns.isEmpty()) {
			return null;
		}
		int startAt = 0;
		int page = 1;
		boolean isFirstTime = true;
		List<DoneCard> doneCards = new ArrayList<>();
		String jql = String.format("status in '%s' AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", String.join(",", doneColumns), boardRequest.getStartTime(), boardRequest.getEndTime());

		for (int i = 0; i < page; i++) {
			AllDoneCardsResponse allDoneCardsResponse = jiraFeignClient.getAllDoneCards(baseUrl, boardRequest.getBoardId(), QUERY_COUNT, startAt, jql, boardRequest.getToken());
			if (isFirstTime) {
				page = Integer.parseInt(allDoneCardsResponse.getTotal()) / QUERY_COUNT + 1;
				isFirstTime = false;
			}
			startAt = (i + 1) * QUERY_COUNT;
			doneCards.add(allDoneCardsResponse.getIssues());
		}

		return doneCards;
	}

	private List<String> getAssigneeSet (URI baseUrl, DoneCard donecard, String jiraToken) {
		CardHistoryResponse cardHistoryResponse = jiraFeignClient.getJiraCardHistory(baseUrl, donecard.getKey(), jiraToken);

		List<String> assigneeSet = cardHistoryResponse.getItems().stream()
			.filter(assignee -> Objects.equals(assignee.getFieldId(), "assignee") && assignee.getTo().getDisplayValue() != null)
			.map(assignee -> assignee.getTo().getDisplayValue())
			.toList();

		if (assigneeSet.isEmpty() && nonNull(donecard.getFields().getAssignee()) && nonNull(donecard.getFields().getAssignee().getDisplayName())) {
			return List.of(donecard.getFields().getAssignee().getDisplayName());
		}
		return assigneeSet;
	}
}
