import { PipelineLeadTime } from "../../models/codebase/LeadTime";
import { Pair } from "../../types/Pair";
import {
  AvgLeadTimeForChanges,
  LeadTimeForChangesOfPipeline,
} from "../../contract/GenerateReporter/GenerateReporterResponse";

export function calculateAvgLeadTime(
  pipelinesLeadTime: PipelineLeadTime[]
): Pair<LeadTimeForChangesOfPipeline[], AvgLeadTimeForChanges> {
  const pipelineCount = pipelinesLeadTime.length;
  const leadTimeForChangesOfPipelines: LeadTimeForChangesOfPipeline[] = [];

  if (pipelineCount == 0) {
    return new Pair<LeadTimeForChangesOfPipeline[], AvgLeadTimeForChanges>(
      leadTimeForChangesOfPipelines,
      new AvgLeadTimeForChanges(0, 0)
    );
  }

  const totalLeadTimeOfAllPipeline: Pair<number, number> = pipelinesLeadTime
    .map((item) => {
      const times = item.leadTimes.length;
      if (times == 0) {
        return new Pair<number, number>(0, 0);
      }

      const totalLeadTime: Pair<number, number> = item.leadTimes
        .map(
          (leadTime) =>
            new Pair<number, number>(
              leadTime.prDelayTime == undefined ? 0 : leadTime.prDelayTime,
              leadTime.pipelineDelayTime
            )
        )
        .reduce((pre, now) => pre.add(now));

      const avgMergeDelayTimeOfPipeline = totalLeadTime.key / times;
      const avgPipelineDelayTimeOfPipeline = totalLeadTime.value / times;

      leadTimeForChangesOfPipelines.push(
        new LeadTimeForChangesOfPipeline(
          item.pipelineName,
          item.pipelineStep,
          avgMergeDelayTimeOfPipeline,
          avgPipelineDelayTimeOfPipeline
        )
      );

      return new Pair<number, number>(
        avgMergeDelayTimeOfPipeline,
        avgPipelineDelayTimeOfPipeline
      );
    })
    .reduce((pre, now) => pre.add(now));

  const avgLeadTimeOfAllPipelines: AvgLeadTimeForChanges = new AvgLeadTimeForChanges(
    totalLeadTimeOfAllPipeline.key / pipelineCount,
    totalLeadTimeOfAllPipeline.value / pipelineCount
  );

  return new Pair<LeadTimeForChangesOfPipeline[], AvgLeadTimeForChanges>(
    leadTimeForChangesOfPipelines,
    avgLeadTimeOfAllPipelines
  );
}
