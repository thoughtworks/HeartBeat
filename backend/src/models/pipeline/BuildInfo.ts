import { DeployInfo } from "./DeployTimes";
import { BKBuildInfo } from "./Buildkite/BKBuildInfo";

export class JobInfo {
  name?: string = undefined;
  state: string = "";
  startedAt?: string = undefined;
  finishedAt?: string = undefined;
}

export class BuildInfo {
  jobs: JobInfo[] = [];
  commit: string = "";
  pipelineCreateTime?: string = undefined;
  number: number;

  constructor(buildInfo: BKBuildInfo) {
    this.jobs = buildInfo.jobs;
    this.commit = buildInfo.commit;
    this.pipelineCreateTime = buildInfo.pipelineCreateTime;
    this.number = buildInfo.number;
  }

  public mapToDeployInfo(step: string, ...states: string[]): DeployInfo {
    const job = this.jobs?.find(
      (job) => job.name == step && states.includes(job.state)
    );

    if (
      this.pipelineCreateTime == undefined ||
      job == undefined ||
      job.startedAt == undefined ||
      job.finishedAt == undefined
    ) {
      return new DeployInfo("", "", "", "", "");
    }

    return new DeployInfo(
      this.pipelineCreateTime,
      job.startedAt,
      job.finishedAt,
      this.commit,
      job.state
    );
  }
}
