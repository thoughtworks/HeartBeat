import { expect } from "chai";
import "mocha";
import {
  DeployInfo,
  DeployTimes,
} from "../../../src/models/pipeline/DeployTimes";
import { calculateChangeFailureRate } from "../../../src/services/common/ChangeFailureRate";
import {
  AvgChangeFailureRate,
  ChangeFailureRate,
  ChangeFailureRateOfPipeline,
} from "../../../src/contract/GenerateReporter/GenerateReporterResponse";

describe("calculate change failure rate", () => {
  it("should return 0.5 when have a half deploy is failed", async () => {
    const passed = new Array(10).fill(
      new DeployInfo("time", "time", "time", "id", "passed")
    );
    const failed = new Array(10).fill(
      new DeployInfo("time", "time", "time", "id", "passed")
    );

    const deployTimes = new Array(2).fill(
      new DeployTimes("id", "name", "step", passed, failed)
    );

    const failureRate = calculateChangeFailureRate(deployTimes);

    const expectedAvgChangeFailureRate = new AvgChangeFailureRate(20, 40);

    expect(failureRate).deep.equal(
      new ChangeFailureRate(
        expectedAvgChangeFailureRate,
        new Array(2).fill(
          new ChangeFailureRateOfPipeline("name", "step", 10, 20)
        )
      )
    );
  });
});
