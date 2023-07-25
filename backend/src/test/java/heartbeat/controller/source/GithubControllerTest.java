package heartbeat.controller.source;

import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.service.source.github.GitHubService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.LinkedHashSet;
import java.util.List;

import static heartbeat.TestFixtures.GITHUB_TOKEN;
import static org.assertj.core.api.Assertions.assertThat;
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
	private GitHubService gitHubVerifyService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnOkStatusAndCorrectResponseWithRepos() throws Exception {
		LinkedHashSet<String> repos = new LinkedHashSet<>(
				List.of("https://github.com/xxxx1/repo1", "https://github.com/xxxx2/repo2"));

		GitHubResponse githubReposResponse = GitHubResponse.builder().githubRepos(repos).build();

		when(gitHubVerifyService.verifyToken(any())).thenReturn(githubReposResponse);

		mockMvc.perform(get("/source-control").param("token", GITHUB_TOKEN).contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.githubRepos[0]").value("https://github.com/xxxx1/repo1"))
			.andExpect(jsonPath("$.githubRepos[1]").value("https://github.com/xxxx2/repo2"));
	}

	@Test
	void shouldReturnBadRequestWhenRequestParamIsBlank() throws Exception {
		final var response = mockMvc.perform(get("/source-control?token=   ").contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.message").toString();
		assertThat(result).contains("getRepos.token: token must not be blank");
	}

	@Test
	void shouldReturnBadRequestWhenRequestParamPatternIsIncorrect() throws Exception {
		final var response = mockMvc.perform(get("/source-control?token=12345").contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.message").toString();
		assertThat(result).isEqualTo("getRepos.token: token's pattern is incorrect");
	}

}
