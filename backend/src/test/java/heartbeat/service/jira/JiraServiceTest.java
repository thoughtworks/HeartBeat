package heartbeat.service.jira;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.board.jira.CardHistoryResponseDTO;
import heartbeat.client.dto.board.jira.FieldResponseDTO;
import heartbeat.client.dto.board.jira.HistoryDetail;
import heartbeat.client.dto.board.jira.JiraBoardConfigDTO;
import heartbeat.client.dto.board.jira.JiraBoardProject;
import heartbeat.client.dto.board.jira.JiraBoardVerifyDTO;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.client.dto.board.jira.StatusSelfDTO;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.request.BoardVerifyRequestParam;
import heartbeat.controller.board.dto.request.CardStepsEnum;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.request.ReworkTimesSetting;
import heartbeat.controller.board.dto.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.BaseException;
import heartbeat.exception.CustomFeignClientException;
import heartbeat.exception.InternalServerErrorException;
import heartbeat.exception.NoContentException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.UnauthorizedException;
import heartbeat.service.board.jira.AssigneeFilterMethod;
import heartbeat.service.board.jira.JiraService;
import heartbeat.util.BoardUtil;
import heartbeat.util.SystemUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletionException;

import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.controller.board.dto.request.BoardVerifyRequestFixture.BOARD_VERIFY_REQUEST_BUILDER;
import static heartbeat.service.board.jira.JiraService.NONE_DONE_MAX_QUERY_COUNT;
import static heartbeat.service.board.jira.JiraService.QUERY_COUNT;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_CARDS_RESPONSE_FOR_ASSIGNEE_FILTER_TEST;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_FIELD_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_FIELD_RESPONSE_BUILDER_HAS_STORY_POINT;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ALL_REAL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD1_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD1_HISTORY_FOR_MULTIPLE_STATUSES;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD1_HISTORY_FOR_MULTIPLE_STATUSES_WITH_FLAG;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD2_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD2_HISTORY_FOR_MULTIPLE_STATUSES;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD3_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD3_HISTORY_FOR_MULTIPLE_STATUSES;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_DONE_TIME_GREATER_THAN_END_TIME_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_MULTI_REAL_DONE_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_MULTI_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_REAL_DONE_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_RESPONSE_BUILDER_TO_DONE;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CARD_HISTORY_WITH_NO_STATUS_FIELD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CLASSIC_JIRA_BOARD_SETTING_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CLASSIC_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_1;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_2;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COLUM_SELF_ID_3;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.COMPLETE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.CYCLE_TIME_INFO_LIST;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DOING_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DONE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.FIELD_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.INCLUDE_UNREASONABLE_FIELD_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.INCORRECT_JIRA_BOARD_SETTING_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.INCORRECT_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_REAL_DONE_SETTING_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_SETTING_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_SETTING_HAVE_UNKNOWN_COLUMN_BUILD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.NEED_FILTERED_ALL_DONE_CARDS_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.NONE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_FORM_ALL_DONE_CARD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_FORM_ALL_REAL_DONE_CARD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_REQUEST_WITH_ASSIGNEE_FILTER_METHOD;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES;
import static heartbeat.service.jira.JiraBoardVerifyDTOFixture.JIRA_BOARD_VERIFY_FAILED_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardVerifyDTOFixture.JIRA_BOARD_VERIFY_RESPONSE_BUILDER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {

	public static final String SITE_ATLASSIAN_NET = "https://site.atlassian.net";

	public static final String INVALID_SITE_ATLASSIAN_NET = "https://unknown.atlassian.net";

	private final BoardType boardTypeJira = BoardType.fromStyle("next-gen");

	private final BoardType boardTypeClassicJira = BoardType.fromStyle("classic");

	private static final String ALL_CARDS_JQL = "status changed during (%s, %s)";

	@Mock
	JiraFeignClient jiraFeignClient;

	JiraService jiraService;

	@Mock
	JiraUriGenerator urlGenerator;

	ThreadPoolTaskExecutor executor;

	@Mock
	BoardUtil boardUtil;

	@Mock
	SystemUtil systemUtil;

	ObjectMapper objectMapper = new ObjectMapper();

	@BeforeEach
	public void setUp() {
		jiraService = new JiraService(executor = getTaskExecutor(), jiraFeignClient, urlGenerator, boardUtil,
				systemUtil);
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
	@Deprecated
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
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
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());
		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);
		jiraService.shutdownExecutor();

		assertThat(boardConfigDTO.getJiraColumnResponse()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardInfoResponseWhenGetJiraBoardInfo() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
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
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getInfo(boardTypeJira, boardRequestParam);
		jiraService.shutdownExecutor();
		assertThat(boardConfigDTO.getJiraColumnResponse()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardVerifyResponseWhenVerifyJiraBoard() {
		JiraBoardVerifyDTO jiraBoardVerifyDTO = JIRA_BOARD_VERIFY_RESPONSE_BUILDER().build();
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);

		doReturn(jiraBoardVerifyDTO).when(jiraFeignClient)
			.getBoard(baseUrl, boardVerifyRequestParam.getBoardId(), boardVerifyRequestParam.getToken());
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));

		String projectKey = jiraService.verify(BoardType.JIRA, boardVerifyRequestParam);
		jiraService.shutdownExecutor();
		assertThat(Objects.requireNonNull(projectKey)).isEqualTo("ADM");
	}

	@Test
	@Deprecated
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfigHasTwoPage() throws IOException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
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
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 100, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);
		assertThat(boardConfigDTO.getJiraColumnResponse()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardInfoResponseWhenGetJiraBoardInfoHasTwoPage() throws IOException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(
				new TargetField("customfield_10016", "Story point estimate", false),
				new TargetField("customfield_10020", "Sprint", false),
				new TargetField("customfield_10021", "Flagged", false));
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_TWO_PAGES_CARDS_RESPONSE_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 100, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getInfo(boardTypeJira, boardRequestParam);
		assertThat(boardConfigDTO.getJiraColumnResponse()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	@Deprecated
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetClassicJiraBoardConfig()
			throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO completeStatusSelf = COMPLETE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
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
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeClassicJira, boardRequestParam);

		assertThat(boardConfigDTO.getJiraColumnResponse()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldCallJiraFeignClientAndReturnBoardInfoResponseWhenGetClassicJiraBoardInfo()
			throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO completeStatusSelf = COMPLETE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(
				new TargetField("customfield_10016", "Story point estimate", false),
				new TargetField("customfield_10020", "Sprint", false),
				new TargetField("customfield_10021", "Flagged", false));
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("classic").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_3, token)).thenReturn(completeStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getInfo(boardTypeJira, boardRequestParam);
		assertThat(boardConfigDTO.getJiraColumnResponse()).hasSize(1);
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigDTO.getJiraColumnResponse().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	@Deprecated
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
			.isInstanceOf(BadRequestException.class)
			.hasMessageContaining("boardType param is not correct");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowParamExceptionWhenGetJiraBoardInfo() {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		assertThatThrownBy(() -> jiraService.getInfo(null, boardRequestParam)).isInstanceOf(BadRequestException.class)
			.hasMessageContaining("boardType param is not correct");
	}

	@Test
	void shouldThrowExceptionWhenVerifyJiraBoardTypeNotCorrect() {
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		assertThatThrownBy(() -> jiraService.verify(BoardType.CLASSIC_JIRA, boardVerifyRequestParam))
			.isInstanceOf(BadRequestException.class)
			.hasMessageContaining("boardType param is not correct");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowNonColumnWhenVerifyJiraBoard() {
		JiraBoardVerifyDTO jiraBoardVerifyDTO = JIRA_BOARD_VERIFY_FAILED_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardVerifyDTO).when(jiraFeignClient).getBoard(baseUrl, BOARD_ID, token);

		Throwable thrown = catchThrowable(() -> jiraService.verify(boardTypeJira, boardVerifyRequestParam));
		assertThat(thrown).isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Failed to call Jira to verify board, cause is");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowBaseExceptionWhenVerifyJiraBoard() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doThrow(new UnauthorizedException("")).when(jiraFeignClient)
			.getBoard(baseUrl, boardVerifyRequestParam.getBoardId(), boardVerifyRequestParam.getToken());

		Throwable thrown = catchThrowable(() -> jiraService.verify(boardTypeJira, boardVerifyRequestParam));
		assertThat(thrown).isInstanceOf(BaseException.class);
	}

	@Test
	void shouldCallJiraFeignClientBoardAndThrowNotFoundWhenVerifyJiraBoard() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doThrow(new NotFoundException("boardId is incorrect")).when(jiraFeignClient).getBoard(baseUrl, BOARD_ID, token);

		Throwable thrown = catchThrowable(() -> jiraService.verify(boardTypeJira, boardVerifyRequestParam));
		assertThat(thrown).isInstanceOf(RuntimeException.class).hasMessageContaining("boardId is incorrect");
	}

	@Test
	void shouldCallJiraFeignClientBoardAndThrowNotFoundWhenVerifyJiraBoardSite() {
		URI baseUrl = URI.create(INVALID_SITE_ATLASSIAN_NET);
		String token = "token";
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(INVALID_SITE_ATLASSIAN_NET));
		doThrow(new NotFoundException("site is incorrect")).when(jiraFeignClient).getDashboard(baseUrl, token);

		Throwable thrown = catchThrowable(() -> jiraService.verify(boardTypeJira, boardVerifyRequestParam));
		assertThat(thrown).isInstanceOf(RuntimeException.class).hasMessageContaining("site is incorrect");

	}

	@Test
	@Deprecated
	void shouldCallJiraFeignClientAndThrowNotFoundExceptionWhenGetJiraBoardConfig() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token))
			.thenThrow(new NotFoundException("message"));
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(new CardHistoryResponseDTO(true, Collections.emptyList()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatCode(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.doesNotThrowAnyException();
	}

	@Test
	void shouldCallJiraFeignClientTwiceGivenTwoPageHistoryDataWhenGetJiraBoardConfig() throws JsonProcessingException {
		// given
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";

		JiraBoardSetting jiraBoardSetting = CLASSIC_JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = CLASSIC_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD()
			.build();
		String allDoneCards = objectMapper.writeValueAsString(NEED_FILTERED_ALL_DONE_CARDS_BUILDER().build());

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(new CardHistoryResponseDTO(false, new ArrayList<>(
					List.of(new HistoryDetail(1, "status", new Status("To do"), new Status("Block"), null, null)))));
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 100, 100, token))
			.thenReturn(new CardHistoryResponseDTO(true, new ArrayList<>(
					List.of(new HistoryDetail(2, "assignee", new Status("In Dev"), new Status("To do"), null, null)))));
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		// when
		jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(storyPointsAndCycleTimeRequest,
				jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");
		// then
		verify(jiraFeignClient, times(2)).getJiraCardHistoryByCount(any(), eq("2"), anyInt(), anyInt(), any());
	}

	@Test
	@Deprecated
	void shouldCallJiraFeignClientAndThrowNonContentCodeWhenGetJiraBoardConfig() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(objectMapper.writeValueAsString(ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER().build()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(NoContentException.class)
			.hasMessageContaining("There is no cards.");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowNonContentCodeWhenGetJiraBoardInfo() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
			.thenReturn(objectMapper.writeValueAsString(ONE_PAGE_NO_DONE_CARDS_RESPONSE_BUILDER().build()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, boardRequestParam))
			.isInstanceOf(NoContentException.class)
			.hasMessageContaining("There is no cards.");
	}

	@Test
	@Deprecated
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

		Throwable thrown = catchThrowable(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam));
		assertThat(thrown).isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Failed to call Jira to get board config, cause is");
	}

	@Test
	void shouldCallJiraFeignClientAndThrowNonColumnWhenGetJiraBoardInfo() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO noneStatusSelf = NONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(noneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		Throwable thrown = catchThrowable(() -> jiraService.getInfo(boardTypeJira, boardRequestParam));
		assertThat(thrown).isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Failed to call Jira to get board info, cause is");
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTimeGivenStoryPointKeyFromEnvironmentVariable()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format("status in ('%s') AND status changed during (%s, %s)", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		Map<String, String> envMap = new HashMap<>();
		envMap.put("STORY_POINT_KEY", "customfield_10016");

		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("\"storyPoints\":0", "\"customfield_10016\":null")
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(systemUtil.getEnvMap()).thenReturn(envMap);

		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		jiraBoardSetting
			.setOverrideFields(List.of(TargetField.builder().key("").name("Story Points").flag(true).build(),
					TargetField.builder().key("").name("Flagged").flag(true).build()));
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		storyPointsAndCycleTimeRequest.setOverrideFields(jiraBoardSetting.getOverrideFields());
		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");

		assertThat(cardCollection.getStoryPointSum()).isEqualTo(11);
		assertThat(cardCollection.getCardsNumber()).isEqualTo(4);
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsRealDoneAndCycleTimeGivenStoryPointKeyFromEnvironmentVariable()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format("status in ('%s','%s') AND status changed during (%s, %s)", "Testing", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		Map<String, String> envMap = new HashMap<>();
		envMap.put("STORY_POINT_KEY", "customfield_10016");

		String allDoneCards = objectMapper
			.writeValueAsString(ALL_REAL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("\"storyPoints\":0", "\"customfield_10016\":null")
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_REAL_DONE_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(CARD_HISTORY_REAL_DONE_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(systemUtil.getEnvMap()).thenReturn(envMap);

		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_REAL_DONE_CARD().build();
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_REAL_DONE_SETTING_BUILD().build();
		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");

		assertThat(cardCollection.getStoryPointSum()).isEqualTo(5);
		assertThat(cardCollection.getCardsNumber()).isEqualTo(1);
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTimeGivenNotEmptyStoryPointKeyAndFlaggedFromOverrideFields()
			throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format("status in ('%s') AND status changed during (%s, %s)", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("\"storyPoints\":0", "\"customfield_10016\":null")
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token))
			.thenReturn(ALL_FIELD_RESPONSE_BUILDER_HAS_STORY_POINT().build());
		when(systemUtil.getEnvMap()).thenReturn(Map.of());

		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		jiraBoardSetting.setOverrideFields(
				List.of(TargetField.builder().key("customfield_10016").name("Story Points").flag(true).build(),
						TargetField.builder().key("customfield_10017").name("Flagged").flag(true).build()));
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		storyPointsAndCycleTimeRequest.setOverrideFields(jiraBoardSetting.getOverrideFields());
		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");

		assertThat(cardCollection.getStoryPointSum()).isEqualTo(11);
		assertThat(cardCollection.getCardsNumber()).isEqualTo(4);
	}

	@Test
	@Deprecated
	void shouldThrowExceptionWhenGetJiraConfigurationThrowsUnExpectedException() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		when(jiraFeignClient.getJiraBoardConfiguration(any(URI.class), any(), any()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", "token"))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());
		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("UnExpected Exception");
	}

	@Test
	void shouldThrowExceptionWhenGetJiraInfoThrowsUnExpectedException() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(jiraFeignClient.getJiraBoardConfiguration(any(URI.class), any(), any()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", "token"))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, boardRequestParam))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("UnExpected Exception");
	}

	@Test
	@Deprecated
	void shouldReturnAssigneeNameFromDoneCardWhenGetAssigneeSet() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(new CardHistoryResponseDTO(true, Collections.emptyList()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeJira, boardRequestParam);

		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getUsers().get(0)).isEqualTo("Zhang San");
	}

	@Test
	void shouldReturnAssigneeNameFromDoneCardWhenGetBoardInfoAndGetAssigneeSet() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(new CardHistoryResponseDTO(true, Collections.emptyList()));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getInfo(boardTypeJira, boardRequestParam);
		assertThat(boardConfigDTO.getUsers()).hasSize(1);
		assertThat(boardConfigDTO.getUsers().get(0)).isEqualTo("Zhang San");
	}

	@Test
	@Deprecated
	void shouldThrowExceptionWhenGetTargetFieldFailed() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenThrow(new CustomFeignClientException(500, "exception"));

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(Exception.class)
			.hasMessageContaining("exception");
	}

	@Test
	void shouldThrowExceptionWhenGetBoardInfoAndGetTargetFieldFailed() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenThrow(new CustomFeignClientException(500, "exception"));

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(Exception.class)
			.hasMessageContaining("exception");
	}

	@Test
	@Deprecated
	void shouldThrowExceptionWhenGetTargetFieldReturnNull() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token)).thenReturn(null);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(PermissionDenyException.class)
			.hasMessageContaining("There is no enough permission.");
	}

	@Test
	void shouldThrowExceptionWhenGetBoardInfoAndGetTargetFieldReturnNull() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token)).thenReturn(null);

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(PermissionDenyException.class)
			.hasMessageContaining("There is no enough permission.");
	}

	@Test
	@Deprecated
	void shouldThrowExceptionWhenGetTargetFieldReturnEmpty() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		FieldResponseDTO emptyProjectFieldResponse = FieldResponseDTO.builder()
			.projects(Collections.emptyList())
			.build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenReturn(emptyProjectFieldResponse);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(PermissionDenyException.class)
			.hasMessageContaining("There is no enough permission.");
	}

	@Test
	void shouldThrowExceptionWhenGetBoardInfoAndGetTargetFieldReturnEmpty() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		FieldResponseDTO emptyProjectFieldResponse = FieldResponseDTO.builder()
			.projects(Collections.emptyList())
			.build();

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(), token))
			.thenReturn(emptyProjectFieldResponse);

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(PermissionDenyException.class)
			.hasMessageContaining("There is no enough permission.");
	}

	@Test
	@Deprecated
	void shouldThrowCustomExceptionWhenGetJiraBoardConfig() {
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(PermissionDenyException.class)
			.hasMessageContaining("There is no enough permission.");
	}

	@Test
	void shouldThrowCustomExceptionWhenGetJiraBoardInfo() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, BOARD_REQUEST_BUILDER().build()))
			.isInstanceOf(PermissionDenyException.class)
			.hasMessageContaining("There is no enough permission.");
	}

	@Test
	@Deprecated
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardConfigFailed() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any()))
			.thenThrow(new CustomFeignClientException(400, "exception"));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", "token"))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());
		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardTypeJira, BoardRequestParam.builder().build()))
			.isInstanceOf(Exception.class)
			.hasMessageContaining("exception");
	}

	@Test
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardInfoFailed() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";

		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("next-gen").build());
		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any()))
			.thenThrow(new CustomFeignClientException(400, "exception"));
		when(jiraFeignClient.getTargetField(baseUrl, "project key", "token"))
			.thenReturn(FIELD_RESPONSE_BUILDER().build());

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, BoardRequestParam.builder().build()))
			.isInstanceOf(Exception.class)
			.hasMessageContaining("exception");
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTime() throws JsonProcessingException {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format("status in ('%s') AND status changed during (%s, %s)", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());

		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("\"storyPoints\":0", "\"customfield_10016\":null")
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");

		assertThat(cardCollection.getStoryPointSum()).isEqualTo(0);
		assertThat(cardCollection.getCardsNumber()).isEqualTo(1);
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTimeWhenBoardTypeIsClassicJira() throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";

		JiraBoardSetting jiraBoardSetting = CLASSIC_JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = CLASSIC_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD()
			.build();
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");

		assertThat(cardCollection.getCardsNumber()).isEqualTo(0);
	}

	@Test
	void shouldGetCardsWhenCallGetStoryPointsAndCycleTimeWhenDoneTimeGreaterThanSelectedEndTime()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";

		JiraBoardSetting jiraBoardSetting = CLASSIC_JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = CLASSIC_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD()
			.build();
		String allDoneCards = objectMapper.writeValueAsString(NEED_FILTERED_ALL_DONE_CARDS_BUILDER().build());
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "1", 0, 100, token))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "2", 0, 100, token))
			.thenReturn(CARD_HISTORY_DONE_TIME_GREATER_THAN_END_TIME_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");

		assertThat(cardCollection.getCardsNumber()).isEqualTo(0);
	}

	@Test
	void shouldReturnBadRequestExceptionWhenBoardTypeIsNotCorrect() {

		JiraBoardSetting jiraBoardSetting = INCORRECT_JIRA_BOARD_SETTING_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = INCORRECT_JIRA_STORY_POINTS_FORM_ALL_DONE_CARD()
			.build();

		List<RequestJiraBoardColumnSetting> boardColumns = jiraBoardSetting.getBoardColumns();
		List<String> users = List.of("Zhang San");
		assertThatThrownBy(() -> jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, boardColumns, users, null))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Board type does not find!");
	}

	@Test
	void shouldReturnBadRequestExceptionWhenBoardStyleIsNotCorrect() {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(jiraFeignClient.getProject(any(), any(), any()))
			.thenReturn(JiraBoardProject.builder().style("unknown").build());

		assertThatThrownBy(() -> jiraService.getInfo(boardTypeJira, boardRequestParam))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Board type does not find!");
	}

	@Test
	public void shouldProcessCustomFieldsForCardsWhenCallGetStoryPointsAndCycleTime() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(
				"{\"total\":1,\"issues\":[{\"expand\":\"expand\",\"id\":\"1\",\"self\":\"https:xxxx/issue/1\",\"key\":\"ADM-455\",\"fields\":{\"customfield_10020\":[{\"id\":16,\"name\":\"Tool Sprint 11\",\"state\":\"closed\",\"boardId\":2,\"goal\":\"goals\",\"startDate\":\"2023-05-15T03:09:23.000Z\",\"endDate\":\"2023-05-28T16:00:00.000Z\",\"completeDate\":\"2023-05-29T03:51:24.898Z\"}],\"customfield_10021\":[{\"self\":\"https:xxxx/10019\",\"value\":\"Impediment\",\"id\":\"10019\"}],\"customfield_10016\":1,\"assignee\":{\"displayName\":\"Zhang San\"}}}]}");
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(FIELD_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(boardUtil.getCycleTimeInfos(any(), any(), any())).thenReturn(CYCLE_TIME_INFO_LIST());
		when(boardUtil.getOriginCycleTimeInfos(any())).thenReturn(CYCLE_TIME_INFO_LIST());

		CardCollection doneCards = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), "");
		assertThat(doneCards.getStoryPointSum()).isEqualTo(1);
		assertThat(doneCards.getCardsNumber()).isEqualTo(1);
	}

	@Test
	public void shouldReturnNullWhenCallGetStoryPointsAndCycleTimeAndHistoryISNull() {
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(
				"{\"total\":1,\"issues\":[{\"expand\":\"expand\",\"id\":\"1\",\"self\":\"https:xxxx/issue/1\",\"key\":\"ADM-455\",\"fields\":{\"customfield_10020\":[{\"id\":16,\"name\":\"Tool Sprint 11\",\"state\":\"closed\",\"boardId\":2,\"goal\":\"goals\",\"startDate\":\"2023-05-15T03:09:23.000Z\",\"endDate\":\"2023-05-28T16:00:00.000Z\",\"completeDate\":\"2023-05-29T03:51:24.898Z\"}],\"customfield_10021\":[{\"self\":\"https:xxxx/10019\",\"value\":\"Impediment\",\"id\":\"10019\"}],\"customfield_10016\":1,\"assignee\":{\"displayName\":\"Zhang San\"}}}]}");
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(FIELD_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER_TO_DONE().build());

		CardCollection doneCards = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"), null);
		assertThat(doneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(doneCards.getCardsNumber()).isEqualTo(0);
	}

	@Test
	void shouldReturnIllegalArgumentExceptionWhenHaveUnknownColumn() throws JsonProcessingException {
		String token = "token";
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_HAVE_UNKNOWN_COLUMN_BUILD().build();
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().startTime("5")
			.build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().startTime("5").build();
		String jql = String.format("status in ('%s') AND status changed during (%s, %s)", "DONE",
				boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(FIELD_RESPONSE_BUILDER().build());

		List<RequestJiraBoardColumnSetting> boardColumns = jiraBoardSetting.getBoardColumns();
		List<String> users = List.of("Zhang San");
		assertThatThrownBy(() -> jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(
				storyPointsAndCycleTimeRequest, boardColumns, users, null))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Type does not find!");
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForActiveSprint()
			throws JsonProcessingException {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));
		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForActiveSprintWithStatusIsEmpty()
			throws JsonProcessingException {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS()
			.build();

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForKanban()
			throws JsonProcessingException {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD().build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jqlForKanban = "status not in ('" + String.join("','", storyPointsAndCycleTimeRequest.getStatus())
				+ "') ORDER BY updated DESC";
		String jqlForActiveSprint = "sprint in openSprints() AND status not in ('"
				+ String.join("','", storyPointsAndCycleTimeRequest.getStatus()) + "') ORDER BY updated DESC";
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, NONE_DONE_MAX_QUERY_COUNT, 0, jqlForActiveSprint,
				boardRequestParam.getToken()))
			.thenReturn("");
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, NONE_DONE_MAX_QUERY_COUNT, 0, jqlForKanban,
				boardRequestParam.getToken()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));

		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	public void shouldReturnCardsWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForKanbanWithStatusIsEmpty()
			throws JsonProcessingException {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS()
			.build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jqlForKanban = "ORDER BY updated DESC";
		String jqlForActiveSprint = "sprint in openSprints() ORDER BY updated DESC";
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, NONE_DONE_MAX_QUERY_COUNT, 0, jqlForActiveSprint,
				boardRequestParam.getToken()))
			.thenReturn("");
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, NONE_DONE_MAX_QUERY_COUNT, 0, jqlForKanban,
				boardRequestParam.getToken()))
			.thenReturn(objectMapper.writeValueAsString(ALL_NON_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build()));

		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(3);
	}

	@Test
	void shouldReturnCardsWithSprintWhenCallGetStoryPointsAndCycleTimeForNonDoneCardsForKanbanWithStatusIsEmpty() {
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_BUILD().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		StoryPointsAndCycleTimeRequest storyPointsAndCycleTimeRequest = STORY_POINTS_FORM_ALL_DONE_CARD_WITH_EMPTY_STATUS()
			.build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jqlForActiveSprint = "sprint in openSprints() ORDER BY updated DESC";
		String allDoneCards = JiraBoardConfigDTOFixture.JIRA_CARD_WITH_TWO_SPRINT;
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, NONE_DONE_MAX_QUERY_COUNT, 0, jqlForActiveSprint,
				boardRequestParam.getToken()))
			.thenReturn(allDoneCards);
		when(jiraFeignClient.getTargetField(any(), any(), any())).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_MULTI_RESPONSE_BUILDER().build());

		CardCollection nonDoneCards = jiraService.getStoryPointsAndCycleTimeForNonDoneCards(
				storyPointsAndCycleTimeRequest, jiraBoardSetting.getBoardColumns(), List.of("Zhang San"));

		assertThat(nonDoneCards.getStoryPointSum()).isEqualTo(0);
		assertThat(nonDoneCards.getCardsNumber()).isEqualTo(1);
		assertThat(nonDoneCards.getJiraCardDTOList().get(0).getBaseInfo().getFields().getSprint().getName())
			.isEqualTo("TS Sprint 1");
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

	@Test
	void shouldGetRealDoneCardGivenCallGetStoryPointsAndCycleTimeWhenUseHistoricalAssigneeFilter()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = AssigneeFilterMethod.HISTORICAL_ASSIGNEE.getDescription();

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_ASSIGNEE_FILTER_METHOD().build();

		// return value
		String allDoneCards = objectMapper
			.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_ASSIGNEE_FILTER_TEST().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD2_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-520", 0, 100, token))
			.thenReturn(CARD3_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection1 = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of("Da Pei"), assigneeFilter);
		CardCollection cardCollection2 = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of("song"), assigneeFilter);

		assertThat(cardCollection1.getCardsNumber()).isEqualTo(0);
		assertThat(cardCollection2.getCardsNumber()).isEqualTo(1);
		assertThat(cardCollection2.getJiraCardDTOList().get(0).getBaseInfo().getKey()).isEqualTo("ADM-475");

	}

	@Test
	void shouldGetRealDoneCardGivenCallGetStoryPointsAndCycleTimeWhenUseLastAssigneeFilter()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = AssigneeFilterMethod.LAST_ASSIGNEE.getDescription();
		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_ASSIGNEE_FILTER_METHOD().build();

		// return value
		String allDoneCards = objectMapper
			.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_ASSIGNEE_FILTER_TEST().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");
		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD2_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-520", 0, 100, token))
			.thenReturn(CARD3_HISTORY_FOR_HISTORICAL_ASSIGNEE_FILTER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection1 = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of("yun"), assigneeFilter);
		CardCollection cardCollection2 = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of("Da Pei"), assigneeFilter);

		assertThat(cardCollection1.getCardsNumber()).isEqualTo(1);
		assertThat(cardCollection1.getJiraCardDTOList().get(0).getBaseInfo().getKey()).isEqualTo("ADM-520");
		assertThat(cardCollection2.getCardsNumber()).isEqualTo(1);
		assertThat(cardCollection2.getJiraCardDTOList().get(0).getBaseInfo().getKey()).isEqualTo("ADM-475");
	}

	@Test
	@Deprecated
	void shouldFilterOutUnreasonableTargetField() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO completeStatusSelf = COMPLETE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(new TargetField("customfield_10021", "Flagged", false),
				new TargetField("priority", "Priority", false),
				new TargetField("timetracking", "Time tracking", false));
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_3, token)).thenReturn(completeStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(INCLUDE_UNREASONABLE_FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getJiraConfiguration(boardTypeClassicJira, boardRequestParam);

		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(
				boardConfigDTO.getTargetFields().contains(new TargetField("customfield_10000", "Development", false)))
			.isFalse();
		assertThat(boardConfigDTO.getTargetFields().contains(new TargetField("customfield_10019", "Rank", false)))
			.isFalse();
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldFilterOutUnreasonableTargetFieldWhenGetBoardInfo() throws JsonProcessingException {
		JiraBoardConfigDTO jiraBoardConfigDTO = CLASSIC_JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelfDTO doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO completeStatusSelf = COMPLETE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelfDTO doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(ALL_CARDS_JQL, boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		List<TargetField> expectTargetField = List.of(new TargetField("customfield_10021", "Flagged", false),
				new TargetField("priority", "Priority", false),
				new TargetField("timetracking", "Time tracking", false));
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_STORY_POINT_BUILDER().build())
			.replaceAll("storyPoints", "customfield_10016");

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(urlGenerator.getUri(any())).thenReturn(URI.create(SITE_ATLASSIAN_NET));
		when(jiraFeignClient.getProject(baseUrl, "project key", token))
			.thenReturn(JiraBoardProject.builder().style("classic").build());
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_3, token)).thenReturn(completeStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getJiraCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token)).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(any(), any(), anyInt(), anyInt(), any()))
			.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getTargetField(baseUrl, "project key", token))
			.thenReturn(INCLUDE_UNREASONABLE_FIELD_RESPONSE_BUILDER().build());

		BoardConfigDTO boardConfigDTO = jiraService.getInfo(boardTypeJira, boardRequestParam);
		assertThat(boardConfigDTO.getTargetFields()).hasSize(3);
		assertThat(
				boardConfigDTO.getTargetFields().contains(new TargetField("customfield_10000", "Development", false)))
			.isFalse();
		assertThat(boardConfigDTO.getTargetFields().contains(new TargetField("customfield_10019", "Rank", false)))
			.isFalse();
		assertThat(boardConfigDTO.getTargetFields()).isEqualTo(expectTargetField);
	}

	@Test
	void shouldGetRealDoneCardsGivenMultipleStatuesMappingToDoneStatusWhenCallGetStoryPointsAndCycleTime()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = "lastAssignee";

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES().build();

		// return value
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD2_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of("Da Pei"), assigneeFilter);

		assertThat(cardCollection.getCardsNumber()).isEqualTo(1);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getBaseInfo().getKey()).isEqualTo("ADM-475");
	}

	@Test
	void shouldGetRealDoneCardsGivenHistoryWithNoStatusFieldWhenCallGetStoryPointsAndCycleTime()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = "lastAssignee";

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES().build();

		// return value
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD2_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD_HISTORY_WITH_NO_STATUS_FIELD().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of("Da Pei"), assigneeFilter);

		assertThat(cardCollection.getCardsNumber()).isZero();
	}

	@Test
	void shouldGetRealDoneCardsReworkToInDevTimesGivenNotConsiderFlagIsBlockAndNoExclude()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = "lastAssignee";

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES()
			.treatFlagCardAsBlock(false)
			.reworkTimesSetting(ReworkTimesSetting.builder().reworkState("In Dev").excludedStates(List.of()).build())
			.build();

		// return value
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD3_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(),
				List.of(JiraBoardConfigDTOFixture.DISPLAY_NAME_ONE, JiraBoardConfigDTOFixture.DISPLAY_NAME_TWO),
				assigneeFilter);

		assertThat(cardCollection.getReworkCardNumber()).isEqualTo(1);
		assertThat(cardCollection.getReworkRatio()).isEqualTo(0.5);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getTotalReworkTimes()).isEqualTo(3);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getState())
			.isEqualTo(CardStepsEnum.BLOCK);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getTimes()).isEqualTo(1);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(1).getState())
			.isEqualTo(CardStepsEnum.REVIEW);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(1).getTimes()).isEqualTo(1);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(3).getState())
			.isEqualTo(CardStepsEnum.TESTING);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(3).getTimes()).isEqualTo(1);
	}

	@Test
	void shouldGetRealDoneCardsReworkTimesToInDevGivenConsiderFlagAsBlock() throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = "lastAssignee";

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES()
			.treatFlagCardAsBlock(true)
			.reworkTimesSetting(ReworkTimesSetting.builder().reworkState("In Dev").excludedStates(List.of()).build())
			.build();

		// return value
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_MULTIPLE_STATUSES_WITH_FLAG().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD2_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of(JiraBoardConfigDTOFixture.DISPLAY_NAME_ONE),
				assigneeFilter);

		assertThat(cardCollection.getReworkCardNumber()).isEqualTo(1);
		assertThat(cardCollection.getReworkRatio()).isEqualTo(1);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getTotalReworkTimes()).isEqualTo(2);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getState())
			.isEqualTo(CardStepsEnum.BLOCK);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getTimes()).isEqualTo(2);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getState())
			.isEqualTo(CardStepsEnum.BLOCK);
	}

	@Test
	void shouldGetRealDoneCardsReworkToInDevTimesGivenNotConsiderFlagIsBlockAndExcludeState()
			throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = "lastAssignee";

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES()
			.treatFlagCardAsBlock(false)
			.reworkTimesSetting(
					ReworkTimesSetting.builder().reworkState("In Dev").excludedStates(List.of("Block")).build())
			.build();

		// return value
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD3_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(),
				List.of(JiraBoardConfigDTOFixture.DISPLAY_NAME_ONE, JiraBoardConfigDTOFixture.DISPLAY_NAME_TWO),
				assigneeFilter);

		assertThat(cardCollection.getReworkCardNumber()).isEqualTo(1);
		assertThat(cardCollection.getReworkRatio()).isEqualTo(0.5);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getTotalReworkTimes()).isEqualTo(2);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getState())
			.isEqualTo(CardStepsEnum.REVIEW);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(0).getTimes()).isEqualTo(1);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(1).getState())
			.isEqualTo(CardStepsEnum.WAITING);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(1).getTimes()).isZero();
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(2).getState())
			.isEqualTo(CardStepsEnum.TESTING);
		assertThat(cardCollection.getJiraCardDTOList().get(0).getReworkTimesInfos().get(2).getTimes()).isEqualTo(1);
	}

	@Test
	void shouldGetRealDoneCardsReworkTimesToTestingGivenConsiderFlagAsBlock() throws JsonProcessingException {

		URI baseUrl = URI.create(SITE_ATLASSIAN_NET);
		String token = "token";
		String assigneeFilter = "lastAssignee";

		// request param
		JiraBoardSetting jiraBoardSetting = JIRA_BOARD_SETTING_WITH_HISTORICAL_ASSIGNEE_FILTER_METHOD().build();
		StoryPointsAndCycleTimeRequest request = STORY_POINTS_REQUEST_WITH_MULTIPLE_REAL_DONE_STATUSES()
			.treatFlagCardAsBlock(true)
			.reworkTimesSetting(ReworkTimesSetting.builder().reworkState("Testing").excludedStates(List.of()).build())
			.build();

		// return value
		String allDoneCards = objectMapper.writeValueAsString(ALL_DONE_CARDS_RESPONSE_FOR_MULTIPLE_STATUS().build())
			.replaceAll("sprint", "customfield_10020")
			.replaceAll("partner", "customfield_10037")
			.replaceAll("flagged", "customfield_10021")
			.replaceAll("development", "customfield_10000");

		when(urlGenerator.getUri(any())).thenReturn(baseUrl);
		when(jiraFeignClient.getJiraCards(any(), any(), anyInt(), anyInt(), any(), any())).thenReturn(allDoneCards);
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-475", 0, 100, token))
			.thenReturn(CARD1_HISTORY_FOR_MULTIPLE_STATUSES_WITH_FLAG().build());
		when(jiraFeignClient.getJiraCardHistoryByCount(baseUrl, "ADM-524", 0, 100, token))
			.thenReturn(CARD2_HISTORY_FOR_MULTIPLE_STATUSES().build());
		when(jiraFeignClient.getTargetField(baseUrl, "PLL", token)).thenReturn(ALL_FIELD_RESPONSE_BUILDER().build());

		CardCollection cardCollection = jiraService.getStoryPointsAndCycleTimeAndReworkInfoForDoneCards(request,
				jiraBoardSetting.getBoardColumns(), List.of(JiraBoardConfigDTOFixture.DISPLAY_NAME_ONE),
				assigneeFilter);

		assertThat(cardCollection.getReworkCardNumber()).isZero();
		assertThat(cardCollection.getReworkRatio()).isZero();
	}

}
