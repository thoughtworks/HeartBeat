import { expect } from "chai";
import { PlatformTypeError } from "../../../src/errors/PlatformTypeError";
import { Buildkite } from "../../../src/services/pipeline/Buildkite/Buildkite";
import { PipelineFactory } from "../../../src/services/pipeline/Pipeline";

describe("get instance", () => {
  it("should create buildkite get steps when given type is buildkite", async () => {
    const buildkite = PipelineFactory.getInstance("BUILDKITE", "test");
    expect(buildkite.fetchPipelineInfo).to.equal(
      new Buildkite("test").fetchPipelineInfo
    );
  });

  it("should throw platform error when given type is not buildkite", async () => {
    try {
      PipelineFactory.getInstance("test", "test");
    } catch (error) {
      if (error instanceof PlatformTypeError) {
        expect(error.message).to.equal("unsupported type: test.");
      }
    }
  });
});
