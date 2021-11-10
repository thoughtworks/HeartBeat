import { expect } from "chai";
import "mocha";
import {
  DeployInfo,
  DeployTimes,
} from "../../../src/models/pipeline/DeployTimes";
import { calculateMeanTimeToRecovery } from "../../../src/services/common/MeanTimeToRecovery";
import {
  AvgMeanTimeToRecovery,
  MeanTimeToRecovery,
  MeanTimeToRecoveryOfPipeline,
} from "../../../src/contract/GenerateReporter/GenerateReporterResponse";

describe("calculate mean time to recovery", () => {
  it("should return 7200000 when job is fixed after two hours", async () => {
    const passed = [
      new DeployInfo(
        "2021-11-01T08:12:38.669Z",
        "2021-11-01T08:12:38.669Z",
        "2021-11-01T08:14:09.011Z",
        "id",
        "passed"
      ),
      new DeployInfo(
        "2021-11-01T06:14:09.011Z",
        "2021-11-01T06:12:38.669Z",
        "2021-11-01T06:14:09.011Z",
        "id",
        "passed"
      ),
    ];
    const failed = [
      new DeployInfo(
        "2021-11-01T05:14:09.011Z",
        "2021-11-01T05:14:09.011Z",
        "2021-11-01T05:14:09.011Z",
        "id",
        "failed"
      ),
      new DeployInfo(
        "2021-11-01T04:14:09.011Z",
        "2021-11-01T04:14:09.011Z",
        "2021-11-01T04:14:09.011Z",
        "id",
        "failed"
      ),
    ];

    const deployTimes = new Array(2).fill(
      new DeployTimes("id", "name", "step", passed, failed)
    );

    const meanTimeToRecovery = calculateMeanTimeToRecovery(deployTimes);

    const expectedAvgMeanTimeToRecovery = new AvgMeanTimeToRecovery(7200000);

    expect(meanTimeToRecovery).deep.equal(
      new MeanTimeToRecovery(
        expectedAvgMeanTimeToRecovery,
        new Array(2).fill(
          new MeanTimeToRecoveryOfPipeline("name", "step", 7200000)
        )
      )
    );
  });
});
