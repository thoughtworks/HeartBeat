import { DeployTimes } from "../../models/pipeline/DeployTimes";
import { Pair } from "../../types/Pair";
import {
  AvgChangeFailureRate,
  ChangeFailureRate,
  ChangeFailureRateOfPipeline,
} from "../../contract/GenerateReporter/GenerateReporterResponse";

export function calculateChangeFailureRate(
  deployTimes: DeployTimes[]
): ChangeFailureRate {
  const changeFailureRateOfPipelines: ChangeFailureRateOfPipeline[] = deployTimes.map(
    (item) =>
      new ChangeFailureRateOfPipeline(
        item.pipelineName,
        item.pipelineStep,
        item.failed.length,
        item.passed.length + item.failed.length
      )
  );

  const avgChangeFailureRate: Pair<number, number> = deployTimes
    .map(
      (item) =>
        new Pair(item.failed.length, item.passed.length + item.failed.length)
    )
    .reduce(
      (prev, now) => new Pair(prev.key + now.key, prev.value + now.value)
    );

  return new ChangeFailureRate(
    new AvgChangeFailureRate(
      avgChangeFailureRate.key,
      avgChangeFailureRate.value
    ),
    changeFailureRateOfPipelines
  );
}
