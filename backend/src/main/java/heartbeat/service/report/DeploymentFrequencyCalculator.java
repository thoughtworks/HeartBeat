package heartbeat.service.report;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.DailyDeploymentCount;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.DeploymentFrequencyOfPipeline;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.text.DecimalFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class DeploymentFrequencyCalculator {

	public static final String FORMAT_2_DECIMALS = "0.00";

	private final WorkDay workDay;

	public DeploymentFrequency calculate(List<DeployTimes> deployTimes, Long startTime, Long endTime) {
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_2_DECIMALS);
		int timePeriod = workDay.calculateWorkDaysBetween(startTime, endTime);

		List<DeploymentFrequencyOfPipeline> deploymentFrequencyOfPipelines = deployTimes.stream().map((item) -> {
			List<DeployInfo> filteredPassedItems = filterPassedItemsByTime(item.getPassed(), startTime, endTime);
			int passedDeployInfosCount = filteredPassedItems.size();
			List<DailyDeploymentCount> dailyDeploymentCounts = mapDeploymentPassedItems(filteredPassedItems);
			float frequency = passedDeployInfosCount == 0 || timePeriod == 0 ? 0
					: (float) passedDeployInfosCount / timePeriod;
			return DeploymentFrequencyOfPipeline.builder()
				.name(item.getPipelineName())
				.step(item.getPipelineStep())
				.dailyDeploymentCounts(dailyDeploymentCounts)
				.deploymentFrequency(Float.parseFloat(decimalFormat.format(frequency)))
				.build();
		}).collect(Collectors.toList());

		float deploymentFrequency = (float) deploymentFrequencyOfPipelines.stream()
			.mapToDouble(DeploymentFrequencyOfPipeline::getDeploymentFrequency)
			.sum();
		int pipelineCount = deploymentFrequencyOfPipelines.size();
		float avgDeployFrequency = pipelineCount == 0 ? 0 : deploymentFrequency / pipelineCount;

		return DeploymentFrequency.builder()
			.avgDeploymentFrequency(AvgDeploymentFrequency.builder()
				.deploymentFrequency(Float.parseFloat(decimalFormat.format(avgDeployFrequency)))
				.build())
			.deploymentFrequencyOfPipelines(deploymentFrequencyOfPipelines)
			.build();
	}

	private List<DeployInfo> filterPassedItemsByTime(List<DeployInfo> deployInfos, Long startTime, Long endTime) {
		return deployInfos.stream().filter((data) -> {
			long time = Instant.parse(data.getJobFinishTime()).toEpochMilli();
			return time > startTime && time <= endTime;
		}).toList();
	}

	private List<DailyDeploymentCount> mapDeploymentPassedItems(List<DeployInfo> deployInfos) {
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
		List<DailyDeploymentCount> dailyDeploymentCounts = new ArrayList<>();

		if (deployInfos == null || deployInfos.isEmpty()) {
			return Collections.emptyList();
		}

		deployInfos.forEach((item) -> {
			if (!item.getJobFinishTime().isEmpty() && !item.getJobFinishTime().equals("NaN")) {
				String localDate = dateTimeFormatter
					.format(Instant.parse(item.getJobFinishTime()).atZone(ZoneId.of("UTC")));
				DailyDeploymentCount existingDateItem = dailyDeploymentCounts.stream()
					.filter((dateCountItem) -> dateCountItem.getDate().equals(localDate))
					.findFirst()
					.orElse(null);
				if (existingDateItem == null) {
					DailyDeploymentCount dateCountItem = new DailyDeploymentCount(localDate, 1);
					dailyDeploymentCounts.add(dateCountItem);
				}
				else {
					existingDateItem.setCount(existingDateItem.getCount() + 1);
				}
			}
		});
		return dailyDeploymentCounts;
	}

}
