package heartbeat.controller.board;

import static heartbeat.controller.board.BoardConfigResponseFixture.BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.controller.board.dto.request.BoardVerifyRequestFixture.BOARD_VERIFY_REQUEST_BUILDER;
import static heartbeat.controller.board.dto.request.BoardVerifyRequestFixture.PROJECT_KEY;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.board.dto.request.BoardRequestParam;
import heartbeat.controller.board.dto.request.BoardType;
import heartbeat.controller.board.dto.request.BoardVerifyRequestParam;
import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BoardController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class JiraControllerTest {

	@MockBean
	private JiraService jiraService;

	@Autowired
	private MockMvc mockMvc;

	private final static BoardType BOARD_TYPE = BoardType.JIRA;

	@Test
	@Deprecated
	void shouldReturnCorrectBoardConfigResponseWhenGivenTheCorrectBoardRequest() throws Exception {
		BoardConfigDTO boardConfigDTO = BOARD_CONFIG_RESPONSE_BUILDER().build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(jiraService.getJiraConfiguration(any(), any())).thenReturn(boardConfigDTO);

		mockMvc
			.perform(post("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.jiraColumns[0].value.name").value("TODO"))
			.andExpect(jsonPath("$.users[0]").value("Zhang San"))
			.andExpect(jsonPath("$.targetFields[0].name").value("Priority"));
	}

	@Test
	void shouldReturnCorrectBoardInfoResponseWhenGivenTheCorrectBoardRequest() throws Exception {
		BoardConfigDTO boardConfigDTO = BOARD_CONFIG_RESPONSE_BUILDER().build();
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(jiraService.getInfo(any(), any())).thenReturn(boardConfigDTO);

		mockMvc
			.perform(post("/boards/{boardType}/info", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.jiraColumns[0].value.name").value("TODO"))
			.andExpect(jsonPath("$.users[0]").value("Zhang San"))
			.andExpect(jsonPath("$.targetFields[0].name").value("Priority"));
	}

	@Test
	void shouldReturnCorrectBoardVerificationResponseWhenGivenTheCorrectBoardRequest() throws Exception {
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		when(jiraService.verify(any(), any())).thenReturn(PROJECT_KEY);

		mockMvc
			.perform(post("/boards/{boardType}/verify", BOARD_TYPE).contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardVerifyRequestParam)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.projectKey").value(PROJECT_KEY));
	}

	@Test
	@Deprecated
	void shouldHandleServiceExceptionAndReturnWithStatusAndMessage() throws Exception {
		RequestFailedException mockException = mock(RequestFailedException.class);
		String message = "message";
		when(jiraService.getJiraConfiguration(any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn(message);
		when(mockException.getStatus()).thenReturn(400);

		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		mockMvc
			.perform(post("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value(message));
	}

	@Test
	void shouldHandleServiceExceptionAndReturnWithStatusAndMessageWhenGetBoardInfo() throws Exception {
		RequestFailedException mockException = mock(RequestFailedException.class);
		String message = "message";
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().build();

		when(jiraService.getInfo(any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn(message);
		when(mockException.getStatus()).thenReturn(400);

		mockMvc
			.perform(post("/boards/{boardType}/info", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value(message));
	}

	@Test
	void shouldHandleVerifyServiceExceptionAndReturnWithStatusAndMessage() throws Exception {
		RequestFailedException mockException = mock(RequestFailedException.class);
		String message = "message";
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().build();

		when(jiraService.verify(any(), any())).thenThrow(mockException);
		when(mockException.getMessage()).thenReturn(message);
		when(mockException.getStatus()).thenReturn(400);

		mockMvc
			.perform(post("/boards/{boardType}/verify", BOARD_TYPE).contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardVerifyRequestParam)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value(message));
	}

	@Test
	void shouldVerifyRequestTokenNotBlank() throws Exception {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().token(null).build();

		mockMvc
			.perform(post("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest());
	}

	@Test
	void shouldRequestTokenNotBlankWhenGetBoardInfo() throws Exception {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().token(null).build();

		mockMvc
			.perform(post("/boards/{boardType}/info", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest());
	}

	@Test
	void shouldRequestTimeIncorrectWhenGetBoardInfo() throws Exception {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().startTime("1672556350000")
			.endTime("1672556350000")
			.build();

		mockMvc
			.perform(post("/boards/{boardType}/info", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest());
	}

	@Test
	void shouldBoardVerifyRequestTokenNotBlank() throws Exception {
		BoardVerifyRequestParam boardVerifyRequestParam = BOARD_VERIFY_REQUEST_BUILDER().token(null).build();

		mockMvc
			.perform(post("/boards/{boardType}/verify", "jira").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardVerifyRequestParam)))
			.andExpect(status().isBadRequest());
	}

	@Test
	void shouldThrowExceptionWhenBoardTypeNotSupported() throws Exception {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().token("").build();

		mockMvc
			.perform(post("/boards/{boardType}", "invalid").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest());
	}

	@Test
	void shouldThrowExceptionWhenGetBoardInfoAndBoardTypeNotSupported() throws Exception {
		BoardRequestParam boardRequestParam = BOARD_REQUEST_BUILDER().token("").build();

		mockMvc
			.perform(post("/boards/{boardType}/info", "invalid").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(boardRequestParam)))
			.andExpect(status().isBadRequest());
	}

}
