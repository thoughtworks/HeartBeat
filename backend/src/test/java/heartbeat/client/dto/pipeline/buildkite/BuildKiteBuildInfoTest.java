package heartbeat.client.dto.pipeline.buildkite;

import static org.junit.jupiter.api.Assertions.assertEquals;

import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteJobBuilder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.STRICT_STUBS)
class BuildKiteBuildInfoTest {

	@InjectMocks
	BuildKiteService buildKiteService;

	@Test
	void shouldReturnLastFailedOrSuccessJob() {
		BuildKiteJob failedJob1 = BuildKiteJobBuilder.withDefault()
			.withName("job1")
			.withName("test")
			.withState("pass")
			.withFinishedAt("2022-09-09T04:57:09.545Z")
			.build();
		BuildKiteJob failedJob2 = BuildKiteJobBuilder.withDefault()
			.withName("job2")
			.withName("build")
			.withState("pass")
			.withFinishedAt("2022-09-10T04:57:09.545Z")
			.build();
		BuildKiteJob failedJob3 = BuildKiteJobBuilder.withDefault()
			.withName("job3")
			.withName("deploy qa")
			.withFinishedAt("2022-09-11T04:57:09.545Z")
			.build();
		BuildKiteJob successJob1 = BuildKiteJobBuilder.withDefault()
			.withName("job5")
			.withName("test")
			.withState("pass")
			.withFinishedAt("2022-09-13T04:57:09.545Z")
			.build();
		BuildKiteJob successJob2 = BuildKiteJobBuilder.withDefault()
			.withName("job6")
			.withName("build")
			.withState("pass")
			.withFinishedAt("2022-09-14T04:57:09.545Z")
			.build();
		BuildKiteJob successJob3 = BuildKiteJobBuilder.withDefault()
			.withName("job7")
			.withName("deploy qa")
			.withState("pass")
			.withFinishedAt("2022-09-15T04:57:09.545Z")
			.build();
		BuildKiteJob successJob4 = BuildKiteJobBuilder.withDefault()
			.withName("job8")
			.withName("deploy uat")
			.withState("pass")
			.withFinishedAt("2022-09-16T04:57:09.545Z")
			.build();
		BuildKiteJob successJob5 = BuildKiteJobBuilder.withDefault()
			.withName("job9")
			.withName("deploy uat")
			.withState("pass")
			.withFinishedAt(null)
			.withStartedAt(null)
			.build();
		List<BuildKiteJob> failedJobs = Arrays.asList(failedJob1, failedJob2, failedJob3);
		List<BuildKiteJob> successJobs = Arrays.asList(successJob1, successJob2, successJob3, successJob4, successJob5);
		List<String> steps = Arrays.asList("test", "build", "deploy qa", "deploy uat");

		BuildKiteJob failedResult = buildKiteService.getBuildKiteJob(failedJobs, steps, Arrays.asList("failed", "pass"),
				String.valueOf(Instant.MIN.getEpochSecond()), String.valueOf(Instant.MAX.getEpochSecond()));
		BuildKiteJob successResult = buildKiteService.getBuildKiteJob(successJobs, steps,
				Arrays.asList("failed", "pass"), String.valueOf(Instant.MIN.getEpochSecond()),
				String.valueOf(Instant.MAX.getEpochSecond()));

		assertEquals("deploy qa", failedResult.getName());
		assertEquals("deploy uat", successResult.getName());
	}

}
