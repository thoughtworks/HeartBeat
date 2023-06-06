package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.util.TimeUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.LongStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

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
			List<LeadTime> leadTimes = item.getLeadTimes().stream()
				.filter(leadTime -> leadTime.getPrMergedTime() != 0).toList();

			double totalPrDelayTime = leadTimes
				.stream()
				.flatMapToLong(leadTime -> LongStream.of(leadTime.getPrDelayTime()))
				.sum();
			double totalPipelineDelayTime = leadTimes
				.stream()
				.flatMapToLong(leadTime -> LongStream.of(leadTime.getPipelineDelayTime()))
				.sum();

			double avgPrDelayTime = TimeUtil.convertMillisecondToMinutes(totalPrDelayTime / leadTimes.size());
			double avgPipelineDelayTime = TimeUtil.convertMillisecondToMinutes(
				totalPipelineDelayTime / leadTimes.size());

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

}
