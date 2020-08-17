import { PipelineInfo } from "../../contract/pipeline/PipelineInfo";
import { PlatformTypeError } from "../../types/PlatformTypeError";
import { PipelineType } from "./Pipeline";
import { PipelineGetStepsRequest } from "../../contract/pipeline/PipelineGetStepsRequest";
import { BuildkiteGetSteps } from "./Buildkite/BuildkiteGetSteps";

export interface PipelineGetSteps {
  fetchPipelineInfo(
    pipelineGetStepsRequest: PipelineGetStepsRequest
  ): Promise<PipelineInfo>;
}

export class PipelineGetStepsFactory {
  static getInstance(type: string, token: string): PipelineGetSteps {
    switch (type.toLowerCase()) {
      case PipelineType.BUILDKITE:
        return new BuildkiteGetSteps(token);
      default:
        throw new PlatformTypeError(type);
    }
  }
}
