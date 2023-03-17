package heartbeat.service.jira;

import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.service.board.jira.JiraService.QUERY_COUNT;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_CARDS_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_1;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_2;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DOING_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DONE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.FIELD_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.CardHistoryResponseDTO;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.StatusSelfDTO;
import heartbeat.controller.board.vo.request.BoardRequestParam;
import heartbeat.controller.board.vo.request.BoardType;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.TargetField;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {

	public static final String SITE_ATLASSIAN_NET = "https://site.atlassian.net";

	public static final String JIRA_JQL = "status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s";

	private final BoardType boardType = BoardType.JIRA;

	@Mock
	JiraFeignClient jiraFeignClient;

	JiraService jiraService;

	ThreadPoolTaskExecutor executor;

	@BeforeEach
	public void setUp() {
		jiraService = new JiraService(executor = getTaskExecutor(), jiraFeignClient);
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
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardType, boardRequestParam);

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
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardType, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: [Jira] There is no done cards.");
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
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(new CardHistoryResponseDTO(Collections.emptyList()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardType, boardRequestParam);

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

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardType, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 500, error: exception");
	}

	@Test
	void shouldThrowCustomExceptionWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		FeignException mockException = mock(FeignException.class);

		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenThrow(mockException);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardType, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 400, error: exception");
	}

	@Test
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardConfigFailed() {
		FeignException mockException = mock(FeignException.class);
		System.out.println(Math.ceil(0));

		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardType, BoardRequestParam.builder().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 400, error: ", "");
	}

}
