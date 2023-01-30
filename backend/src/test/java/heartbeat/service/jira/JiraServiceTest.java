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
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {

	@Mock
	JiraFeignClient jiraFeignClient;

	@InjectMocks
	JiraService jiraService;

	@Test
	@DisplayName("Should Call Jira Feign Client And Return Board Config Response When Get Jira Board Config")
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() {
		String boardId = "123";
		JiraBoardConfigDTO jiraBoardConfigDTO = JiraBoardConfigDTO.builder().id(boardId).name("jira board").build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";
		BoardRequest boardRequest = BoardRequest.builder().boardName("board name").boardId(boardId)
			.email("test@email.com").projectKey("project key").site("site").token(token).build();
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardId, token)).thenReturn(jiraBoardConfigDTO);

		BoardConfigResponse boardConfigResponse = jiraService.getJiraReconfiguration(boardRequest);

		verify(jiraFeignClient).getJiraBoardConfiguration(baseUrl, boardId, token);
		assertThat(boardConfigResponse.getId()).isEqualTo(jiraBoardConfigDTO.getId());
		assertThat(boardConfigResponse.getName()).isEqualTo(jiraBoardConfigDTO.getName());
	}

	@Test
	@DisplayName("Should Throw Custom Exception When Call Jira Feign Client To Get Board Config Failed")
	void shouldThrowCustomExceptionWhenCallJiraFeignClientToGetBoardConfigFailed() {
		BoardRequest boardRequest = BoardRequest.builder().build();
		when(jiraFeignClient.getJiraBoardConfiguration(any(), any(), any()))
			.thenThrow(FeignException.FeignClientException.class);

		assertThatThrownBy(() -> jiraService.getJiraReconfiguration(boardRequest))
			.isInstanceOf(RequestFailedException.class);
	}

}
