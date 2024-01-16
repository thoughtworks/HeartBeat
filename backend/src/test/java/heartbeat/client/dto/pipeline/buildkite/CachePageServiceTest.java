package heartbeat.client.dto.pipeline.buildkite;

import heartbeat.client.BuildKiteFeignClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CachePageServiceTest {

	@Mock
	BuildKiteFeignClient buildKiteFeignClient;

	CachePageService cachePageService;

	public static final String MOCK_TOKEN = "mock_token";

	public static final String TEST_ORG_ID = "test_org_id";

	private static final String MOCK_START_TIME = "1661702400000";

	private static final String MOCK_END_TIME = "1662739199000";

	public static final String TEST_JOB_NAME = "testJob";

	public static final String TEST_PIPELINE_ID = "test_pipeline_id";

	public static final String TOTAL_PAGE_HEADER = """
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="first",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="prev",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?per_page=100&page=2>; rel="next",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=3&per_page=100>; rel="last"
			""";

	public static final String NONE_TOTAL_PAGE_HEADER = """
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="first",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="prev",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?per_page=100&page=2>; rel="next"
			""";

	@BeforeEach
	public void setUp() {
		cachePageService = new CachePageService(buildKiteFeignClient);
	}

	@Test
	public void shouldReturnPageStepsInfoDtoWhenFetchPageStepsInfoSuccessGivenNullLinkHeader() {
		BuildKiteJob testJob = BuildKiteJob.builder().name(TEST_JOB_NAME).build();
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder()
			.jobs(List.of(testJob))
			.author(BuildKiteBuildInfo.Author.builder().name("xx").build())
			.build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		PageStepsInfoDto pageStepsInfoDto = cachePageService.fetchPageStepsInfo(MOCK_TOKEN, TEST_ORG_ID,
				TEST_PIPELINE_ID, "1", "100", MOCK_START_TIME, MOCK_END_TIME, List.of("main"));

		assertNotNull(pageStepsInfoDto);
		assertThat(pageStepsInfoDto.getFirstPageStepsInfo()).isEqualTo(responseEntity.getBody());
		assertThat(pageStepsInfoDto.getTotalPage()).isEqualTo(1);
	}

	@Test
	public void shouldReturnPageStepsInfoDtoWhenFetchPageStepsInfoSuccessGivenValidLinkHeader() {
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		BuildKiteJob testJob = BuildKiteJob.builder().name(TEST_JOB_NAME).build();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				httpHeaders, HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		PageStepsInfoDto pageStepsInfoDto = cachePageService.fetchPageStepsInfo(MOCK_TOKEN, TEST_ORG_ID,
				TEST_PIPELINE_ID, "1", "100", MOCK_START_TIME, MOCK_END_TIME, List.of("main"));

		assertNotNull(pageStepsInfoDto);
		assertThat(pageStepsInfoDto.getFirstPageStepsInfo()).isEqualTo(responseEntity.getBody());
		assertThat(pageStepsInfoDto.getTotalPage()).isEqualTo(3);
	}

	@Test
	public void shouldReturnPageStepsInfoDtoWhenFetchPageStepsInfoSuccessGivenExistButNotMatchedLinkHeader() {
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(NONE_TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		BuildKiteJob testJob = BuildKiteJob.builder().name(TEST_JOB_NAME).build();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				httpHeaders, HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		PageStepsInfoDto pageStepsInfoDto = cachePageService.fetchPageStepsInfo(MOCK_TOKEN, TEST_ORG_ID,
				TEST_PIPELINE_ID, "1", "100", MOCK_START_TIME, MOCK_END_TIME, List.of("main"));

		assertNotNull(pageStepsInfoDto);
		assertThat(pageStepsInfoDto.getFirstPageStepsInfo()).isEqualTo(responseEntity.getBody());
		assertThat(pageStepsInfoDto.getTotalPage()).isEqualTo(1);
	}

}
