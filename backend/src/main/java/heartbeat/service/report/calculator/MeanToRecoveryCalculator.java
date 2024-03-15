package heartbeat.service.report.calculator;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.report.dto.response.AvgDevMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.DevMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.DevMeanTimeToRecoveryOfPipeline;
import heartbeat.controller.report.dto.response.TotalTimeAndRecoveryTimes;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Log4j2
public class MeanToRecoveryCalculator {

	public DevMeanTimeToRecovery calculate(List<DeployTimes> deployTimes) {
		if (deployTimes.isEmpty()) {
			return new DevMeanTimeToRecovery(
					AvgDevMeanTimeToRecovery.builder().timeToRecovery(stripTrailingZeros(BigDecimal.ZERO)).build(),
					Collections.emptyList());
		}
		List<DevMeanTimeToRecoveryOfPipeline> devMeanTimeToRecoveryOfPipelines = deployTimes.stream()
			.map(this::convertToDevMeanTimeToRecoveryOfPipeline)
			.collect(Collectors.toList());

		BigDecimal avgDevMeanTimeToRecovery = devMeanTimeToRecoveryOfPipelines.stream()
			.map(DevMeanTimeToRecoveryOfPipeline::getTimeToRecovery)
			.reduce(BigDecimal.ZERO, BigDecimal::add)
			.divide(BigDecimal.valueOf(devMeanTimeToRecoveryOfPipelines.size()), 8, RoundingMode.HALF_UP);
		AvgDevMeanTimeToRecovery avgDevMeanTimeToRecoveryObj = AvgDevMeanTimeToRecovery.builder()
			.timeToRecovery(stripTrailingZeros(avgDevMeanTimeToRecovery))
			.build();

		return new DevMeanTimeToRecovery(avgDevMeanTimeToRecoveryObj, devMeanTimeToRecoveryOfPipelines);
	}

	private DevMeanTimeToRecoveryOfPipeline convertToDevMeanTimeToRecoveryOfPipeline(DeployTimes deploy) {
		if (deploy.getFailed().isEmpty()) {
			return new DevMeanTimeToRecoveryOfPipeline(deploy.getPipelineName(), deploy.getPipelineStep(),
					BigDecimal.ZERO);
		}
		else {
			TotalTimeAndRecoveryTimes result = getTotalRecoveryTimeAndRecoveryTimes(deploy);
			BigDecimal devMeanTimeToRecovery = BigDecimal.ZERO;
			if (result.getRecoveryTimes() != 0) {
				devMeanTimeToRecovery = stripTrailingZeros(new BigDecimal(result.getTotalTimeToRecovery())
					.divide(new BigDecimal(result.getRecoveryTimes()), 8, RoundingMode.HALF_UP));
			}
			return new DevMeanTimeToRecoveryOfPipeline(deploy.getPipelineName(), deploy.getPipelineStep(),
					devMeanTimeToRecovery);
		}
	}

	private BigDecimal stripTrailingZeros(BigDecimal timeToRecovery) {
		return timeToRecovery.stripTrailingZeros();
	}

	private TotalTimeAndRecoveryTimes getTotalRecoveryTimeAndRecoveryTimes(DeployTimes deploy) {
		List<DeployInfo> sortedJobs = new ArrayList<>(deploy.getFailed());
		sortedJobs.addAll(deploy.getPassed());
		sortedJobs.sort(Comparator.comparing(DeployInfo::getPipelineCreateTime));
		sortedJobs = sortedJobs.stream().filter(deployInfo -> !deployInfo.isPipelineCanceled()).toList();

		long totalTimeToRecovery = 0;
		long failedJobFinishedTime = 0;
		int recoveryTimes = 0;

		for (DeployInfo job : sortedJobs) {
			long currentJobFinishTime = Instant.parse(job.getJobFinishTime()).toEpochMilli();
			if ("passed".equals(job.getState()) && failedJobFinishedTime != 0) {
				totalTimeToRecovery += currentJobFinishTime - failedJobFinishedTime;
				failedJobFinishedTime = 0;
				recoveryTimes++;
			}
			if ("failed".equals(job.getState()) && failedJobFinishedTime == 0) {
				failedJobFinishedTime = currentJobFinishTime;
			}
		}
		return new TotalTimeAndRecoveryTimes(totalTimeToRecovery, recoveryTimes);
	}

}
