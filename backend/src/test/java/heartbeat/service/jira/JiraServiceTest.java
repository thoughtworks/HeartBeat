package heartbeat.service.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.component.JiraUriGenerator;

import heartbeat.client.dto.board.jira.AllDoneCardsResponseDTO;
import heartbeat.client.dto.board.jira.HistoryDetail;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardFields;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.request.Cards;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;

import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.response.BoardConfigResponse;
import heartbeat.controller.board.dto.response.CardCycleTime;
import heartbeat.controller.board.dto.response.JiraCardResponse;
import heartbeat.controller.board.dto.response.StepsDay;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import heartbeat.util.BoardUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletionException;

import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.service.board.jira.JiraService.QUERY_COUNT;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {

	public static final String SITE_ATLASSIAN_NET = "https://site.atlassian.net";

	public static final String JIRA_JQL = "status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s";

	private final BoardType boardTypeJira = BoardType.fromValue("jira");

	private final BoardType boardTypeClassicJira = BoardType.fromValue("classic-jira");

	@Mock
	JiraFeignClient jiraFeignClient;

	JiraService jiraService;

	@Mock
	JiraUriGenerator urlGenerator;

	ThreadPoolTaskExecutor executor;

	@Mock
	BoardUtil boardUtil;

	@BeforeEach
	public void setUp() {
		jiraService = new JiraService(executor = getTaskExecutor(), jiraFeignClient, urlGenerator, boardUtil);
	}

	@AfterEach
	public void tearDown() {
		executor.shutdown();
	}

	public ThreadPoolTaskExecutor getTaskExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(10);
		executor.setMaxPoolSize(100);
		executor.setQueueCapacity(500);
		executor.setKeepAliveSeconds(60);
		executor.setThreadNamePrefix("Heartbeat-");
		executor.initialize();
		return executor;
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(new TargetField("priority", "Priority", false),
				new TargetField("timetracking", "Time tracking", false));

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);
		jiraService.shutdownExecutor();
		assertThat(boardConfigResponse.getJiraColumnResponses()).hasSize(1);
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getStatuses().get(0))
			.isEqualTo("DONE");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getStatuses().get(1))
			.isEqualTo("DOING");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigResponse.getUsers()).hasSize(1);
		assertThat(boardConfigResponse.getTargetFields()).hasSize(2);
		assertThat(boardConfigResponse.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfigHasTwoPage() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(new TargetField("priority", "Priority", false),
				new TargetField("timetracking", "Time tracking", false));

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 100, jql, token))
			.thenReturn(ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);

		assertThat(boardConfigResponse.getJiraColumnResponses()).hasSize(1);
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getStatuses().get(0))
			.isEqualTo("DONE");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getStatuses().get(1))
			.isEqualTo("DOING");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigResponse.getUsers()).hasSize(1);
		assertThat(boardConfigResponse.getTargetFields()).hasSize(2);
		assertThat(boardConfigResponse.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetClassicJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO completeStatusSelf = COMPLETE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s', '%s') AND (status changed to '%s' during (%s, %s) or status changed to '%s' during (%s, %s))",
				"DONE", "COMPLETE", "DONE", boardRequestParam.getStartTime(), boardRequestParam.getEndTime(),
				"COMPLETE", boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(new TargetField("priority", "Priority", false),
				new TargetField("timetracking", "Time tracking", false));

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_3, token)).thenReturn(completeStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 100, jql, token))
			.thenReturn(ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardTypeClassicJira,
				boardRequestParam);

		assertThat(boardConfigResponse.getJiraColumnResponses()).hasSize(1);
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getStatuses().get(0))
			.isEqualTo("DONE");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getValue().getStatuses().get(1))
			.isEqualTo("DOING");
		assertThat(boardConfigResponse.getJiraColumnResponses().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigResponse.getUsers()).hasSize(1);
		assertThat(boardConfigResponse.getTargetFields()).hasSize(2);
		assertThat(boardConfigResponse.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndThrowParamExceptionWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(null, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining(
					"Request failed with status statusCode 400, error: [Jira] boardType param is not correct");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowNonContentCodeWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: [Jira] There is no done cards.");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowNonColumnWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO noneStatusSelf = NONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(noneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: [Jira] There is no done column.");
	}

	@Test
	void shouldThrowExceptionWhenGetJiraConfigurationThrowsUnExpectedException() {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		when(jiraFeignClient.getJiraBoardConfiguration(any(URI.class), any(), any()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(CompletionException.class)
			.hasMessageContaining("UnExpected Exception");
	}

	@Test
	void shouldReturnAssigneeNameFromDoneCardWhenGetAssigneeSet() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(new CardHistoryResponseDTO(Collections.emptyList()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);

		assertThat(boardConfigResponse.getUsers()).hasSize(1);
		assertThat(boardConfigResponse.getUsers().get(0)).isEqualTo("Zhang San");
	}

	@Test
	void shouldThrowExceptionWhenGetTargetFieldFailed() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(JIRA_JQL, "DONE", boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, BOARD_ID, token)).thenReturn(jiraBoardConfigDTO);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(new CardHistoryResponseDTO(Collections.emptyList()));
		FeignException mockException = mock(FeignException.class);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(500);
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenThrow(mockException);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 500, error: exception");
	}

	@Test
	void shouldThrowExceptionWhenGetTargetFieldReturnNull() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(JIRA_JQL, "DONE", boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<HistoryDetail> items = Collections.singletonList(new HistoryDetail(1, "", new Status(""), new Status("")));
		CardHistoryResponseDTO cardHistoryResponse = CardHistoryResponseDTO.builder().items(items).build();

		AllDoneCardsResponseDTO allDoneCardsResponse = AllDoneCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(new JiraCard("1", new JiraCardFields())))
			.build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, BOARD_ID, token)).thenReturn(jiraBoardConfigDTO);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(allDoneCardsResponse);
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token)).thenReturn(cardHistoryResponse);
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token)).thenReturn(null);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: [Jira] There is no target field.");
	}

	@Test
	void shouldThrowExceptionWhenGetTargetFieldReturnEmpty() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(JIRA_JQL, "DONE", boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		FieldResponseDTO emptyProjectFieldResponse = FieldResponseDTO.builder()
			.projects(Collections.emptyList())
			.build();
		List<HistoryDetail> items = Collections
			.singletonList(new HistoryDetail(1, "assignee", new Status(null), new Status(null)));
		CardHistoryResponseDTO cardHistoryResponse = CardHistoryResponseDTO.builder().items(items).build();

		AllDoneCardsResponseDTO allDoneCardsResponse = AllDoneCardsResponseDTO.builder()
			.total("2")
			.issues(List.of(new JiraCard("1", new JiraCardFields())))
			.build();
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, BOARD_ID, token)).thenReturn(jiraBoardConfigDTO);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(allDoneCardsResponse);
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token)).thenReturn(cardHistoryResponse);
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenReturn(emptyProjectFieldResponse);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: [Jira] There is no target field.");
	}

	@Test
	void shouldThrowCustomExceptionWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		FeignException mockException = mock(FeignException.class);

		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenThrow(mockException);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 400, error: exception");
	}

	@Test
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardConfigFailed() {
		FeignException mockException = mock(FeignException.class);
		System.out.println(Math.ceil(0));

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BoardRequestParam.builder().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 400, error: ", "");
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTime() {
		String token = "token";
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());

		Cards cards = jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));
		CardCycleTime cardCycleTime = CardCycleTime.builder()
			.name("1")
			.steps(StepsDay.builder().
				analyse(0.0).development(0.0).waiting(0.0).testing(0.0)
				.blocked(0.0)
				.review(0.0)
				.build())
			.total(0.0)
			.build();
		Cards expect = Cards.builder()
			.cardsNumber(1)
			.jiraCardResponseList(List.of(JiraCardResponse.builder()
				.baseInfo(JiraCard.builder()
					.key("1").fields(JiraCardFields.builder()
						.assignee(Assignee.builder()
							.displayName("Zhang San")
							.build())
						.build())
					.build())
					.cycleTime(List.of())
					.originCycleTime(List.of())
					.cardCycleTime(cardCycleTime)
				.build()))
			.build();

		Assertions.assertEquals(expect, cards);
	}

}
