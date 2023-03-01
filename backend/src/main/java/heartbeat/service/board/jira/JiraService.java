package heartbeat.service.board.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.*;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.*;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	private final JiraFeignClient jiraFeignClient;

	public static final int QUERY_COUNT = 100;

	public static final List<String> fieldsIgnore = List.of("summary", "description", "attachment", "duedate", "issuelinks");

	public BoardConfigResponse getJiraConfiguration(BoardRequest boardRequest) {
		URI baseUrl = URI.create("https://" + boardRequest.getSite() + ".atlassian.net");
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardRequest.getBoardId(),
					boardRequest.getToken());
			List<String> doneColumns = new ArrayList<>();

			return BoardConfigResponse.builder()
					.jiraColumns(
							jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
									.map(jiraColumn -> getColumnNameAndStatus(jiraColumn, baseUrl,
											boardRequest.getToken(), doneColumns))
									.toList())
					.users(getUsers(baseUrl, doneColumns, boardRequest))
					.targetFields(getTargetField(baseUrl, boardRequest))
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

	private List<String> getUsers(URI baseUrl, List<String> doneColumns, BoardRequest boardRequest) {
		if ( doneColumns.isEmpty() ) {
			throw new RequestFailedException(204, "There is no done column.");
		}

		List<DoneCard> doneCards = getAllDoneCards(baseUrl, doneColumns, boardRequest);

		if (isNull(doneCards) || doneCards.isEmpty()) {
			throw new RequestFailedException(204, "There is no done cards.");
		}

		List<Mono<List<String>>> assigneeSetMonos = doneCards.stream()
				.map(doneCard -> Mono.just(getAssigneeSet(baseUrl, doneCard, boardRequest.getToken())))
				.collect(Collectors.toList());

		List<List<String>> assigneeSet = Flux.merge(assigneeSetMonos).collectList().block();

		if (isNull(assigneeSet)) {
			return Collections.emptyList();
		}

		return assigneeSet.stream().flatMap(Collection::stream).distinct().toList();
	}

	private List<DoneCard> getAllDoneCards(URI baseUrl, List<String> doneColumns, BoardRequest boardRequest) {
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s",
				String.join("','", doneColumns), boardRequest.getStartTime(), boardRequest.getEndTime());
		AllDoneCardsResponse allDoneCardsResponse = jiraFeignClient.getAllDoneCards(baseUrl, boardRequest.getBoardId(),
				QUERY_COUNT, 0, jql, boardRequest.getToken());

		List<DoneCard> doneCards = new ArrayList<>(new HashSet<>(allDoneCardsResponse.getIssues()));

		int pages = (int) Math.ceil(Integer.parseInt(allDoneCardsResponse.getTotal()) * 1.0 / QUERY_COUNT);
		if (pages <= 1) {
			return doneCards;
		}

		List<Integer> range = IntStream.rangeClosed(1, pages - 1).boxed().toList();
		List<Mono<AllDoneCardsResponse>> doneCardsResponseMonos = range.stream()
				.map(startFrom -> Mono.just(jiraFeignClient.getAllDoneCards(baseUrl, boardRequest.getBoardId(),
						QUERY_COUNT, startFrom * QUERY_COUNT, jql, boardRequest.getToken())))
				.collect(Collectors.toList());
		List<AllDoneCardsResponse> doneCardsResponses = Flux.merge(doneCardsResponseMonos).collectList().block();

		if (isNull(doneCardsResponses)) {
			throw new RequestFailedException(404, "Cannot get more done cards information.");
		}

		List<DoneCard> moreDoneCards = doneCardsResponses.stream()
				.flatMap(moreDoneCardsResponses -> moreDoneCardsResponses.getIssues().stream()).toList();

		return Stream.concat(doneCards.stream(), moreDoneCards.stream()).toList();
	}

	private List<String> getAssigneeSet(URI baseUrl, DoneCard donecard, String jiraToken) {
		CardHistoryResponse cardHistoryResponse = jiraFeignClient.getJiraCardHistory(baseUrl, donecard.getKey(),
				jiraToken);

		List<String> assigneeSet = cardHistoryResponse.getItems().stream()
				.filter(assignee -> Objects.equals(assignee.getFieldId(), "assignee")
						&& assignee.getTo().getDisplayValue() != null)
				.map(assignee -> assignee.getTo().getDisplayValue()).toList();

		if (assigneeSet.isEmpty() && nonNull(donecard.getFields().getAssignee())
				&& nonNull(donecard.getFields().getAssignee().getDisplayName())) {
			return List.of(donecard.getFields().getAssignee().getDisplayName());
		}
		return assigneeSet;
	}

	private List<TargetField> getTargetField(URI baseUrl, BoardRequest boardRequest) {
		FieldResponse fieldResponse = jiraFeignClient.getTargetField(baseUrl, boardRequest.getProjectKey(), boardRequest.getToken());

		if (isNull(fieldResponse) || fieldResponse.getProjects().isEmpty()) {
			throw new RequestFailedException(404, "There is no target field.");
		}

		List<Issuetype> issuetypes = fieldResponse.getProjects().get(0).getIssuetypes();
		List<TargetField> targetFields = new ArrayList<>();

		return issuetypes.stream()
			.flatMap(issuetype -> getTargetIssueField(issuetype.getFields(), targetFields).stream())
			.distinct()
			.toList();
	}

	private List<TargetField> getTargetIssueField(Map<String, IssueField> fields, List<TargetField> targetFields) {
		fields.forEach(( key, value ) -> {
			if (!fieldsIgnore.contains(value.getKey())) {
				targetFields.add(new TargetField(value.getKey(), value.getName(), false));
			}
		});

		return targetFields;
	}
}

