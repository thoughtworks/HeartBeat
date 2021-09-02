import { calculateWorkDaysBetween } from "./WorkDayCalculate";
import { DeployTimes, DeployInfo } from "../../models/pipeline/DeployTimes";
import { Pair } from "../../types/Pair";
import {
  AvgDeploymentFrequency,
  DeploymentFrequencyOfPipeline,
  DeploymentDateCount,
} from "../../contract/GenerateReporter/GenerateReporterResponse";

export class DeploymentFrequencyModel {
  name: string;
  step: string;
  value: number;
  passed: DeployInfo[];

  constructor(name: string, step: string, value: number, passed: DeployInfo[]) {
    this.name = name;
    this.step = step;
    this.value = value;
    this.passed = passed;
  }
}

function mapDeploymentPassedItems(
  deployTimes: DeployInfo[]
): DeploymentDateCount[] {
  if (!deployTimes || deployTimes.length == 0) {
    return [];
  }

  const result: DeploymentDateCount[] = [];

  deployTimes.forEach((value) => {
    if (!value.jobFinishTime) return;

    if (isNaN(Date.parse(value.jobFinishTime))) return;

    const localeDate = new Date(value.jobFinishTime).toLocaleDateString();
    const existingDateItem = result.find((x) => x.date === localeDate);

    if (!existingDateItem) {
      const item = new DeploymentDateCount(localeDate, 1);
      result.push(item);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      existingDateItem!.count! += 1;
    }
  });

  return result;
}

// TODO：校验部署时间是否在startTime和endTime内
export function calculateDeploymentFrequency(
  deployTimes: DeployTimes[],
  startTime: number,
  endTime: number
): Pair<DeploymentFrequencyOfPipeline[], AvgDeploymentFrequency> {
  const timePeriod = calculateWorkDaysBetween(startTime, endTime);
  const deployFrequencyOfEachPipeline: DeploymentFrequencyModel[] = deployTimes.map(
    (item) => {
      const itemPassed: DeployInfo[] = item.passed.filter(
        (deployInfoItem) =>
          new Date(deployInfoItem.jobFinishTime).getTime <=
            new Date(endTime).getTime || deployInfoItem.jobFinishTime == "time"
      );
      const passedDeployTimes = itemPassed.length;
      if (passedDeployTimes == 0 || timePeriod == 0) {
        return new DeploymentFrequencyModel(
          item.pipelineName,
          item.pipelineStep,
          0,
          []
        );
      }
      return new DeploymentFrequencyModel(
        item.pipelineName,
        item.pipelineStep,
        passedDeployTimes / timePeriod,
        itemPassed
      );
    }
  );

  const deployFrequency = deployFrequencyOfEachPipeline.reduce(
    (prev, now) => prev + now.value,
    0
  );

  const deploymentFrequencyOfPipelines: DeploymentFrequencyOfPipeline[] = deployFrequencyOfEachPipeline.map(
    (item) =>
      new DeploymentFrequencyOfPipeline(
        item.name,
        item.step,
        item.value,
        mapDeploymentPassedItems(item.passed)
      )
  );

  const pipelineCount = deploymentFrequencyOfPipelines.length;

  const avgDeployFrequency: number =
    pipelineCount === 0 ? 0 : deployFrequency / pipelineCount;

  const avgDeploymentFrequency: AvgDeploymentFrequency = new AvgDeploymentFrequency(
    avgDeployFrequency
  );

  return new Pair<DeploymentFrequencyOfPipeline[], AvgDeploymentFrequency>(
    deploymentFrequencyOfPipelines,
    avgDeploymentFrequency
  );
}
