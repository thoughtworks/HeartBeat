package heartbeat.service.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.URI;

import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
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
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";

		BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardRequest);

		assertThat(boardConfigResponse.getJiraColumns()).hasSize(1);
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getName()).isEqualTo("TODO");
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
