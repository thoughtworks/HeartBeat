package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;

import java.net.URI;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@AutoConfigureJsonTesters
public class JiraControllerTest {

	@Mock
	private JiraService jiraService;

	@InjectMocks
	JiraController jiraController;

	@Test
	@DisplayName("Should Return Correct Board Config Response When Given The Correct Board Request")
	void shouldReturnCorrectBoardConfigResponseWhenGivenTheCorrectBoardRequest() {
		String boardId = "123";
		BoardConfigResponse boardConfigResponse = BoardConfigResponse.builder().id(boardId).name("jira").build();

		BoardRequest boardRequest = BoardRequest.builder().boardName("jira").boardId(boardId).email("test@email.com")
				.projectKey("project key").site("site").token("token").build();

		when(jiraService.getJiraReconfiguration(boardRequest)).thenReturn(boardConfigResponse);
		BoardConfigResponse result = jiraController.getJiraBoardConfig(boardRequest);

		assertThat(result).isEqualTo(boardConfigResponse);
		verify(jiraService).getJiraReconfiguration(boardRequest);
	}

}
