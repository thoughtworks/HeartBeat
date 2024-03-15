package heartbeat.service.report;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.report.dto.response.AvgMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.MeanTimeToRecovery;
import heartbeat.controller.report.dto.response.MeanTimeToRecoveryOfPipeline;
import heartbeat.service.report.calculator.MeanToRecoveryCalculator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class MeanToRecoveryCalculatorTest {

	@InjectMocks
	private MeanToRecoveryCalculator calculator;

	@Test
	void shouldReturnZeroAvgMeanTimeToRecoveryWhenDeployTimesIsEmpty() {
		List<DeployTimes> deployTimes = new ArrayList<>();

		MeanTimeToRecovery result = calculator.calculate(deployTimes);

		Assertions.assertEquals(BigDecimal.ZERO, result.getAvgMeanTimeToRecovery().getTimeToRecovery());
		Assertions.assertTrue(result.getMeanTimeRecoveryPipelines().isEmpty());
	}

	@Test
	void shouldCalculateMeanTimeToRecoveryWhenDeployTimesIsNotEmpty() {
		DeployTimes deploy1 = createDeployTimes("Pipeline 1", "Step 1", 2, 3);

		DeployTimes deploy2 = createDeployTimes("Pipeline 2", "Step 2", 1, 2);

		DeployTimes deploy3 = createDeployTimes("Pipeline 3", "Step 3", 0, 3);

		List<DeployTimes> deployTimesList = new ArrayList<>();
		deployTimesList.add(deploy1);
		deployTimesList.add(deploy2);
		deployTimesList.add(deploy3);

		MeanTimeToRecovery result = calculator.calculate(deployTimesList);

		AvgMeanTimeToRecovery avgMeanTimeToRecovery = result.getAvgMeanTimeToRecovery();
		Assertions.assertEquals(0, avgMeanTimeToRecovery.getTimeToRecovery().compareTo(BigDecimal.valueOf(100000)));

		List<MeanTimeToRecoveryOfPipeline> meanTimeRecoveryPipelines = result.getMeanTimeRecoveryPipelines();
		Assertions.assertEquals(3, meanTimeRecoveryPipelines.size());

		MeanTimeToRecoveryOfPipeline deploy1Result = meanTimeRecoveryPipelines.get(0);
		Assertions.assertEquals("Pipeline 1", deploy1Result.getName());
		Assertions.assertEquals("Step 1", deploy1Result.getStep());
		Assertions.assertEquals(0, deploy1Result.getTimeToRecovery().compareTo(BigDecimal.valueOf(180000)));

		MeanTimeToRecoveryOfPipeline deploy2Result = meanTimeRecoveryPipelines.get(1);
		Assertions.assertEquals("Pipeline 2", deploy2Result.getName());
		Assertions.assertEquals("Step 2", deploy2Result.getStep());
		Assertions.assertEquals(0, deploy2Result.getTimeToRecovery().compareTo(BigDecimal.valueOf(120000)));

		MeanTimeToRecoveryOfPipeline deploy3Result = meanTimeRecoveryPipelines.get(2);
		Assertions.assertEquals("Pipeline 3", deploy3Result.getName());
		Assertions.assertEquals("Step 3", deploy3Result.getStep());
		Assertions.assertEquals(BigDecimal.ZERO, deploy3Result.getTimeToRecovery());
	}

	@Test
	void shouldCalculateMeanTimeToRecoveryWhenDeployTimesIsNotEmptyAndHasCanceledJob() {
		DeployTimes deploy1 = createDeployTimes("Pipeline 1", "Step 1", 2, 3);
		deploy1.getPassed().get(0).setPipelineCanceled(true);

		DeployTimes deploy2 = createDeployTimes("Pipeline 2", "Step 2", 1, 2);
		deploy2.getFailed().get(0).setPipelineCanceled(true);

		DeployTimes deploy3 = createDeployTimes("Pipeline 3", "Step 3", 0, 3);

		List<DeployTimes> deployTimesList = new ArrayList<>();
		deployTimesList.add(deploy1);
		deployTimesList.add(deploy2);
		deployTimesList.add(deploy3);

		MeanTimeToRecovery result = calculator.calculate(deployTimesList);

		AvgMeanTimeToRecovery avgMeanTimeToRecovery = result.getAvgMeanTimeToRecovery();
		Assertions.assertEquals(0, avgMeanTimeToRecovery.getTimeToRecovery().compareTo(BigDecimal.valueOf(80000)));

		List<MeanTimeToRecoveryOfPipeline> meanTimeRecoveryPipelines = result.getMeanTimeRecoveryPipelines();
		Assertions.assertEquals(3, meanTimeRecoveryPipelines.size());

		MeanTimeToRecoveryOfPipeline deploy1Result = meanTimeRecoveryPipelines.get(0);
		Assertions.assertEquals("Pipeline 1", deploy1Result.getName());
		Assertions.assertEquals("Step 1", deploy1Result.getStep());
		Assertions.assertEquals(0, deploy1Result.getTimeToRecovery().compareTo(BigDecimal.valueOf(240000)));

		MeanTimeToRecoveryOfPipeline deploy2Result = meanTimeRecoveryPipelines.get(1);
		Assertions.assertEquals("Pipeline 2", deploy2Result.getName());
		Assertions.assertEquals("Step 2", deploy2Result.getStep());
		Assertions.assertEquals(BigDecimal.ZERO, deploy2Result.getTimeToRecovery());

		MeanTimeToRecoveryOfPipeline deploy3Result = meanTimeRecoveryPipelines.get(2);
		Assertions.assertEquals("Pipeline 3", deploy3Result.getName());
		Assertions.assertEquals("Step 3", deploy3Result.getStep());
		Assertions.assertEquals(BigDecimal.ZERO, deploy3Result.getTimeToRecovery());
	}

	private DeployTimes createDeployTimes(String pipelineName, String pipelineStep, int failedCount, int passedCount) {
		DeployTimes deployTimes = new DeployTimes();
		deployTimes.setPipelineName(pipelineName);
		deployTimes.setPipelineStep(pipelineStep);

		List<DeployInfo> failed = new ArrayList<>();
		List<DeployInfo> passed = new ArrayList<>();

		Instant baseTimestamp = Instant.parse("2023-06-25T18:28:54.981Z");
		long interval = 60 * 1000L;

		for (int i = 1; i <= failedCount; i++) {
			DeployInfo failedJob = new DeployInfo();
			failedJob.setState("failed");
			failedJob.setPipelineCanceled(false);
			failedJob.setJobFinishTime(DateTimeFormatter.ISO_INSTANT.format(baseTimestamp.minusMillis(i * interval)));
			failedJob
				.setPipelineCreateTime(DateTimeFormatter.ISO_INSTANT.format(baseTimestamp.minusMillis(i * interval)));
			failed.add(failedJob);
		}

		for (int i = 1; i <= passedCount; i++) {
			DeployInfo passedJob = new DeployInfo();
			passedJob.setPipelineCanceled(false);
			passedJob.setState("passed");
			passedJob.setJobFinishTime(DateTimeFormatter.ISO_INSTANT.format(baseTimestamp.plusMillis(i * interval)));
			passedJob
				.setPipelineCreateTime(DateTimeFormatter.ISO_INSTANT.format(baseTimestamp.plusMillis(i * interval)));
			passed.add(passedJob);
		}

		deployTimes.setFailed(failed);
		deployTimes.setPassed(passed);

		return deployTimes;
	}

}
