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

	public static final List<String> FIELDS_IGNORE = List.of("summary", "description", "attachment", "duedate",
			"issuelinks");

	public BoardConfigResponse getJiraConfiguration(BoardRequest boardRequest) {
		URI baseUrl = URI.create("https://" + boardRequest.getSite() + ".atlassian.net");
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardRequest.getBoardId(),
					boardRequest.getToken());
			List<String> doneColumns = new ArrayList<>();

			return BoardConfigResponse.builder()
					.jiraColumns(jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
							.map(jiraColumn -> getColumnNameAndStatus(jiraColumn, baseUrl, boardRequest.getToken(),
									doneColumns))
							.toList())
					.users(getUsers(baseUrl, doneColumns, boardRequest))
					.targetFields(getTargetField(baseUrl, boardRequest)).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
	}

	private ColumnResponse getColumnNameAndStatus(JiraColumn jiraColumn, URI baseUrl, String token,
			List<String> doneColumn) {
		List<StatusSelfDTO> statusSelfList = getStatusSelfList(baseUrl, jiraColumn, token);
		String key = handleColumKey(doneColumn, statusSelfList);

		return ColumnResponse.builder().key(key)
				.value(ColumnValue.builder().name(jiraColumn.getName())
						.statuses(statusSelfList.stream()
								.map(statusSelf -> statusSelf.getUntranslatedName().toUpperCase()).toList())
						.build())
				.build();
	}

	private List<StatusSelfDTO> getStatusSelfList(URI baseUrl, JiraColumn jiraColumn, String token) {
		List<Mono<StatusSelfDTO>> statusSelfMonos = jiraColumn.getStatuses().stream()
				.map(jiraColumnStatus -> getColumnStatusCategory(baseUrl, jiraColumnStatus.getId(), token))
				.collect(Collectors.toList());

		return Flux.merge(statusSelfMonos).collectList().block();
	}

	private Mono<StatusSelfDTO> getColumnStatusCategory(URI baseUrl, String jiraStatusId, String token) {
		return Mono.just(jiraFeignClient.getColumnStatusCategory(baseUrl, jiraStatusId, token));
	}

	private String handleColumKey(List<String> doneColumn, List<StatusSelfDTO> statusSelfList) {
		String doneTag = "done";
		List<String> keyList = statusSelfList.stream().map(statusSelf -> {
			if (statusSelf.getStatusCategory().getKey().equalsIgnoreCase(doneTag)) {
				doneColumn.add(statusSelf.getUntranslatedName().toUpperCase());
			}
			return statusSelf.getStatusCategory().getKey();
		}).toList();

		return (keyList.contains(doneTag)) ? doneTag : statusSelfList.stream().reduce((pre, last) -> last)
				.orElse(StatusSelfDTO.builder().build()).getStatusCategory().getName();
	}

	private List<String> getUsers(URI baseUrl, List<String> doneColumns, BoardRequest boardRequest) {
		log.info(doneColumns);
		if (doneColumns.isEmpty()) {
			throw new RequestFailedException(204, "There is no done column.");
		}

		List<DoneCard> doneCards = getAllDoneCards(baseUrl, doneColumns, boardRequest);
		log.info(doneCards);

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
		AllDoneCardsResponseDTO allDoneCardsResponseDTO = jiraFeignClient.getAllDoneCards(baseUrl, boardRequest.getBoardId(),
				QUERY_COUNT, 0, jql, boardRequest.getToken());
		log.info(allDoneCardsResponseDTO);

		List<DoneCard> doneCards = new ArrayList<>(new HashSet<>(allDoneCardsResponseDTO.getIssues()));

		int pages = (int) Math.ceil(Integer.parseInt(allDoneCardsResponseDTO.getTotal()) * 1.0 / QUERY_COUNT);
		if (pages <= 1) {
			return doneCards;
		}

		List<Integer> range = IntStream.rangeClosed(1, pages - 1).boxed().toList();
		List<Mono<AllDoneCardsResponseDTO>> doneCardsResponseMonos = range.stream()
				.map(startFrom -> Mono.just(jiraFeignClient.getAllDoneCards(baseUrl, boardRequest.getBoardId(),
						QUERY_COUNT, startFrom * QUERY_COUNT, jql, boardRequest.getToken())))
				.collect(Collectors.toList());
		List<AllDoneCardsResponseDTO> doneCardsResponses = Flux.merge(doneCardsResponseMonos).collectList().block();

		if (isNull(doneCardsResponses)) {
			throw new RequestFailedException(404, "Cannot get more done cards information.");
		}

		List<DoneCard> moreDoneCards = doneCardsResponses.stream()
				.flatMap(moreDoneCardsResponses -> moreDoneCardsResponses.getIssues().stream()).toList();

		return Stream.concat(doneCards.stream(), moreDoneCards.stream()).toList();
	}

	private List<String> getAssigneeSet(URI baseUrl, DoneCard donecard, String jiraToken) {
		CardHistoryResponseDTO cardHistoryResponseDTO = jiraFeignClient.getJiraCardHistory(baseUrl, donecard.getKey(),
				jiraToken);

		List<String> assigneeSet = cardHistoryResponseDTO.getItems().stream()
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
		FieldResponseDTO fieldResponse = jiraFeignClient.getTargetField(baseUrl, boardRequest.getProjectKey(),
				boardRequest.getToken());

		if (isNull(fieldResponse) || fieldResponse.getProjects().isEmpty()) {
			throw new RequestFailedException(404, "There is no target field.");
		}

		List<Issuetype> issueTypes = fieldResponse.getProjects().get(0).getIssuetypes();
		return issueTypes.stream().flatMap(issuetype -> getTargetIssueField(issuetype.getFields()).stream()).distinct()
				.toList();
	}

	private List<TargetField> getTargetIssueField(Map<String, IssueField> fields) {
		List<TargetField> targetFields = new ArrayList<>();
		fields.values().forEach(issueField -> {
			if (!FIELDS_IGNORE.contains(issueField.getKey())) {
				targetFields.add(new TargetField(issueField.getKey(), issueField.getName(), false));
			}
		});

		return targetFields;
	}

}
