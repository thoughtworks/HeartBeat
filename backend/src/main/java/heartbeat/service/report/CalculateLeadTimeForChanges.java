package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@Component
public class CalculateLeadTimeForChanges {

	public LeadTimeForChanges calculateLeadTimeForChanges(List<PipelineLeadTime> pipelineLeadTime) {

		List<LeadTimeForChangesOfPipelines> leadTimeForChangesOfPipelines = new ArrayList<>();
		AvgLeadTimeForChanges avgLeadTimeForChanges = new AvgLeadTimeForChanges(0d, 0d);


		if (pipelineLeadTime == null || pipelineLeadTime.isEmpty()){
			return new LeadTimeForChanges(leadTimeForChangesOfPipelines, avgLeadTimeForChanges);
		}

		List<HashMap<String, Double>>  avgDelayTimeMapList = pipelineLeadTime.stream().map(item -> {
			int times = item.getLeadTimes().size();
			if (item.getLeadTimes().isEmpty()) {
				return new HashMap<String, Double>();
			}

			HashMap<Double, Double> totalDelayTime = item.getLeadTimes()
			.stream()
			.map(this::getDelayTimeMapWithLeadTime)
			.reduce(new HashMap<>(), (pre, now) -> now);

			double totalPrDelayTime = totalDelayTime.keySet().stream().reduce(0d, Double::sum);
			double totalPipelineDelayTime = totalDelayTime.values().stream().reduce(0d, Double::sum);

			double avgPrDelayTime = totalPrDelayTime / times;
			double avgPipelineDelayTime = totalPipelineDelayTime / times;

			leadTimeForChangesOfPipelines.add(
				new LeadTimeForChangesOfPipelines(
				item.getPipelineName(),
				item.getPipelineStep(),
				avgPrDelayTime,
				avgPipelineDelayTime
				)
			);

			HashMap<String, Double> avgTotalDelayTime = new HashMap<>();
			avgTotalDelayTime.put("avgPrDelayTime", avgPrDelayTime);
			avgTotalDelayTime.put("avgPipelineDelayTime", avgPipelineDelayTime);

			return avgTotalDelayTime;
			}).toList();

		Double avgPrDelayTimeOfAllPipeline = avgDelayTimeMapList.stream()
			.map(item -> item.getOrDefault("avgPrDelayTime", 0d))
			.reduce(0.0, Double::sum);
		Double AvgPipeDelayTimeOfAllPipeline = avgDelayTimeMapList.stream()
			.map(item -> item.getOrDefault("avgPipelineDelayTime", 0d))
			.reduce(0.0, Double::sum);
		avgLeadTimeForChanges.setDelayTime(
			avgPrDelayTimeOfAllPipeline / pipelineCount,
			AvgPipeDelayTimeOfAllPipeline / pipelineCount);

		return new LeadTimeForChanges(leadTimeForChangesOfPipelines, avgLeadTimeForChanges);
	}

		private HashMap<Double, Double> getDelayTimeMapWithLeadTime(LeadTime leadTime) {
			HashMap<Double, Double> delayTimeMap = new HashMap<>();
			delayTimeMap.put(leadTime.getPrDelayTime(), leadTime.getPipelineDelayTime());
			return delayTimeMap;
		}

}
