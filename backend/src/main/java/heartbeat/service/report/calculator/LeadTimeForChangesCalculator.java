package heartbeat.service.report.calculator;

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
import java.util.stream.LongStream;

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
			int buildNumber = item.getLeadTimes().size();
			// 过滤掉noPr的数据
			List<LeadTime> noPrLeadTime = item.getLeadTimes()
				.stream()
				.filter(leadTime -> leadTime.getPrMergedTime() != null && leadTime.getPrMergedTime() != 0)
				.filter(leadTime -> leadTime.getPrLeadTime() != null && leadTime.getPrLeadTime() != 0)
				.toList();
			// 通过noPrLeadTimeList去计算totalPrLeadTime
			double totalPrLeadTime = noPrLeadTime.stream()
				.flatMapToLong(leadTime -> LongStream.of(leadTime.getPrLeadTime()))
				.sum();
			// 通过PipelineLeadTime去计算totalPipelineLeadTime
			double totalPipelineLeadTime = item.getLeadTimes()
				.stream()
				.flatMapToLong(leadTime -> LongStream.of(leadTime.getPipelineLeadTime()))
				.sum();

			double avgPrLeadTime = TimeUtil.convertMillisecondToMinutes(totalPrLeadTime / buildNumber);
			double avgPipelineLeadTime = TimeUtil.convertMillisecondToMinutes(totalPipelineLeadTime / buildNumber);

			leadTimeForChangesOfPipelines.add(LeadTimeForChangesOfPipelines.builder()
				.name(item.getPipelineName())
				.step(item.getPipelineStep())
				.prLeadTime(avgPrLeadTime)
				.pipelineLeadTime(avgPipelineLeadTime)
				.totalDelayTime(avgPrLeadTime + avgPipelineLeadTime)
				.build());

			HashMap<String, Double> avgTotalDelayTime = new HashMap<>();
			avgTotalDelayTime.put("avgPrLeadTime", avgPrLeadTime);
			avgTotalDelayTime.put("avgPipelineLeadTime", avgPipelineLeadTime);

			return avgTotalDelayTime;
		}).toList();

		Double avgPrLeadTimeOfAllPipeline = avgDelayTimeMapList.stream()
			.map(item -> item.getOrDefault("avgPrLeadTime", 0d))
			.reduce(0.0, Double::sum);
		Double avgPipeDelayTimeOfAllPipeline = avgDelayTimeMapList.stream()
			.map(item -> item.getOrDefault("avgPipelineLeadTime", 0d))
			.reduce(0.0, Double::sum);
		Double avgPrLeadTime = avgPrLeadTimeOfAllPipeline / pipelineCount;
		Double avgPipelineLeadTime = avgPipeDelayTimeOfAllPipeline / pipelineCount;

		avgLeadTimeForChanges.setPrLeadTime(avgPrLeadTime);
		avgLeadTimeForChanges.setPipelineLeadTime(avgPipelineLeadTime);
		avgLeadTimeForChanges.setTotalDelayTime(avgPrLeadTime + avgPipelineLeadTime);

		return new LeadTimeForChanges(leadTimeForChangesOfPipelines, avgLeadTimeForChanges);
	}

}
