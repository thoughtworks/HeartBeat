package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.util.TimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Log4j2
@RequiredArgsConstructor
@Component
public class LeadTimeForChangesCalculator {

	public LeadTimeForChanges calculate(List<PipelineLeadTime> pipelineLeadTime) {
		int pipelineCount = pipelineLeadTime.size();
		List<LeadTimeForChangesOfPipelines> leadTimeForChangesOfPipelines = new ArrayList<>();
		AvgLeadTimeForChanges avgLeadTimeForChanges = new AvgLeadTimeForChanges();

		if (pipelineLeadTime.isEmpty()) {
			return new LeadTimeForChanges(leadTimeForChangesOfPipelines, avgLeadTimeForChanges);
		}

		List<HashMap<String, Double>> avgDelayTimeMapList = pipelineLeadTime.stream().map(item -> {
			if (item.getLeadTimes() == null || item.getLeadTimes().isEmpty()) {
				return new HashMap<String, Double>();
			}
			int times = item.getLeadTimes().size();
			HashMap<Double, Double> totalDelayTime = item.getLeadTimes()
				.stream()
				.map(this::getDelayTimeMapWithLeadTime)
				.reduce(new HashMap<>(), (pre, now) -> now);

			double totalPrDelayTime = totalDelayTime.keySet().stream().reduce(0d, Double::sum);
			double totalPipelineDelayTime = totalDelayTime.values().stream().reduce(0d, Double::sum);

			double avgPrDelayTime = TimeUtil.convertMillisecondToMinutes(totalPrDelayTime / times);
			double avgPipelineDelayTime = TimeUtil.convertMillisecondToMinutes(totalPipelineDelayTime / times);

			leadTimeForChangesOfPipelines.add(LeadTimeForChangesOfPipelines.builder()
				.name(item.getPipelineName())
				.step(item.getPipelineStep())
				.mergeDelayTime(avgPrDelayTime)
				.pipelineDelayTime(avgPipelineDelayTime)
				.totalDelayTime(avgPrDelayTime + avgPipelineDelayTime)
				.build());

			HashMap<String, Double> avgTotalDelayTime = new HashMap<>();
			avgTotalDelayTime.put("avgPrDelayTime", avgPrDelayTime);
			avgTotalDelayTime.put("avgPipelineDelayTime", avgPipelineDelayTime);

			return avgTotalDelayTime;
		}).toList();

		Double avgPrDelayTimeOfAllPipeline = avgDelayTimeMapList.stream()
			.map(item -> item.getOrDefault("avgPrDelayTime", 0d))
			.reduce(0.0, Double::sum);
		Double avgPipeDelayTimeOfAllPipeline = avgDelayTimeMapList.stream()
			.map(item -> item.getOrDefault("avgPipelineDelayTime", 0d))
			.reduce(0.0, Double::sum);
		Double avgMergeDelayTime = avgPrDelayTimeOfAllPipeline / pipelineCount;
		Double avgPipelineDelayTime = avgPipeDelayTimeOfAllPipeline / pipelineCount;

		avgLeadTimeForChanges.setMergeDelayTime(avgMergeDelayTime);
		avgLeadTimeForChanges.setPipelineDelayTime(avgPipelineDelayTime);
		avgLeadTimeForChanges.setTotalDelayTime(avgMergeDelayTime + avgPipelineDelayTime);

		return new LeadTimeForChanges(leadTimeForChangesOfPipelines, avgLeadTimeForChanges);
	}

	private HashMap<Double, Double> getDelayTimeMapWithLeadTime(LeadTime leadTime) {
		HashMap<Double, Double> delayTimeMap = new HashMap<>();
		delayTimeMap.put(leadTime.getPrDelayTime(), leadTime.getPipelineDelayTime());
		return delayTimeMap;
	}

}
