package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.net.URI;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;


@WebMvcTest(JiraController.class)
@AutoConfigureJsonTesters
public class JiraControllerTest {
	@Autowired
	private MockMvc mockMvc;
	@MockBean
	private JiraService jiraService;
	@Autowired
	private JacksonTester<BoardConfigResponse> boardConfigResponseJson;
	@Autowired
	private JacksonTester<BoardRequest> boardRequestJson;

	@Test
	@DisplayName("Should Return Correct Board Config Response When Given The Correct Board Request")
	void shouldReturnCorrectBoardConfigResponseWhenGivenTheCorrectBoardRequest() throws Exception {
		String boardId = "123";
		BoardConfigResponse boardConfigResponse = BoardConfigResponse.builder()
			.id(boardId)
			.name("jira")
			.build();

		URI baseUrl = URI.create("https://site.atlassian.net");
		BoardRequest boardRequest = BoardRequest.builder()
			.boardName("jira")
			.boardId(boardId)
			.email("test@email.com")
			.projectKey("project key")
			.site("site")
			.token("token")
			.build();

		when(jiraService.getJiraReconfiguration(boardRequest)).thenReturn(boardConfigResponse);

		MockHttpServletRequestBuilder requestBuilder = post("/board/jira/config")
			.contentType(MediaType.APPLICATION_JSON)
			.content(boardRequestJson.write(boardRequest).getJson());
		MockHttpServletResponse response = (MockHttpServletResponse) mockMvc.perform(requestBuilder)
			.andReturn()
			.getResponse();
		System.out.println(response.getContentAsString());
		assertThat(response.getStatus()).isEqualTo(200);
		assertThat(response.getContentAsString()).isEqualTo(boardConfigResponseJson.write(boardConfigResponse).getJson());
		verify(jiraService).getJiraReconfiguration(boardRequest);
	}

	@Test
	@DisplayName("Should Return Incorrect Board Config Response When Given The Incorrect Board Request")
	void shouldReturnIncorrectBoardConfigResponseWhenGivenTheIncorrectBoardRequest() throws Exception {
		String boardId = "";
		BoardConfigResponse boardConfigResponse = BoardConfigResponse.builder()
			.id("")
			.name("")
			.build();

		URI baseUrl = URI.create("https://site.atlassian.net");
		BoardRequest boardRequest = BoardRequest.builder()
			.boardName("")
			.boardId(boardId)
			.email("")
			.projectKey("")
			.site("")
			.token("")
			.build();

		when(jiraService.getJiraReconfiguration(boardRequest)).thenReturn(boardConfigResponse);

		MockHttpServletResponse response = null;
		try {
			response = mockMvc.perform(post("/board/jira/config"))
				.andReturn()
				.getResponse();
		} catch (Exception e) {
			if (e instanceof RequestFailedException) {
				assertThat(e.getMessage()).isEqualTo("msg:Request failed with status code 400");
			}
		}
		assertThat(response.getStatus()).isEqualTo(400);
	}
}
