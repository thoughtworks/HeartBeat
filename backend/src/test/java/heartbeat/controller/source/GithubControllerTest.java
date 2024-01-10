package heartbeat.controller.source;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.controller.source.dto.SourceControlDTO;
import heartbeat.controller.source.dto.VerifyBranchRequest;
import heartbeat.service.source.github.GitHubService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.LinkedHashSet;
import java.util.List;

import static heartbeat.TestFixtures.GITHUB_REPOSITORY;
import static heartbeat.TestFixtures.GITHUB_TOKEN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
	@Deprecated
	void shouldReturnOkStatusAndCorrectResponseWithRepos() throws Exception {
		LinkedHashSet<String> repos = new LinkedHashSet<>(
				List.of("https://github.com/xxxx1/repo1", "https://github.com/xxxx2/repo2"));

		GitHubResponse githubReposResponse = GitHubResponse.builder().githubRepos(repos).build();

		when(gitHubVerifyService.verifyToken(any())).thenReturn(githubReposResponse);
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token(GITHUB_TOKEN).build();

		mockMvc
			.perform(post("/source-control").content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.githubRepos[0]").value("https://github.com/xxxx1/repo1"))
			.andExpect(jsonPath("$.githubRepos[1]").value("https://github.com/xxxx2/repo2"));
	}

	@Test
	void shouldReturnNoContentStatusWhenVerifyToken() throws Exception {
		doNothing().when(gitHubVerifyService).verifyTokenV2(GITHUB_TOKEN);
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token(GITHUB_TOKEN).build();

		mockMvc
			.perform(post("/source-control/github/verify")
				.content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isNoContent());
	}

	@Test
	void shouldReturnNoContentStatusWhenVerifyTargetBranch() throws Exception {
		VerifyBranchRequest verifyBranchRequest = VerifyBranchRequest.builder()
			.repository(GITHUB_REPOSITORY)
			.token(GITHUB_TOKEN)
			.build();
		doNothing().when(gitHubVerifyService).verifyCanReadTargetBranch("fake/repo", "main", GITHUB_TOKEN);

		mockMvc
			.perform(post("/source-control/github/repos/branches/main/verify")
				.content(new ObjectMapper().writeValueAsString(verifyBranchRequest))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isNoContent());
	}

	@Test
	@Deprecated
	void shouldReturnBadRequestWhenRequestBodyIsBlank() throws Exception {
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token(null).build();

		final var response = mockMvc
			.perform(post("/source-control").content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.token").toString();
		assertThat(result).contains("Token cannot be empty.");
	}

	@Test
	void shouldReturnBadRequestGivenRequestBodyIsNullWhenVerifyToken() throws Exception {
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/verify")
				.content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.token").toString();
		assertThat(result).contains("Token cannot be empty.");
	}

	@Test
	void shouldReturnBadRequestGivenRequestBodyIsNullWhenVerifyBranch() throws Exception {
		VerifyBranchRequest verifyBranchRequest = VerifyBranchRequest.builder().build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/repos/branches/main/verify")
				.content(new ObjectMapper().writeValueAsString(verifyBranchRequest))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.token").toString();
		assertThat(result).contains("Token cannot be empty.");
	}

	@Test
	void shouldReturnBadRequestGivenRepositoryIsNullWhenVerifyBranch() throws Exception {
		VerifyBranchRequest verifyBranchRequest = VerifyBranchRequest.builder().token(GITHUB_TOKEN).build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/repos/branches/main/verify")
				.content(new ObjectMapper().writeValueAsString(verifyBranchRequest))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.repository").toString();
		assertThat(result).contains("Repository is required.");
	}

	@Test
	void shouldReturnBadRequestGivenSourceTypeIsWrongWhenVerifyToken() throws Exception {
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token(GITHUB_TOKEN).build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/verify")
				.content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.message").toString();
		assertThat(result).contains("Source type is incorrect.");
	}

	@Test
	void shouldReturnBadRequestGivenSourceTypeIsWrongWhenVerifyBranch() throws Exception {
		VerifyBranchRequest request = VerifyBranchRequest.builder()
			.repository(GITHUB_REPOSITORY)
			.token(GITHUB_TOKEN)
			.build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/repos/branches/main/verify")
				.content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.message").toString();
		assertThat(result).contains("Source type is incorrect.");
	}

	@Test
	void shouldReturnBadRequestGivenSourceTypeIsBlankWhenVerifyToken() throws Exception {
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token(GITHUB_TOKEN).build();

		final var response = mockMvc
			.perform(post("/source-control/  /verify").content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.message").toString();
		assertThat(result).contains("verifyToken.sourceType: must not be blank");
	}

	@Test
	void shouldReturnBadRequestGivenSourceTypeIsBlankWhenVerifyBranch() throws Exception {
		VerifyBranchRequest request = VerifyBranchRequest.builder()
			.token(GITHUB_TOKEN)
			.repository(GITHUB_REPOSITORY)
			.build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/repos/branches/ /verify")
				.content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.message").toString();
		assertThat(result).contains("verifyBranch.branch: must not be blank");
	}

	@Test
	@Deprecated
	void shouldReturnBadRequestWhenRequestParamPatternIsIncorrect() throws Exception {
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token("12345").build();

		final var response = mockMvc
			.perform(post("/source-control").content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.token").toString();
		assertThat(result).isEqualTo("token's pattern is incorrect");
	}

	@ParameterizedTest
	@ValueSource(strings = { "12345", "  ", "" })
	void shouldReturnBadRequestGivenRequestParamPatternIsIncorrectWhenVerifyToken(String token) throws Exception {
		SourceControlDTO sourceControlDTO = SourceControlDTO.builder().token(token).build();

		final var response = mockMvc
			.perform(post("/source-control/github/verify")
				.content(new ObjectMapper().writeValueAsString(sourceControlDTO))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.token").toString();
		assertThat(result).isEqualTo("token's pattern is incorrect");
	}

	@ParameterizedTest
	@ValueSource(strings = { "12345", "  ", "" })
	void shouldReturnBadRequestGivenRequestParamPatternIsIncorrectWhenVerifyBranch(String token) throws Exception {
		VerifyBranchRequest request = VerifyBranchRequest.builder().token(token).build();

		final var response = mockMvc
			.perform(post("/source-control/GitHub/repos/branches/main/verify")
				.content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.token").toString();
		assertThat(result).isEqualTo("token's pattern is incorrect");
	}

}
