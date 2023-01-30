package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JiraController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class JiraControllerTest {

	@MockBean
	private JiraService jiraService;

	@Autowired
	JiraController jiraController;

	@Autowired
	private JacksonTester<BoardRequest> boardRequestJson;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnCorrectBoardConfigResponseWhenGivenTheCorrectBoardRequest() throws Exception {
		String boardId = "123";
		String boardName = "jira";
		BoardConfigResponse boardConfigResponse = BoardConfigResponse.builder().id(boardId).name(boardName).build();
		when(jiraService.getJiraReconfiguration(any())).thenReturn(boardConfigResponse);

		BoardRequest boardRequest = BoardRequest.builder().boardName(boardName).boardId(boardId).email("test@email.com")
				.projectKey("project key").site("site").token("token").build();
		mockMvc.perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(boardRequestJson.write(boardRequest).getJson())).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(boardId)).andExpect(jsonPath("$.name").value(boardName));
	}

	@Test
	void shouldHandleServiceExceptionAndReturnWithStatusAndMessage() throws Exception {
		int statusCode = 400;
		when(jiraService.getJiraReconfiguration(any())).thenThrow(new RequestFailedException(statusCode));

		BoardRequest boardRequest = BoardRequest.builder().token("token").build();
		mockMvc.perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(boardRequestJson.write(boardRequest).getJson())).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Request failed with status code " + statusCode));
	}

	@Test
	void shouldVerifyRequestTokenNotBlank() throws Exception {
		BoardRequest boardRequest = BoardRequest.builder().build();
		mockMvc.perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(boardRequestJson.write(boardRequest).getJson())).andExpect(status().isBadRequest());
	}

}
