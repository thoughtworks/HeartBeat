package heartbeat.controller.board;

import static heartbeat.controller.board.BoardConfigResponseFixture.BOARD_CONFIG_RESPONSE_BUILDER;
import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

@WebMvcTest(JiraController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class JiraControllerTest {

    @MockBean
    private JiraService jiraService;

    @Autowired
    private JacksonTester<BoardRequest> boardRequestJson;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnCorrectBoardConfigResponseWhenGivenTheCorrectBoardRequest() throws Exception {
        BoardConfigResponse boardConfigResponse = BOARD_CONFIG_RESPONSE_BUILDER().build();
        BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();

        when(jiraService.getJiraConfiguration(any())).thenReturn(boardConfigResponse);

        mockMvc
                .perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
                        .content(boardRequestJson.write(boardRequest).getJson()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jiraColumns[0].value.name").value("TODO"))
                .andExpect(jsonPath("$.users[0]").value("Zhang San"))
                .andExpect(jsonPath("$.targetFields[0].name").value("Priority"));
    }

    @Test
    void shouldHandleServiceExceptionAndReturnWithStatusAndMessage() throws Exception {
        RequestFailedException mockException = mock(RequestFailedException.class);
        String message = "message";
        when(jiraService.getJiraConfiguration(any())).thenThrow(mockException);
        when(mockException.getMessage()).thenReturn(message);
        when(mockException.getStatus()).thenReturn(400);

        BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
        mockMvc
                .perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
                        .content(boardRequestJson.write(boardRequest).getJson()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(message));
    }

    @Test
    void shouldVerifyRequestTokenNotBlank() throws Exception {
        BoardRequest boardRequest = BOARD_REQUEST_BUILDER().token("").build();
        mockMvc
                .perform(get("/boards/{boardType}", "jira").contentType(MediaType.APPLICATION_JSON)
                        .content(boardRequestJson.write(boardRequest).getJson()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.token").value("Token cannot be empty."));
    }

    @Test
    void shouldThrowExceptionWhenBoardTypeNotSupported() throws Exception {
        BoardRequest boardRequest = BOARD_REQUEST_BUILDER().token("").build();
        mockMvc
                .perform(get("/boards/{boardType}", "invalid").contentType(MediaType.APPLICATION_JSON)
                        .content(boardRequestJson.write(boardRequest).getJson()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

}
