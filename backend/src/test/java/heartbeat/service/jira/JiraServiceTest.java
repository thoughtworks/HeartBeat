package heartbeat.service.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.CardHistoryResponse;
import heartbeat.controller.board.vo.response.StatusSelf;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.net.URI;
import java.util.Collection;
import java.util.Collections;

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

	@Mock
	JiraFeignClient jiraFeignClient;

	@InjectMocks
	JiraService jiraService;

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelf doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelf doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";
		BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequest.getStartTime(), boardRequest.getEndTime());

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
				.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
				.thenReturn(CARD_HISTORY_RESPONSE_BUILDER().build());

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardRequest);

		assertThat(boardConfigResponse.getJiraColumns()).hasSize(1);
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigResponse.getJiraColumns().get(0).getKey()).isEqualTo("done");
		assertThat(boardConfigResponse.getUsers()).hasSize(1);
		assertThat(boardConfigResponse.getUsers().get(0)).isEqualTo("San Zhang");
	}

	@Test
	void shouldReturnAssigneeNameFromDoneCardWhenGetAssigneeSet() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelf doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelf doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";
		BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
		String jql = String.format(
				"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s", "DONE",
				boardRequest.getStartTime(), boardRequest.getEndTime());

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenReturn(doneStatusSelf);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_2, token)).thenReturn(doingStatusSelf);
		when(jiraFeignClient.getAllDoneCards(baseUrl, BOARD_ID, QUERY_COUNT, 0, jql, token))
				.thenReturn(ALL_DONE_CARDS_RESPONSE_BUILDER().build());
		when(jiraFeignClient.getJiraCardHistory(baseUrl, "1", token))
				.thenReturn(new CardHistoryResponse(Collections.emptyList()));

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardRequest);

		assertThat(boardConfigResponse.getUsers()).hasSize(1);
		assertThat(boardConfigResponse.getUsers().get(0)).isEqualTo("Zhang San");
	}

	@Test
	void shouldThrowCustomExceptionWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
		String token = "token";
		FeignException mockException = mock(FeignException.class);

		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		when(jiraFeignClient.getColumnStatusCategory(baseUrl, COLUM_SELF_ID_1, token)).thenThrow(mockException);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardRequest))
				.isInstanceOf(RequestFailedException.class)
				.hasMessageContaining("Request failed with status code 400, error: exception");
	}

	@Test
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardConfigFailed() {
		FeignException mockException = mock(FeignException.class);

		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.status()).thenReturn(400);

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(BoardRequest.builder().build()))
				.isInstanceOf(RequestFailedException.class)
				.hasMessageContaining("Request failed with status code 400, error: ", "");
	}

}
