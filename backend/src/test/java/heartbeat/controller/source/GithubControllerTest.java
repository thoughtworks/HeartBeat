package heartbeat.controller.source;

import heartbeat.controller.source.vo.GithubResponse;
import heartbeat.service.source.github.GithubService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GithubController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class GithubControllerTest {
	@MockBean
	private GithubService githubVerifyService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnOkStatusAndCorrectResponseWithRepos() throws Exception {
		GithubResponse githubReposResponse = GithubResponse.builder().githubRepos(
			List.of("https://github.com/xxxx1/repo1","https://github.com/xxxx2/repo2")).build();

		when(githubVerifyService.verifyToken(any())).thenReturn(githubReposResponse);

		mockMvc
			.perform(get("/sourceControl?githubToken=123456")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.githubRepos[0]").value("https://github.com/xxxx1/repo1"))
			.andExpect(jsonPath("$.githubRepos[1]").value("https://github.com/xxxx2/repo2"));
	}

	@Test
	void shouldReturnBadRequestWhenRequestParamIsBlank() throws Exception {
		mockMvc
			.perform(get("/sourceControl?githubToken=   ")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("getRepos.githubToken: must not be blank"));
	}
}
