import { expect } from "chai";
import { PlatformTypeError } from "../../../src/errors/PlatformTypeError";
import { BuildkiteGetSteps } from "../../../src/services/pipeline/Buildkite/BuildkiteGetSteps";
import { PipelineGetStepsFactory } from "../../../src/services/pipeline/PipelineGetSteps";

describe("get instance", () => {
  it("should create buildkite get steps when given type is buildkite", async () => {
    const buildkiteGetSteps = PipelineGetStepsFactory.getInstance(
      "BUILDKITE",
      "test"
    );
    expect(buildkiteGetSteps.fetchPipelineInfo).to.equal(
      new BuildkiteGetSteps("test").fetchPipelineInfo
    );
  });

  it("should throw platform error when given type is not buildkite", async () => {
    try {
      PipelineGetStepsFactory.getInstance("test", "test");
    } catch (error) {
      if (error instanceof PlatformTypeError) {
        expect(error.message).to.equal("unsupported type: test.");
      }
    }
  });
});
