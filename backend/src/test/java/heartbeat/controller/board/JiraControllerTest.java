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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JiraController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class JiraControllerTest {

	@MockBean
	private JiraService jiraService;

	@Autowired
	private JacksonTester<BoardRequest> boardRequestJson;
	@Autowired
	private JacksonTester<BoardConfigResponse> boardConfigResponseJson;
	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnCorrectBoardConfigResponseWhenGivenTheCorrectBoardRequest() throws Exception {
		String boardId = "123";
		String boardName = "jira";
		BoardConfigResponse boardConfigResponse = BoardConfigResponse.builder().id(boardId).name(boardName).build();
		BoardRequest boardRequest = BoardRequest.builder().boardName(boardName).boardId(boardId).email("test@email.com")
			.projectKey("project key").site("site").token("token").build();

		when(jiraService.getJiraReconfiguration(any())).thenReturn(boardConfigResponse);

		MockHttpServletRequestBuilder requestBuilder = get("/boards/{boardType}", "jira")
			.contentType(MediaType.APPLICATION_JSON)
			.content(boardRequestJson.write(boardRequest).getJson());
		MockHttpServletResponse response = mockMvc.perform(requestBuilder)
			.andExpect(status().isOk())
			.andExpect(content().contentType(MediaType.APPLICATION_JSON))
			.andReturn()
			.getResponse();

		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(response.getContentAsString()).isEqualTo(boardConfigResponseJson.write(boardConfigResponse).getJson());
	}

	@Test
	void shouldHandleServiceExceptionAndReturnWithStatusAndMessage() throws Exception {
		RequestFailedException mockException = mock(RequestFailedException.class);
		String message = "message";
		BoardRequest boardRequest = BoardRequest.builder().token("token").build();

		when(mockException.getMessage()).thenReturn(message);
		when(mockException.getStatus()).thenReturn(HttpStatus.BAD_REQUEST.value());
		when(jiraService.getJiraReconfiguration(boardRequest)).thenThrow(mockException);

		MockHttpServletResponse response = mockMvc.perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(boardRequestJson.write(boardRequest).getJson()))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value(message))
			.andReturn().getResponse();

		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
	}

	@Test
	void shouldVerifyRequestTokenNotBlank() throws Exception {
		BoardRequest boardRequest = BoardRequest.builder().build();
		RequestFailedException mockException = mock(RequestFailedException.class);

		when(jiraService.getJiraReconfiguration(boardRequest)).thenThrow(mockException);
		when(mockException.getStatus()).thenReturn(HttpStatus.BAD_REQUEST.value());

		MockHttpServletResponse response = mockMvc.perform(get("/boards/{boardType}", "jira")
				.contentType(MediaType.APPLICATION_JSON)
				.content(boardRequestJson.write(boardRequest).getJson()))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
	}
}
