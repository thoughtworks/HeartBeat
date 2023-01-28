package heartbeat.service.jira;

import heartbeat.client.JiraFeignClient;
import heartbeat.client.dto.JiraBoardConfigurationDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.URI;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JiraServiceTest {
	@Mock
	JiraFeignClient jiraFeignClient;
	@InjectMocks
	JiraService jiraService;

	@Test
	@DisplayName("Should Call Jira Feign Client When Verify Jira")
	void shouldCallJiraFeignClientWhenVerifyJira() {
		String boardId = "123";
		JiraBoardConfigurationDTO jiraBoardConfigurationDTO = JiraBoardConfigurationDTO.builder()
			.id(boardId)
			.name("jira board")
			.build();
		URI baseUrl = URI.create("https://test.com");
		when(jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardId)).thenReturn(jiraBoardConfigurationDTO);

		jiraService.verify();

		verify(jiraFeignClient).getJiraBoardConfiguration(baseUrl, boardId);
	}
}
