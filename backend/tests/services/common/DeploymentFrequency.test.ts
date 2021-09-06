import { expect } from "chai";
import "mocha";
import { calculateDeploymentFrequency } from "../../../src/services/common/DeploymentFrequency";
import { loadHolidayList } from "../../../src/services/common/WorkDayCalculate";
import {
  DeployInfo,
  DeployTimes,
} from "../../../src/models/pipeline/DeployTimes";
import { mock } from "../../TestTools";
import Holiday2019 from "../../fixture/Holiday-2019.json";
import Holiday2020 from "../../fixture/Holiday-2020.json";
import { Pair } from "../../../src/types/Pair";
import {
  AvgDeploymentFrequency,
  DeploymentDateCount,
  DeploymentFrequencyOfPipeline,
} from "../../../src/contract/GenerateReporter/GenerateReporterResponse";

describe("DeploymentFrequency", () => {
  const deployInfo = new DeployInfo("time", "time", "time", "commit", "passed");
  const deployTimes5 = new DeployTimes(
    "id",
    "name5",
    "step",
    new Array(5).fill(deployInfo),
    []
  );
  const expectNoDeployment: DeploymentFrequencyOfPipeline[] = [
    new DeploymentFrequencyOfPipeline("name5", "step", 0, []),
  ];
  const noAvgDeploymentFrequency = new AvgDeploymentFrequency(0);
  const deployTimes10 = new DeployTimes(
    "id",
    "name10",
    "step",
    new Array(10).fill(deployInfo),
    []
  );

  const deployInfo1 = new DeployInfo(
    "time",
    "2020-4-20",
    "2020-4-30",
    "commit",
    "passed"
  );
  const deployInfo2 = new DeployInfo(
    "time",
    "2020-4-20",
    "2020-4-28",
    "commit",
    "passed"
  );
  const deploymentDate1: DeploymentDateCount = new DeploymentDateCount(
    "4/28/2020",
    3
  );
  const deploymentDatecount: DeploymentDateCount[] = new Array(1).fill(
    deploymentDate1
  );
  const threeAvgDeploymentFrequency = new AvgDeploymentFrequency(3);
  const expectThreeDeployment: DeploymentFrequencyOfPipeline[] = [
    new DeploymentFrequencyOfPipeline("name5", "step", 3, deploymentDatecount),
  ];
  const deployTimes1 = new DeployTimes(
    "id",
    "name5",
    "step",
    new Array(3).fill(deployInfo1),
    []
  );
  const deployTimes2 = new DeployTimes(
    "id",
    "name5",
    "step",
    new Array(6).fill(deployInfo2, 0, 3).fill(deployInfo1, 3, 6),
    []
  );

  before(async function () {
    mock.onGet("2019.json").reply(200, Holiday2019);
    mock.onGet("2020.json").reply(200, Holiday2020);
    await loadHolidayList(2019);
    await loadHolidayList(2020);
  });

  it("should return deployment frequency", async () => {
    const expectFiveTimesDeployment: DeploymentFrequencyOfPipeline[] = [
      new DeploymentFrequencyOfPipeline("name5", "step", 5, []),
    ];
    const expectTowPipelineDeploymentInFiveDays: DeploymentFrequencyOfPipeline[] = [
      new DeploymentFrequencyOfPipeline("name5", "step", 1, []),
      new DeploymentFrequencyOfPipeline("name10", "step", 2, []),
    ];
    const fiveTimesAvgDeploymentFrequency = new AvgDeploymentFrequency(5);
    const expectAvgDeploymentInFiveDays = new AvgDeploymentFrequency(1.5);

    expect(
      calculateDeploymentFrequency(
        [deployTimes5],
        new Date("2020-4-7").getTime(),
        new Date("2020-4-7").getTime()
      )
    ).deep.equal(
      new Pair(expectFiveTimesDeployment, fiveTimesAvgDeploymentFrequency)
    );

    expect(
      calculateDeploymentFrequency(
        [deployTimes5, deployTimes10],
        new Date("2020-5-11").getTime(),
        new Date("2020-5-17").getTime()
      )
    ).deep.equal(
      new Pair(
        expectTowPipelineDeploymentInFiveDays,
        expectAvgDeploymentInFiveDays
      )
    );
  });

  it("should return 0 when have no deployment", async () => {
    const deployTimes0: DeployTimes[] = [];

    expect(
      calculateDeploymentFrequency(
        deployTimes0,
        new Date("2020-4-7").getTime(),
        new Date("2020-4-7").getTime()
      )
    ).deep.equal(new Pair([], noAvgDeploymentFrequency));
  });

  it("should return 0 when time period is holiday", async () => {
    expect(
      calculateDeploymentFrequency(
        [deployTimes5],
        new Date("2020-4-5").getTime(),
        new Date("2020-4-6").getTime()
      )
    ).deep.equal(new Pair(expectNoDeployment, noAvgDeploymentFrequency));
  });

  it("should return 0 when time period is out of bounds", async () => {
    expect(
      calculateDeploymentFrequency(
        [deployTimes1],
        new Date("2020-4-22").getTime(),
        new Date("2020-4-29").getTime()
      )
    ).deep.equal(new Pair(expectNoDeployment, noAvgDeploymentFrequency));
  });

  it("should return 3 when three period is out of bounds in six period", async () => {
    expect(
      calculateDeploymentFrequency(
        [deployTimes2],
        new Date("2020-4-29").getTime(),
        new Date("2020-4-29").getTime()
      )
    ).deep.equal(new Pair(expectThreeDeployment, threeAvgDeploymentFrequency));
  });
});
