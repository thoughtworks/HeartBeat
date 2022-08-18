/* eslint-disable @typescript-eslint/camelcase */
import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";

@swaggerClass()
export class CycleTimeOptionalItem {
  @swaggerProperty({ type: "string", required: true, example: "Development" })
  optionalItemName?: string = undefined;
  @swaggerProperty({ type: "string", required: true, example: "1.2 (days/SP)" })
  averageTimeForSP?: string = undefined;
  @swaggerProperty({
    type: "string",
    required: true,
    example: "1.2 (days/card)",
  })
  averageTimeForCards?: string = undefined;
  @swaggerProperty({ type: "string", required: true, example: "50 (days)" })
  totalTime?: string = undefined;

  constructor(cycleTimeOptionalItem?: CycleTimeOptionalItem) {
    Object.assign(this, cycleTimeOptionalItem);
  }
}

@swaggerClass()
export class ClassificationNameValuePair {
  @swaggerProperty({
    type: "string",
    example: "Planned Feature",
  })
  name: string = "Planned Feature";
  @swaggerProperty({
    type: "string",
    example: "Planned Feature",
  })
  value: string = "50%";
}

@swaggerClass()
export class ClassificationField {
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (ClassificationNameValuePair as any).swaggerDocument,
    },
  })
  pairs: ClassificationNameValuePair[] = [];
  @swaggerProperty({
    type: "string",
    example: "Reporter",
  })
  fieldName: string = "Reporter";
}

@swaggerClass()
export class CycleTime {
  @swaggerProperty({
    type: "string",
    required: true,
    example: "3.2 (days/card)",
  })
  averageCircleTimePerCard?: string = undefined;
  @swaggerProperty({
    type: "string",
    required: true,
    example: "2.8 (days/SP)",
  })
  averageCycleTimePerSP?: string = undefined;
  @swaggerProperty({
    type: "number",
    required: true,
    example: "27",
  })
  totalTimeForCards?: number = undefined;
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (CycleTimeOptionalItem as any).swaggerDocument,
      example: new CycleTimeOptionalItem(),
    },
    example: [new CycleTimeOptionalItem()],
  })
  swimlaneList?: CycleTimeOptionalItem[] = undefined;

  constructor(
    totalTime: number,
    averageCircleTimePerCard: string,
    averageCycleTimePerSP: string,
    swimlaneList: CycleTimeOptionalItem[]
  ) {
    this.totalTimeForCards = totalTime;
    this.averageCircleTimePerCard = averageCircleTimePerCard;
    this.averageCycleTimePerSP = averageCycleTimePerSP;
    this.swimlaneList = swimlaneList;
  }
}

@swaggerClass()
export class AvgDeploymentFrequency {
  @swaggerProperty({
    type: "string",
    example: "Average",
  })
  name?: string = "Average";

  @swaggerProperty({
    type: "string",
    example: "0.75",
  })
  deploymentFrequency?: string = undefined;

  constructor(deploymentFrequency: number) {
    this.deploymentFrequency = `${deploymentFrequency.toFixed(2)}`;
  }
}

@swaggerClass()
export class DeploymentDateCount {
  @swaggerProperty({
    type: "string",
    example: "2020-07-30",
  })
  date?: string = undefined;

  @swaggerProperty({
    type: "number",
    example: 1,
  })
  count?: number = undefined;

  constructor(date: string, count: number) {
    this.date = date;
    this.count = count;
  }
}

@swaggerClass()
export class DeploymentFrequencyOfPipeline {
  @swaggerProperty({
    type: "string",
    example: "pipeline-name",
  })
  name?: string = undefined;

  @swaggerProperty({
    type: "string",
    example: "pipeline-step",
  })
  step?: string = undefined;

  @swaggerProperty({
    type: "string",
    example: "0.75",
  })
  deploymentFrequency?: string = undefined;

  @swaggerProperty({
    type: "array",
    items: {
      type: "object",
      properties: (DeploymentDateCount as any).swaggerDocument,
    },
  })
  items?: DeploymentDateCount[] = undefined;

  constructor(
    name: string,
    step: string,
    deploymentFrequency: number,
    items: DeploymentDateCount[]
  ) {
    this.name = name;
    this.step = step;
    this.deploymentFrequency = `${deploymentFrequency.toFixed(2)}`;
    this.items = items;
  }
}

@swaggerClass()
export class DeploymentFrequency {
  @swaggerProperty({
    type: "object",
    properties: (AvgDeploymentFrequency as any).swaggerDocument,
  })
  avgDeploymentFrequency?: AvgDeploymentFrequency = undefined;

  @swaggerProperty({
    type: "array",
    items: {
      type: "object",
      properties: (DeploymentFrequencyOfPipeline as any).swaggerDocument,
    },
  })
  deploymentFrequencyOfPipelines?: DeploymentFrequencyOfPipeline[] = undefined;

  constructor(
    avgDeploymentFrequency: AvgDeploymentFrequency,
    deploymentFrequencyOfPipelines: DeploymentFrequencyOfPipeline[]
  ) {
    this.avgDeploymentFrequency = avgDeploymentFrequency;
    this.deploymentFrequencyOfPipelines = deploymentFrequencyOfPipelines;
  }
}

@swaggerClass()
export class AvgChangeFailureRate {
  @swaggerProperty({
    type: "string",
    example: "average",
  })
  name: string = "Average";

  @swaggerProperty({
    type: "string",
    example: "10%",
  })
  failureRate: string;

  constructor(failureTimes: number, totalTimes: number) {
    if (totalTimes == 0) {
      this.failureRate = "there are no deploy in this time period";
      return;
    }
    const changeFailureRate = failureTimes / totalTimes;
    this.failureRate = `${(changeFailureRate * 100).toFixed(
      2
    )}% (${failureTimes}/${totalTimes})`;
  }
}

@swaggerClass()
export class ChangeFailureRateOfPipeline {
  @swaggerProperty({
    type: "string",
    example: "pipeline-name",
  })
  name: string;

  @swaggerProperty({
    type: "string",
    example: "pipeline-step",
  })
  step: string;

  @swaggerProperty({
    type: "string",
    example: "10%",
  })
  failureRate: string;

  constructor(
    name: string,
    step: string,
    failureTimes: number,
    totalTimes: number
  ) {
    this.name = name;
    this.step = step;
    if (totalTimes == 0) {
      this.failureRate = "there are no deploy in this time period";
      return;
    }
    const changeFailureRate = failureTimes / totalTimes;
    this.failureRate = `${(changeFailureRate * 100).toFixed(
      2
    )}% (${failureTimes}/${totalTimes})`;
  }
}

@swaggerClass()
export class ChangeFailureRate {
  @swaggerProperty({
    type: "object",
    properties: (AvgChangeFailureRate as any).swaggerDocument,
  })
  avgChangeFailureRate?: AvgChangeFailureRate = undefined;

  @swaggerProperty({
    type: "array",
    items: {
      type: "object",
      properties: (ChangeFailureRateOfPipeline as any).swaggerDocument,
    },
  })
  changeFailureRateOfPipelines?: ChangeFailureRateOfPipeline[] = undefined;

  constructor(
    avgChangeFailureRate: AvgChangeFailureRate,
    changeFailureRateOfPipelines: ChangeFailureRateOfPipeline[]
  ) {
    this.avgChangeFailureRate = avgChangeFailureRate;
    this.changeFailureRateOfPipelines = changeFailureRateOfPipelines;
  }
}

@swaggerClass()
export class MeanTimeToRecoveryOfPipeline {
  @swaggerProperty({
    type: "string",
    example: "pipeline-name",
  })
  name?: string = undefined;

  @swaggerProperty({
    type: "string",
    example: "pipeline-step",
  })
  step?: string = undefined;

  @swaggerProperty({
    type: "number",
    example: 360000,
  })
  timeToRecovery: number;

  constructor(name: string, step: string, timeToRecovery: number) {
    this.name = name;
    this.step = step;
    this.timeToRecovery = timeToRecovery;
  }
}

@swaggerClass()
export class AvgMeanTimeToRecovery {
  @swaggerProperty({
    type: "string",
    example: "average",
  })
  name: string = "Average";

  @swaggerProperty({
    type: "number",
    example: 360000,
  })
  timeToRecovery: number;

  constructor(timeToRecovery: number) {
    this.timeToRecovery = timeToRecovery;
  }
}

@swaggerClass()
export class MeanTimeToRecovery {
  @swaggerProperty({
    type: "object",
    properties: (AvgMeanTimeToRecovery as any).swaggerDocument,
  })
  avgMeanTimeToRecovery?: AvgMeanTimeToRecovery = undefined;

  @swaggerProperty({
    type: "array",
    items: {
      type: "object",
      properties: (MeanTimeToRecoveryOfPipeline as any).swaggerDocument,
    },
  })
  meanTimeRecoveryPipelines?: MeanTimeToRecoveryOfPipeline[] = undefined;

  constructor(
    avgMeanTimeToRecovery: AvgMeanTimeToRecovery,
    changeFailureRateOfPipelines: MeanTimeToRecoveryOfPipeline[]
  ) {
    this.avgMeanTimeToRecovery = avgMeanTimeToRecovery;
    this.meanTimeRecoveryPipelines = changeFailureRateOfPipelines;
  }
}

@swaggerClass()
export class LeadTimeForChangesOfPipeline {
  @swaggerProperty({
    type: "string",
    example: "dora",
  })
  name: string;
  @swaggerProperty({
    type: "string",
    example: "step",
  })
  step: string;
  @swaggerProperty({
    type: "number",
    example: "32 (min)",
  })
  mergeDelayTime: number;
  @swaggerProperty({
    type: "number",
    example: "40 (min)",
  })
  pipelineDelayTime: number;
  @swaggerProperty({
    type: "number",
    example: "72 (min)",
  })
  totalDelayTime: number;

  constructor(
    name: string,
    step: string,
    mergeDelayTime: number,
    pipelineDelayTime: number
  ) {
    this.name = name;
    this.step = step;
    this.mergeDelayTime = Number((mergeDelayTime / 1000 / 60).toFixed(2));
    this.pipelineDelayTime = Number((pipelineDelayTime / 1000 / 60).toFixed(2));
    this.totalDelayTime = Number(
      ((mergeDelayTime + pipelineDelayTime) / 1000 / 60).toFixed(2)
    );
  }
}

@swaggerClass()
export class AvgLeadTimeForChanges {
  @swaggerProperty({
    type: "string",
    example: "Average",
  })
  name: string = "Average";
  @swaggerProperty({
    type: "number",
    example: "32 (min)",
  })
  mergeDelayTime: number;
  @swaggerProperty({
    type: "number",
    example: "40 (min)",
  })
  pipelineDelayTime: number;
  @swaggerProperty({
    type: "number",
    example: "72 (min)",
  })
  totalDelayTime: number;

  constructor(mergeDelayTime: number, pipelineDelayTime: number) {
    this.mergeDelayTime = Number((mergeDelayTime / 1000 / 60).toFixed(2));
    this.pipelineDelayTime = Number((pipelineDelayTime / 1000 / 60).toFixed(2));
    this.totalDelayTime = Number(
      ((mergeDelayTime + pipelineDelayTime) / 1000 / 60).toFixed(2)
    );
  }
}

@swaggerClass()
export class LeadTimeForChanges {
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (LeadTimeForChangesOfPipeline as any).swaggerDocument,
    },
  })
  leadTimeForChangesOfPipelines?: LeadTimeForChangesOfPipeline[] = [];
  @swaggerProperty({
    type: "object",
    properties: (AvgLeadTimeForChanges as any).swaggerDocument,
  })
  avgLeadTimeForChanges?: AvgLeadTimeForChanges;

  constructor(
    leadTimeForChangesOfPipelines: LeadTimeForChangesOfPipeline[],
    avgLeadTimeForChanges: AvgLeadTimeForChanges
  ) {
    this.leadTimeForChangesOfPipelines = leadTimeForChangesOfPipelines;
    this.avgLeadTimeForChanges = avgLeadTimeForChanges;
  }
}

@swaggerClass()
export class Velocity {
  @swaggerProperty({ type: "string", required: true, example: "24 (SP)" })
  velocityForSP?: string = undefined;
  @swaggerProperty({ type: "string", required: true, example: "15" })
  velocityForCards?: string = undefined;
  @swaggerProperty({ type: "string", required: true, example: "70%" })
  percentageOfPlannedFeature?: string = undefined;
  @swaggerProperty({
    type: "string",
    required: true,
    example: "20%",
  })
  percentageOfPlannedOperation?: string = undefined;
  @swaggerProperty({
    type: "string",
    required: true,
    example: "10%",
  })
  percentageOfUnplannedOperation?: string = undefined;
}

@swaggerClass()
export class CompleteCardsNumber {
  @swaggerProperty({
    type: "string",
    required: true,
  })
  sprintName?: string;
  @swaggerProperty({
    type: "number",
    required: true,
  })
  value?: number;
}

@swaggerClass()
export class StandardDeviationAveragePair {
  @swaggerProperty({
    type: "number",
    required: true,
  })
  standardDeviation?: number;
  @swaggerProperty({
    type: "number",
    required: true,
  })
  average?: number;
}

@swaggerClass()
export class StandardDeviation {
  @swaggerProperty({
    type: "string",
    required: true,
  })
  sprintName?: string;
  @swaggerProperty({
    type: "object",
    required: true,
    properties: (StandardDeviationAveragePair as any).swaggerDocument,
  })
  value?: StandardDeviationAveragePair;
}

@swaggerClass()
export class BlockedDevelopingPair {
  @swaggerProperty({
    type: "number",
    required: true,
  })
  blockedPercentage?: number;
  @swaggerProperty({
    type: "number",
    required: true,
  })
  developingPercentage?: number;
}

@swaggerClass()
export class BlockedAndDevelopingPercentage {
  @swaggerProperty({
    type: "string",
    required: true,
  })
  sprintName?: string;
  @swaggerProperty({
    type: "object",
    required: true,
    properties: (BlockedDevelopingPair as any).swaggerDocument,
  })
  value?: BlockedDevelopingPair;
}

@swaggerClass()
export class BlockReasonPercentage {
  @swaggerProperty({
    type: "string",
    required: true,
  })
  reasonName?: string;
  @swaggerProperty({
    type: "number",
    required: true,
  })
  percentage?: number;
  @swaggerProperty({
    type: "number",
    required: true,
  })
  time?: number;
}

@swaggerClass()
export class LatestSprintBlockReason {
  @swaggerProperty({
    type: "number",
    required: true,
  })
  totalBlockedPercentage?: number;
  @swaggerProperty({
    type: "object",
    required: true,
    properties: (BlockReasonPercentage as any).swaggerDocument,
  })
  blockReasonPercentage?: BlockReasonPercentage[];
}

@swaggerClass()
export class GenerateReporterResponse {
  @swaggerProperty({
    type: "object",
    description: "velocity",
    properties: (Velocity as any).swaggerDocument,
    example: new Velocity(),
  })
  velocity?: Velocity = undefined;
  @swaggerProperty({
    type: "object",
    description: "cycleTime",
    properties: (CycleTime as any).swaggerDocument,
    example: {
      averageCircleTimePerCard: "3.2 (days/card)",
      averageCycleTimePerSP: "2.8 (days/SP)",
      swimlaneList: [],
    },
  })
  cycleTime?: CycleTime = undefined;
  @swaggerProperty({
    type: "object",
    description: "deploymentFrequency",
    properties: (DeploymentFrequency as any).swaggerDocument,
    example: {
      deploymentFrequency: {
        avgDeploymentFrequency: "0.75 (days/deployment)",
        deploymentFrequencyOfPipelines: [
          {
            deploymentFrequency: "0.10",
            items: [{ date: "7/2/2020", count: 1 }],
            name: "name",
            step: "step",
          },
        ],
      },
    },
  })
  deploymentFrequency?: DeploymentFrequency = undefined;
  @swaggerProperty({
    type: "object",
    description: "leadTimeForChanges",
    properties: (LeadTimeForChanges as any).swaggerDocument,
  })
  leadTimeForChanges?: LeadTimeForChanges = undefined;
  @swaggerProperty({
    type: "object",
    description: "change failure rate",
    properties: (ChangeFailureRate as any).swaggerDocument,
    example: {
      changeFailureRate: {
        failureRate: "10%",
      },
    },
  })
  changeFailureRate?: ChangeFailureRate = undefined;
  @swaggerProperty({
    type: "object",
    description: "mean time to recovery",
    properties: (MeanTimeToRecovery as any).swaggerDocument,
    example: {
      meanTimeToRecovery: {
        timeToRecovery: 10000,
      },
    },
  })
  meanTimeToRecovery?: MeanTimeToRecovery = undefined;
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (ClassificationField as any).swaggerDocument,
    },
  })
  classification?: ClassificationField[] = undefined;
  @swaggerProperty({
    type: "object",
    description: "completed cards number",
    properties: (CompleteCardsNumber as any).swaggerDocument,
  })
  completedCardsNumber?: CompleteCardsNumber[];
  @swaggerProperty({
    type: "object",
    description: "standard deviation and average",
    properties: (StandardDeviation as any).swaggerDocument,
  })
  standardDeviation?: StandardDeviation[];
  @swaggerProperty({
    type: "object",
    description: "blocked and developing percentage",
    properties: (BlockedAndDevelopingPercentage as any).swaggerDocument,
  })
  blockedAndDevelopingPercentage?: BlockedAndDevelopingPercentage[];
  @swaggerProperty({
    type: "object",
    description: "latest sprint block reason",
    properties: (LatestSprintBlockReason as any).swaggerDocument,
  })
  latestSprintBlockReason?: LatestSprintBlockReason;
}
