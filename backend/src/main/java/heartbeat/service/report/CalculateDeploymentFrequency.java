package heartbeat.service.report;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.DailyDeploymentCount;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.DeploymentFrequencyModel;
import heartbeat.controller.report.dto.response.DeploymentFrequencyOfPipeline;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Component
public class CalculateDeploymentFrequency {

	private final WorkDay workDay;

	public DeploymentFrequency calculateDeploymentFrequency(List<DeployTimes> deployTimes, Long startTime,
			Long endTime) {
		int timePeriod = workDay.calculateWorkDaysBetween(startTime, endTime);

		List<DeploymentFrequencyModel> deploymentFrequencyModels = deployTimes.stream().map((item) -> {
			int passedDeployTimes = item.getPassed()
				.stream()
				.filter((deployInfoItem) -> Instant.parse(deployInfoItem.getJobFinishTime()).toEpochMilli() <= endTime)
				.toList()
				.size();
			if (passedDeployTimes == 0 || timePeriod == 0) {
				return new DeploymentFrequencyModel(item.getPipelineName(), item.getPipelineStep(), 0,
						Collections.emptyList());
			}
			return new DeploymentFrequencyModel(item.getPipelineName(), item.getPipelineStep(),
					(double) passedDeployTimes / timePeriod, item.getPassed());
		}).toList();

		double deploymentFrequency = deploymentFrequencyModels.stream()
			.mapToDouble(DeploymentFrequencyModel::getValue)
			.sum();

		List<DeploymentFrequencyOfPipeline> deploymentFrequencyOfPipelines = deploymentFrequencyModels.stream()
			.map((item) -> new DeploymentFrequencyOfPipeline(item.getName(), item.getStep(), item.getValue(),
					mapDeploymentPassedItems(item.getPassed()
						.stream()
						.filter((data) -> Instant.parse(data.getJobFinishTime()).toEpochMilli() <= endTime)
						.toList())))
			.toList();

		int pipelineCount = deploymentFrequencyOfPipelines.size();
		double avgDeployFrequency = pipelineCount == 0 ? 0 : deploymentFrequency / pipelineCount;

		// TODO 保留两位小数
		AvgDeploymentFrequency avgDeploymentFrequency = new AvgDeploymentFrequency(Double.toString(avgDeployFrequency));

		return DeploymentFrequency.builder()
			.avgDeploymentFrequency(avgDeploymentFrequency)
			.deploymentFrequencyOfPipelines(deploymentFrequencyOfPipelines)
			.build();
	}

	private List<DailyDeploymentCount> mapDeploymentPassedItems(List<DeployInfo> deployInfos) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
		if (deployInfos == null || deployInfos.isEmpty())
			return Collections.emptyList();
		List<DailyDeploymentCount> dailyDeploymentCounts = new ArrayList<>();
		deployInfos.forEach((item) -> {
			if (!item.getJobFinishTime().equals("") && !item.getJobFinishTime().equals("NaN")) {
				String localDate = formatter.format(Instant.parse(item.getJobFinishTime()).atZone(ZoneId.of("UTC")));
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
