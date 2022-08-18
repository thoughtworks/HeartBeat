import { JsonObject, JsonProperty } from "json2typescript";
import { PipelineInfo } from "../../../contract/pipeline/PipelineInfo";

@JsonObject("BKStepInfo")
export class BKStepInfo {
  @JsonProperty("name", String, true)
  name: string = "";
}

@JsonObject("BKPipelineInfo")
export class BKPipelineInfo {
  @JsonProperty("name", String, true)
  name: string = "";
  @JsonProperty("slug", String, true)
  slug: string = "";
  @JsonProperty("steps", [BKStepInfo], true)
  steps: BKStepInfo[] = [];
  @JsonProperty("repository", String, true)
  repository: string = "";

  public mapToDeployInfo(
    orgId: string,
    orgName: string,
    bkEffectiveSteps: string[]
  ): PipelineInfo {
    const stepNames = this.steps
      .filter((step) => step.name.length != 0)
      .map((step) => step.name);
    stepNames.push(...bkEffectiveSteps);
    return new PipelineInfo(
      this.slug,
      this.name,
      bkEffectiveSteps,
      this.repository,
      orgId,
      orgName
    );
  }
}
