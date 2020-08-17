export class DeployInfo {
  pipelineCreateTime: string;
  jobStartTime: string;
  jobFinishTime: string;
  commitId: string;
  state: string;

  constructor(
    pipelineCreateTime: string,
    jobStartTime: string,
    jobFinishTime: string,
    commitId: string,
    state: string
  ) {
    this.pipelineCreateTime = pipelineCreateTime;
    this.jobStartTime = jobStartTime;
    this.jobFinishTime = jobFinishTime;
    this.commitId = commitId;
    this.state = state;
  }
}

export class DeployTimes {
  pipelineId: string;
  pipelineName: string;
  pipelineStep: string;
  passed: DeployInfo[];
  failed: DeployInfo[];

  constructor(
    pipelineId: string,
    pipelineName: string,
    pipelineStep: string,
    passed: DeployInfo[],
    failed: DeployInfo[]
  ) {
    this.pipelineId = pipelineId;
    this.pipelineName = pipelineName;
    this.pipelineStep = pipelineStep;
    this.passed = passed;
    this.failed = failed;
  }
}
