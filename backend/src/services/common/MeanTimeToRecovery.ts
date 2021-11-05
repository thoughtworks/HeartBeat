import { DeployInfo, DeployTimes } from "../../models/pipeline/DeployTimes";
import {
  AvgMeanTimeToRecovery,
  MeanTimeToRecovery,
  MeanTimeToRecoveryOfPipeline,
} from "../../contract/GenerateReporter/GenerateReporterResponse";

export function calculateMeanTimeToRecovery(
  deployTimes: DeployTimes[]
): MeanTimeToRecovery {
  const meanTimeRecoveryPipelines: MeanTimeToRecoveryOfPipeline[] = deployTimes.map(
    (item) => {
      const totalTimeToRecovery = item.failed.reduce(
        (prev: number, failedJob: DeployInfo): number => {
          const failedJobCreateTime = new Date(
            failedJob.pipelineCreateTime
          ).getTime();
          let timeToRecovery = Infinity;
          for (let i = 0; i < item.passed.length; i++) {
            const time =
              new Date(item.passed[i].pipelineCreateTime).getTime() -
              failedJobCreateTime;
            timeToRecovery =
              time > 0 && time < timeToRecovery ? time : timeToRecovery;
          }
          return prev + timeToRecovery;
        },
        0
      );
      return new MeanTimeToRecoveryOfPipeline(
        item.pipelineName,
        item.pipelineStep,
        totalTimeToRecovery / item.failed.length || 0
      );
    }
  );

  const avgMeanTimeToRecovery: number =
    meanTimeRecoveryPipelines.reduce(
      (prev: number, pipeline: MeanTimeToRecoveryOfPipeline): number => {
        return prev + pipeline.timeToRecovery;
      },
      0
    ) / meanTimeRecoveryPipelines.length;

  return new MeanTimeToRecovery(
    new AvgMeanTimeToRecovery(avgMeanTimeToRecovery),
    meanTimeRecoveryPipelines
  );
}
