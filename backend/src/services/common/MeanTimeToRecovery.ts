import { DeployTimes } from "../../models/pipeline/DeployTimes";
import {
  AvgMeanTimeToRecovery,
  MeanTimeToRecovery,
  MeanTimeToRecoveryOfPipeline,
} from "../../contract/GenerateReporter/GenerateReporterResponse";
import sortBy from "lodash/sortBy";

function getTotalRecoveryTimeAndRecoveryTimes(
  item: DeployTimes
): { totalTimeToRecovery: number; recoveryTimes: number } {
  const sortedJobs = sortBy([...item.failed, ...item.passed], (deployInfo) => {
    return deployInfo.pipelineCreateTime;
  });

  let totalTimeToRecovery = 0,
    failedJobCreateTime = 0,
    recoveryTimes = 0;

  sortedJobs.forEach((job) => {
    if (job.state === "passed" && failedJobCreateTime) {
      totalTimeToRecovery +=
        new Date(job.pipelineCreateTime).getTime() - failedJobCreateTime;
      failedJobCreateTime = 0;
      recoveryTimes += 1;
    }
    if (job.state === "failed" && failedJobCreateTime === 0) {
      failedJobCreateTime = new Date(job.pipelineCreateTime).getTime();
    }
  });
  return { totalTimeToRecovery, recoveryTimes };
}

export function calculateMeanTimeToRecovery(
  deployTimes: DeployTimes[]
): MeanTimeToRecovery {
  const meanTimeRecoveryPipelines: MeanTimeToRecoveryOfPipeline[] = deployTimes.map(
    (item) => {
      if (item.failed.length === 0) {
        return new MeanTimeToRecoveryOfPipeline(
          item.pipelineName,
          item.pipelineStep,
          0
        );
      }
      const {
        totalTimeToRecovery,
        recoveryTimes,
      } = getTotalRecoveryTimeAndRecoveryTimes(item);
      return new MeanTimeToRecoveryOfPipeline(
        item.pipelineName,
        item.pipelineStep,
        totalTimeToRecovery / recoveryTimes
      );
    }
  );

  const avgMeanTimeToRecovery: number =
    meanTimeRecoveryPipelines.length === 0
      ? 0
      : meanTimeRecoveryPipelines.reduce(
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
