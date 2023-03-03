package heartbeat.service.board.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.AllDoneCardsResponseDTO;
import heartbeat.client.dto.CardHistoryResponseDTO;
import heartbeat.client.dto.DoneCard;
import heartbeat.client.dto.FieldResponseDTO;
import heartbeat.client.dto.IssueField;
import heartbeat.client.dto.Issuetype;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.StatusSelfDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.ColumnValue;
import heartbeat.controller.board.vo.response.JiraColumnResponse;
import heartbeat.controller.board.vo.response.TargetField;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	// Todo: close pool.
	private static final ThreadPoolExecutor executor = new ThreadPoolExecutor(10, 60, 60, TimeUnit.SECONDS,
			new LinkedBlockingQueue<>(100), Executors.defaultThreadFactory(),
			new ThreadPoolExecutor.CallerRunsPolicy());

	public static final int QUERY_COUNT = 100;

	private final JiraFeignClient jiraFeignClient;

	private static final String DONE_CARD_TAG = "done";

	public static final List<String> FIELDS_IGNORE = List.of("summary", "description", "attachment", "duedate",
			"issuelinks");

	public BoardConfigResponse getJiraConfiguration(BoardRequest boardRequest) {
		URI baseUrl = URI.create("https://" + boardRequest.getSite() + ".atlassian.net");
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardRequest.getBoardId(),
					boardRequest.getToken());

			CompletableFuture<JiraColumnResult> jiraColumnsFuture = getJiraColumnsAsync(boardRequest, baseUrl,
					jiraBoardConfigDTO);
			CompletableFuture<List<TargetField>> targetFieldFuture = getTargetFieldAsync(baseUrl, boardRequest);

			return jiraColumnsFuture.thenCompose(
					jiraColumnResult -> getUserAsync(baseUrl, boardRequest, jiraColumnResult.getDoneColumns())
							.thenApply(users -> BoardConfigResponse.builder()
									.jiraColumnResponses(jiraColumnResult.getJiraColumnResponses())
									.targetFields(targetFieldFuture.join()).users(users).build()))
					.join();
		}
		catch (FeignException e) {
			log.error("Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
		catch (CompletionException e) {
			if (e.getCause() instanceof FeignException feignException) {
				throw new RequestFailedException(feignException);
			}
			throw e;
		}
	}

	private CompletableFuture<JiraColumnResult> getJiraColumnsAsync(BoardRequest boardRequest, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		return CompletableFuture.supplyAsync(() -> getJiraColumns(boardRequest, baseUrl, jiraBoardConfigDTO), executor);
	}

	private JiraColumnResult getJiraColumns(BoardRequest boardRequest, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		List<String> doneColumns = new CopyOnWriteArrayList<>();
		List<CompletableFuture<JiraColumnResponse>> futures = jiraBoardConfigDTO.getColumnConfig().getColumns().stream()
				.map(jiraColumn -> CompletableFuture.supplyAsync(
						() -> getColumnNameAndStatus(jiraColumn, baseUrl, boardRequest.getToken(), doneColumns),
						executor))
				.toList();

		List<JiraColumnResponse> columnRespons = futures.stream().map(CompletableFuture::join)
				.collect(Collectors.toList());
		return JiraColumnResult.builder().jiraColumnResponses(columnRespons).doneColumns(doneColumns).build();
	}

	private JiraColumnResponse getColumnNameAndStatus(JiraColumn jiraColumn, URI baseUrl, String token,
			List<String> doneColumns) {
		List<StatusSelfDTO> statusSelfList = getStatusSelfList(baseUrl, jiraColumn, token);
		String key = handleColumKey(doneColumns, statusSelfList);

		return JiraColumnResponse.builder().key(key)
				.value(ColumnValue.builder().name(jiraColumn.getName()).statuses(statusSelfList.stream()
						.map(statusSelf -> statusSelf.getUntranslatedName().toUpperCase()).collect(Collectors.toList()))
						.build())
				.build();
	}

	private List<StatusSelfDTO> getStatusSelfList(URI baseUrl, heartbeat.client.dto.JiraColumn jiraColumn,
			String token) {
		List<CompletableFuture<StatusSelfDTO>> futures = jiraColumn.getStatuses().stream()
				.map(jiraColumnStatus -> CompletableFuture.supplyAsync(() -> {
					return jiraFeignClient.getColumnStatusCategory(baseUrl, jiraColumnStatus.getId(), token);
				}, executor)).toList();

		return futures.stream().map(CompletableFuture::join).collect(Collectors.toList());
	}

	private String handleColumKey(List<String> doneColumn, List<StatusSelfDTO> statusSelfList) {
		List<String> keyList = new ArrayList<>();
		statusSelfList.forEach(statusSelf -> {
			if (statusSelf.getStatusCategory().getKey().equalsIgnoreCase(DONE_CARD_TAG)) {
				doneColumn.add(statusSelf.getUntranslatedName().toUpperCase());
				keyList.add(DONE_CARD_TAG);
			}
			else {
				keyList.add(statusSelf.getStatusCategory().getName());
			}
		});

		return keyList.contains(DONE_CARD_TAG) ? DONE_CARD_TAG
				: keyList.stream().reduce((pre, last) -> last).orElse("");
	}

	private CompletableFuture<List<String>> getUserAsync(URI baseUrl, BoardRequest boardRequest,
			List<String> doneColumns) {
		return CompletableFuture.supplyAsync(() -> getUsers(baseUrl, boardRequest, doneColumns), executor);
	}

	private List<String> getUsers(URI baseUrl, BoardRequest boardRequest, List<String> doneColumns) {
		log.info(doneColumns);
		if (doneColumns.isEmpty()) {
			throw new RequestFailedException(204, "There is no done column.");
		}

		List<DoneCard> doneCards = getAllDoneCards(baseUrl, doneColumns, boardRequest);
		log.info(doneCards);

		if (isNull(doneCards) || doneCards.isEmpty()) {
			throw new RequestFailedException(204, "There is no done cards.");
		}

		List<CompletableFuture<List<String>>> futures = doneCards.stream()
				.map(doneCard -> CompletableFuture
						.supplyAsync(() -> getAssigneeSet(baseUrl, doneCard, boardRequest.getToken()), executor))
				.toList();

		List<List<String>> assigneeList = futures.stream().map(CompletableFuture::join).toList();
		return assigneeList.stream().flatMap(Collection::stream).distinct().toList();
	}

	@SuppressWarnings("PMD")
	private List<DoneCard> getAllDoneCards(URI baseUrl, List<String> doneColumns, BoardRequest boardRequest) {
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s",
				String.join("','", doneColumns), boardRequest.getStartTime(), boardRequest.getEndTime());
		AllDoneCardsResponseDTO allDoneCardsResponseDTO = jiraFeignClient.getAllDoneCards(baseUrl,
				boardRequest.getBoardId(), QUERY_COUNT, 0, jql, boardRequest.getToken());
		log.info(allDoneCardsResponseDTO);

		List<DoneCard> doneCards = new ArrayList<>(new HashSet<>(allDoneCardsResponseDTO.getIssues()));

		int pages = (int) Math.ceil(Double.parseDouble(allDoneCardsResponseDTO.getTotal()) / QUERY_COUNT);
		if (pages <= 1) {
			return doneCards;
		}

		List<Integer> range = IntStream.rangeClosed(1, pages - 1).boxed().toList();
		List<CompletableFuture<AllDoneCardsResponseDTO>> futures = range.stream()
				.map(startFrom -> CompletableFuture.supplyAsync(() -> (jiraFeignClient.getAllDoneCards(baseUrl,
						boardRequest.getBoardId(), QUERY_COUNT, startFrom * QUERY_COUNT, jql, boardRequest.getToken())),
						executor))
				.toList();

		List<AllDoneCardsResponseDTO> doneCardsResponses = futures.stream().map(CompletableFuture::join).toList();
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

	private CompletableFuture<List<TargetField>> getTargetFieldAsync(URI baseUrl, BoardRequest boardRequest) {
		return CompletableFuture.supplyAsync(() -> getTargetField(baseUrl, boardRequest), executor);
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
