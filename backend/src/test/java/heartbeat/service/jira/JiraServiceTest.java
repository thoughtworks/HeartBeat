package heartbeat.service.jira;

import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.service.board.jira.JiraService.QUERY_COUNT;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_FIELD_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_MULTI_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_RESPONSE_BUILDER_WITHOUT_STATUS;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_1;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_2;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_3;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COMPLETE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CYCLE_TIME_INFO_LIST;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DOING_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DONE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.FIELD_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_SETTING_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_SETTING_HAVE_UNKNOWN_COLUMN_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.NONE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_FORM_ALL_DONE_CARD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import heartbeat.util.BoardUtil;

import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletionException;

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

	ObjectMapper objectMapper = new ObjectMapper();

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
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(
				new TargetField("customfield_10016", "Story point estimate", false),
				new TargetField("customfield_10020", "Sprint", false),
				new TargetField("customfield_10021", "Flagged", false));

		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistory(any(), any(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());
		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);
		jiraService.shutdownExecutor();

		assertThat(boardConfigDTO.getJiraColumnRespons()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfigHasTwoPage() throws IOException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(
				new TargetField("customfield_10016", "Story point estimate", false),
				new TargetField("customfield_10020", "Sprint", false),
				new TargetField("customfield_10021", "Flagged", false));
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 100, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);

		assertThat(boardConfigDTO.getJiraColumnRespons()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetClassicJiraBoardConfig()
			throws JsonProcessingException {
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
		List<TargetField> expectTargetField = List.of(
				new TargetField("customfield_10016", "Story point estimate", false),
				new TargetField("customfield_10020", "Sprint", false),
				new TargetField("customfield_10021", "Flagged", false));
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_3, token)).thenReturn(completeStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistory(any(), any(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeClassicJira, boardRequestParam);

		assertThat(boardConfigDTO.getJiraColumnRespons()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnRespons().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
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
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(null, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 400, error: boardType param is not correct");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowNonContentCodeWhenGetJiraBoardConfig() throws JsonProcessingException {
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
			.thenReturn(objectMapper.writeValueAsString(ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER().build()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: There is no done cards.");
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
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: There is no done column.");
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
	void shouldReturnAssigneeNameFromDoneCardWhenGetAssigneeSet() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistory(any(), any(), any()))
			.thenReturn(new CardHistoryResponseDTO(Collections.emptyList()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);

		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getUsers().get(0)).isEqualTo("Zhang San");
	}

	@Test
	void shouldThrowExceptionWhenGetTargetFieldFailed() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, BOARD_ID, token)).thenReturn(jiraBoardConfigDTO);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
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

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, BOARD_ID, token)).thenReturn(jiraBoardConfigDTO);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token)).thenReturn(null);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: There is no target field.");
	}

	@Test
	void shouldThrowExceptionWhenGetTargetFieldReturnEmpty() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		FieldResponseDTO emptyProjectFieldResponse = FieldResponseDTO.builder()
			.projects(Collections.emptyList())
			.build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, BOARD_ID, token)).thenReturn(jiraBoardConfigDTO);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenReturn(emptyProjectFieldResponse);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status statusCode 204, error: There is no target field.");
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

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BoardRequestParam.builder().build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Request failed with status code 400, error: ", "");
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTime() throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("\"storyPoints\":0", "\"customfield_10016\":null")
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "2", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(boardUtil.getCardTimeForEachStep(any())).thenReturn(CYCLE_TIME_INFO_LIST());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));

		assertThat(cardCollection.getStoryPointSum()).isEqualTo(0);
		assertThat(cardCollection.getCardsNumber()).isEqualTo(1);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getCardCycleTime().getTotal()).isEqualTo(16);
	}

	@Test
	void shouldReturnIllegalArgumentExceptionWhenHaveUnknownColumn() throws JsonProcessingException {
		String token = "token";
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_HAVE_UNKNOWN_COLUMN_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "2", token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER_WITHOUT_STATUS().build());
		when(boardUtil.getCardTimeForEachStep(any())).thenReturn(CYCLE_TIME_INFO_LIST());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getStoryPointsAndCycleTime(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), List.of("Zhang San")))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Type does not find!");
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForActiveSprint()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getAllDoneCards(any(), any(), anyInt(), anyInt(), any(), any()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns());
		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForActiveSprintWithStatusIsEmpty()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS()
			.build();

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getAllDoneCards(any(), any(), anyInt(), anyInt(), any(), any()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns());

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForKanban()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jqlForKanban = "status not in ('" + String.join("','", storyPointsAndCycleTimeRequest.getStatus())
				+ "')";
		String jqlForActiveSprint = "sprint in openSprints() AND status not in ('"
				+ String.join("','", storyPointsAndCycleTimeRequest.getStatus()) + "')";
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jqlForActiveSprint,
				boardRequestParam.getToken()))
			.thenReturn("");
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jqlForKanban,
				boardRequestParam.getToken()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));

		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns());

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForKanbanWithStatusIsEmpty()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS()
			.build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jqlForKanban = "";
		String jqlForActiveSprint = "sprint in openSprints() ";
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jqlForActiveSprint,
				boardRequestParam.getToken()))
			.thenReturn("");
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jqlForKanban,
				boardRequestParam.getToken()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));

		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns());

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnJiraBoardConfigDTOWhenCallGetJiraBoardConfig() {
		String token = "token";
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		JiraBoardConfigDTO mockResponse = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();

		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any())).thenReturn(mockResponse);
		JiraBoardConfigDTO result = jiraService.getJiraBoardConfig(baseUrl, BOARD_ID, token);

		assertThat(mockResponse).isEqualTo(result);
	}

}
