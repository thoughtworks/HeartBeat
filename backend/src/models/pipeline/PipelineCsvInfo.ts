import { BuildInfo } from "./BuildInfo";
import { DeployInfo } from "./DeployTimes";
import { CommitInfo } from "../codebase/CommitInfo";
import { LeadTimeInfo } from "../codebase/LeadTime";

export class PipelineCsvInfo {
  pipeLineName: string;
  stepName: string;
  buildInfo?: BuildInfo;
  deployInfo?: DeployInfo;
  commitInfo?: CommitInfo;
  leadTimeInfo?: LeadTimeInfo;

  constructor(
    pipeLineName: string,
    stepName: string,
    buildInfo: BuildInfo,
    deployInfo: DeployInfo,
    commitInfo: CommitInfo,
    leadTimeInfo: LeadTimeInfo
  ) {
    this.pipeLineName = pipeLineName;
    this.stepName = stepName;
    this.buildInfo = buildInfo;
    this.deployInfo = deployInfo;
    this.commitInfo = commitInfo;
    this.leadTimeInfo = leadTimeInfo;
  }
}
