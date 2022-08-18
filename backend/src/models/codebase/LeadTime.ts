import { GitHubPull } from "./GitHub/GitHubPull";
import { DeployInfo } from "../pipeline/DeployTimes";
import { CommitInfo } from "./CommitInfo";

export class LeadTime {
  commitId: string;
  prCreatedTime?: number;
  prMergedTime?: number;
  firstCommitTimeInPr?: number;
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
    prMergedTime?: number,
    firstCommitTimeInPr?: number
  ) {
    this.commitId = commitId;
    this.prCreatedTime = prCreatedTime;
    this.prMergedTime = prMergedTime;
    this.jobFinishTime = jobFinishTime;
    this.pipelineCreateTime = pipelineCreateTime;
    this.firstCommitTimeInPr = firstCommitTimeInPr;
    this.pipelineDelayTime = jobFinishTime - pipelineCreateTime;

    if (prMergedTime != undefined && prCreatedTime != undefined) {
      if (firstCommitTimeInPr != undefined) {
        this.prDelayTime = prMergedTime - firstCommitTimeInPr;
      } else {
        this.prDelayTime = prMergedTime - prCreatedTime;
      }
      this.totalTime = this.prDelayTime + this.pipelineDelayTime;
    } else {
      this.totalTime = this.pipelineDelayTime;
    }
  }

  static mapFrom(
    gitHubPull: GitHubPull,
    deployInfo: DeployInfo,
    firstCommit: CommitInfo
  ): LeadTime {
    if (gitHubPull.mergedAt == undefined) {
      throw Error("this commit has not been merged");
    }
    const prCreatedTime: number = new Date(gitHubPull.createdAt).getTime();
    const prMergedTime: number = new Date(gitHubPull.mergedAt).getTime();
    const jobFinishTime: number = new Date(deployInfo.jobFinishTime).getTime();
    const pipelineCreateTime: number = new Date(
      deployInfo.pipelineCreateTime
    ).getTime();
    let firstCommitTimeInPr;

    if (firstCommit.commit?.committer?.date != undefined) {
      firstCommitTimeInPr = new Date(
        firstCommit.commit?.committer?.date
      ).getTime();
    }

    return new LeadTime(
      deployInfo.commitId,
      pipelineCreateTime,
      jobFinishTime,
      prCreatedTime,
      prMergedTime,
      firstCommitTimeInPr
    );
  }
}

export class LeadTimeInfo {
  firstCommitTimeInPr?: string;
  prCreatedTime?: string;
  prMergedTime?: string;
  jobFinishTime?: string;
  prDelayTime?: string;
  pipelineDelayTime?: string;
  totalTime?: string;

  constructor(leadTime?: LeadTime) {
    if (leadTime != undefined) {
      if (leadTime.firstCommitTimeInPr != undefined) {
        this.firstCommitTimeInPr = LeadTimeInfo.formatDate(
          leadTime.firstCommitTimeInPr
        );
      }

      if (leadTime.prCreatedTime != undefined) {
        this.prCreatedTime = LeadTimeInfo.formatDate(leadTime.prCreatedTime);
      }

      if (leadTime.prMergedTime != undefined) {
        this.prMergedTime = LeadTimeInfo.formatDate(leadTime.prMergedTime);
      }

      this.jobFinishTime = LeadTimeInfo.formatDate(leadTime.jobFinishTime);

      this.pipelineDelayTime = LeadTimeInfo.msToHMS(leadTime.pipelineDelayTime);

      if (leadTime.prDelayTime != undefined) {
        this.prDelayTime = LeadTimeInfo.msToHMS(leadTime.prDelayTime);
      }

      this.totalTime = LeadTimeInfo.msToHMS(leadTime.totalTime);
    }
  }

  static formatDate(timeNumber: number): string {
    return new Date(timeNumber).toISOString().split(".")[0] + "Z";
  }

  static msToHMS(s: number): string {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return hrs + ":" + mins + ":" + secs;
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
