package heartbeat.service.report.calculator;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.report.dto.response.ChangeFailureRate;
import heartbeat.service.pipeline.buildkite.builder.DeployInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployTimesBuilder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CalculateChangeFailureRateTest {

	private static final String JOB_FINISH_TIME_2022 = "2022-09-08T22:45:33.981Z";

	private static final String JOB_FINISH_TIME_2023 = "2023-09-08T22:45:33.981Z";

	private static final String FAILED_STATE = "failed";

	private static final String OTHER_JOB_NAME = "JobName";

	@InjectMocks
	private ChangeFailureRateCalculator changeFailureRate;

	@Test
	public void testCalculateChangeFailureRate() {
		DeployTimes mockedDeployTimes = DeployTimesBuilder.withDefault()
			.withPassed(List.of(DeployInfoBuilder.withDefault().withJobFinishTime(JOB_FINISH_TIME_2023).build(),
					DeployInfoBuilder.withDefault().withJobFinishTime(JOB_FINISH_TIME_2023).build()))
			.withFailed(List.of(DeployInfo.builder().jobFinishTime(JOB_FINISH_TIME_2022).state(FAILED_STATE).build()))
			.build();

		ChangeFailureRate changeFailureRate = this.changeFailureRate.calculate(List.of(mockedDeployTimes));

		assertThat(changeFailureRate.getAvgChangeFailureRate().getFailureRate()).isEqualTo(0.3333F);
		assertThat(changeFailureRate.getAvgChangeFailureRate().getTotalFailedTimes()).isEqualTo(1);
		assertThat(changeFailureRate.getAvgChangeFailureRate().getTotalTimes()).isEqualTo(3);
	}

	@Test
	public void testCalculateChangeFailureRateWhenTotalDeployInfosTimesIsZero() {
		DeployTimes mockedDeployTimes = DeployTimesBuilder.withDefault()
			.withPassed(Collections.emptyList())
			.withFailed(Collections.emptyList())
			.build();

		ChangeFailureRate changeFailureRate = this.changeFailureRate.calculate(List.of(mockedDeployTimes));

		assertThat(changeFailureRate.getAvgChangeFailureRate().getFailureRate()).isEqualTo(0.0F);
		assertThat(changeFailureRate.getAvgChangeFailureRate().getTotalFailedTimes()).isEqualTo(0);
		assertThat(changeFailureRate.getAvgChangeFailureRate().getTotalTimes()).isEqualTo(0);
	}

	@Test
	public void testCalculateChangeFailureRateWhenHavePassedDeployInfoWhoseJobNameIsNotEqualToPipelineStep() {
		DeployTimes mockedDeployTimes = DeployTimesBuilder.withDefault()
			.withPassed(List.of(DeployInfoBuilder.withDefault()
				.withJobName(OTHER_JOB_NAME)
				.withJobFinishTime(JOB_FINISH_TIME_2023)
				.build(), DeployInfoBuilder.withDefault().withJobFinishTime(JOB_FINISH_TIME_2023).build()))
			.withFailed(List.of(DeployInfo.builder().jobFinishTime(JOB_FINISH_TIME_2022).state(FAILED_STATE).build()))
			.build();

		ChangeFailureRate changeFailureRate = this.changeFailureRate.calculate(List.of(mockedDeployTimes));

		assertThat(changeFailureRate.getAvgChangeFailureRate().getFailureRate()).isEqualTo(0.5F);
		assertThat(changeFailureRate.getAvgChangeFailureRate().getTotalFailedTimes()).isEqualTo(1);
		assertThat(changeFailureRate.getAvgChangeFailureRate().getTotalTimes()).isEqualTo(2);
	}

}
