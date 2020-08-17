import { GitHubPull } from "./GitHubPull";
import { DeployInfo } from "../pipeline/DeployTimes";

export class LeadTime {
  commitId: string;
  prCreatedTime?: number;
  prMergedTime?: number;
  jobFinishTime: number;
  pipelineCreateTime: number;
  prDelayTime?: number;
  pipelineDelayTime: number;
  totalTime: number;

  constructor(
    commitId: string,
    pipelineCreateTime: number,
    jobFinishTime: number,
    prCreatedTime?: number,
    prMergedTime?: number
  ) {
    this.commitId = commitId;
    this.prCreatedTime = prCreatedTime;
    this.prMergedTime = prMergedTime;
    this.jobFinishTime = jobFinishTime;
    this.pipelineCreateTime = pipelineCreateTime;
    this.pipelineDelayTime = jobFinishTime - pipelineCreateTime;

    if (prMergedTime != undefined && prCreatedTime != undefined) {
      this.prDelayTime = prMergedTime - prCreatedTime;
      this.totalTime = this.prDelayTime + this.pipelineDelayTime;
    } else {
      this.totalTime = this.pipelineDelayTime;
    }
  }

  static mapFrom(gitHubPull: GitHubPull, deployInfo: DeployInfo): LeadTime {
    if (gitHubPull.mergedAt == undefined) {
      throw Error("this commit has not been merged");
    }
    const prCreatedTime: number = new Date(gitHubPull.createdAt).getTime();
    const prMergedTime: number = new Date(gitHubPull.mergedAt).getTime();
    const jobFinishTime: number = new Date(deployInfo.jobFinishTime).getTime();
    const pipelineCreateTime: number = new Date(
      deployInfo.pipelineCreateTime
    ).getTime();

    return new LeadTime(
      deployInfo.commitId,
      pipelineCreateTime,
      jobFinishTime,
      prCreatedTime,
      prMergedTime
    );
  }
}

export class LeadTimeInfo {
  prCreatedTime?: string;
  prMergedTime?: string;
  jobFinishTime?: string;
  prDelayTime?: string;
  pipelineDelayTime?: string;
  totalTime?: string;

  constructor(leadTime?: LeadTime) {
    if (leadTime != undefined) {
      if (leadTime.prCreatedTime != undefined) {
        this.prCreatedTime = new Date(leadTime.prCreatedTime).toLocaleString();
      }

      if (leadTime.prMergedTime != undefined) {
        this.prMergedTime = new Date(leadTime.prMergedTime).toLocaleString();
      }

      this.jobFinishTime = new Date(leadTime.jobFinishTime).toLocaleString();
      this.pipelineDelayTime = LeadTimeInfo.msToHMS(leadTime.pipelineDelayTime);

      if (leadTime.prDelayTime != undefined) {
        this.prDelayTime = LeadTimeInfo.msToHMS(leadTime.prDelayTime);
      }

      this.totalTime = LeadTimeInfo.msToHMS(leadTime.totalTime);
    }
  }

  static msToHMS(s: number): string {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return hrs + ":" + mins + ":" + secs + "." + ms;
  }
}

export class PipelineLeadTime {
  pipelineName: string;
  pipelineStep: string;
  leadTimes: LeadTime[];

  constructor(
    pipelineName: string,
    pipelineStep: string,
    leadTimes: LeadTime[]
  ) {
    this.pipelineName = pipelineName;
    this.pipelineStep = pipelineStep;
    this.leadTimes = leadTimes;
  }
}
