package heartbeat.service.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.StatusSelf;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.board.jira.JiraService;
import lombok.val;
import org.junit.Ignore;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import java.net.URI;

import static heartbeat.controller.board.BoardRequestFixture.BOARD_REQUEST_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DOING_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.DONE_STATUS_SELF_RESPONSE_BUILDER;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.JIRA_BOARD_CONFIG_RESPONSE_BUILDER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {

	@Mock
	JiraFeignClient jiraFeignClient;

	@Mock
	WebClient.Builder webClientBuilder;

	@InjectMocks
	JiraService jiraService;

	// mock WebClient
	private final WebClient webClient = mock(WebClient.class);

	private WebClient.RequestHeadersUriSpec requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);

	private WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);

	private final WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);

	@Test
	void shouldCallJiraFeignClientAndReturnBoardConfigResponseWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		StatusSelf doneStatusSelf = DONE_STATUS_SELF_RESPONSE_BUILDER().build();
		StatusSelf doingStatusSelf = DOING_STATUS_SELF_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";

		BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		mockWebClient();
		// mock the response of WebClient
		when(responseSpec.bodyToMono(StatusSelf.class)).thenReturn(Mono.just(doneStatusSelf))
				.thenReturn(Mono.just(doingStatusSelf));

		BoardConfigResponse boardConfigResponse = jiraService.getJiraConfiguration(boardRequest);

		assertThat(boardConfigResponse.getJiraColumns()).hasSize(1);
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getName()).isEqualTo("TODO");
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getStatuses().get(0)).isEqualTo("DONE");
		assertThat(boardConfigResponse.getJiraColumns().get(0).getValue().getStatuses().get(1)).isEqualTo("DOING");
		assertThat(boardConfigResponse.getJiraColumns().get(0).getKey()).isEqualTo("done");
	}

	@Test
	@Disabled("skip this test.")
	void shouldThrowCustomExceptionWhenGetJiraBoardConfig() {
		JiraBoardConfigDTO jiraBoardConfigDTO = JIRA_BOARD_CONFIG_RESPONSE_BUILDER().build();
		URI baseUrl = URI.create("https://site.atlassian.net");
		String token = "token";

		BoardRequest boardRequest = BOARD_REQUEST_BUILDER().build();
		doReturn(jiraBoardConfigDTO).when(jiraFeignClient).getJiraBoardConfiguration(baseUrl, BOARD_ID, token);
		// mockWebClient();

		assertThatThrownBy(() -> jiraService.getJiraConfiguration(boardRequest))
				.isInstanceOf(RequestFailedException.class).hasMessageContaining(
						"Request failed with status statusCode 400, error: Failed when call Jira to get colum body is null");
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

	private void mockWebClient() {
		when(webClientBuilder.build()).thenReturn(webClient);
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.header(any(), any())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
	}

}
