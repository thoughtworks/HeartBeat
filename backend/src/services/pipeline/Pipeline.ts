import { PipelineInfo } from "../../contract/pipeline/PipelineInfo";
import { DeployTimes } from "../../models/pipeline/DeployTimes";
import { Buildkite } from "./Buildkite/Buildkite";
import { BuildInfo } from "../../models/pipeline/BuildInfo";
import { DeploymentEnvironment } from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import { PlatformTypeError } from "../../errors/PlatformTypeError";

export interface Pipeline {
  fetchPipelineInfo(
    startTime: number,
    endTime: number
  ): Promise<PipelineInfo[]>;

  verifyToken(): Promise<boolean>;

  countDeployTimes(
    deploymentEnvironment: DeploymentEnvironment,
    buildInfos: BuildInfo[]
  ): Promise<DeployTimes>;

  fetchPipelineBuilds(
    deploymentEnvironment: DeploymentEnvironment,
    startTime: Date,
    endTime: Date
  ): Promise<BuildInfo[]>;
}

export enum PipelineType {
  BUILDKITE = "buildkite",
}

export class PipelineFactory {
  static getInstance(type: string, token: string): Pipeline {
    switch (type.toLowerCase()) {
      case PipelineType.BUILDKITE:
        return new Buildkite(token);
      default:
        throw new PlatformTypeError(type);
    }
  }
}
