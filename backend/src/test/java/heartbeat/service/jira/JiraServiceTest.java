package heartbeat.service.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {

	@Spy
	private static JiraFeignClient jiraFeignClient;

	@InjectMocks
	private static JiraService jiraService;

	@Test
	@DisplayName("Should Call Jira Feign Client And Return Board Config Response When Get Jira Board Config")
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() {
		String boardId = "123";
		JiraBoardConfigDTO jiraBoardConfigDTO = JiraBoardConfigDTO.builder().id(boardId).name("jira board").build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";
		BoardRequest boardRequest = BoardRequest.builder().boardName("board name").boardId(boardId)
				.email("test@email.com").projectKey("project key").site("site").token(token).build();

		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, boardId, token);

		BoardConfigResponse boardConfigResponse = jiraService.getJiraReconfiguration(boardRequest);

		assertThat(boardConfigResponse.getId()).isEqualTo(jiraBoardConfigDTO.getId());
		assertThat(boardConfigResponse.getName()).isEqualTo(jiraBoardConfigDTO.getName());
	}

	@Test
	@DisplayName("Should Throw Custom Exception When Call Jira Feign Client To Get Board Config Failed")
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardConfigFailed() {
		doThrow(FeignException.FeignClientException.class).when(jiraFeignClient).getJiraBoardConfiguration(any(), any(),
				any());

		assertThatThrownBy(() -> jiraService.getJiraReconfiguration(BoardRequest.builder().build()))
				.isInstanceOf(RequestFailedException.class)
				.hasMessageContaining("Request failed with status code 400, error: ", "");
	}

}
