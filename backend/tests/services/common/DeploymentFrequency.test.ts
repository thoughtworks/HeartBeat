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
  DeploymentFrequencyOfPipeline,
} from "../../../src/contract/GenerateReporter/GenerateReporterResponse";

describe("DeploymentFrequency", () => {
  const deployInfo = new DeployInfo("time", "time", "time", "commit", "passed");
  const deployInfoOutOfTime = new DeployInfo(
    "time",
    "time",
    "2020-4-15",
    "commit",
    "passed"
  );
  const deployInfoPassedWithRealTime = new DeployInfo(
    "2020-5-11",
    "2020-5-11",
    "2020-5-11",
    "commit",
    "passed"
  );
  const deployInfoFailedWithRealTime = new DeployInfo(
    "2020-5-11",
    "2020-5-11",
    "2020-5-11",
    "commit",
    "failed"
  );
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
  const deployTimes6 = new DeployTimes(
    "id",
    "name6",
    "step",
    new Array(6).fill(deployInfo, 0, 4).fill(deployInfoOutOfTime, 5),
    []
  );
  const deployTimes3 = new DeployTimes(
    "id",
    "name3",
    "step",
    new Array(3).fill(deployInfo),
    []
  );
  const deployTimes2 = new DeployTimes(
    "id",
    "name2",
    "step",
    new Array(2).fill(deployInfo),
    []
  );
  const deployTimes8 = new DeployTimes(
    "id",
    "name8",
    "step",
    new Array(8).fill(deployInfoPassedWithRealTime),
    []
  );
  const deployTimes9 = new DeployTimes(
    "id",
    "name9",
    "step",
    [],
    new Array(9).fill(deployInfoFailedWithRealTime)
  );
  const deployTimes12 = new DeployTimes(
    "id",
    "name12",
    "step",
    new Array(6).fill(deployInfoPassedWithRealTime),
    new Array(6).fill(deployInfoFailedWithRealTime)
  );
  const deployTimes18 = new DeployTimes(
    "id",
    "name18",
    "step",
    new Array(10).fill(deployInfoPassedWithRealTime),
    new Array(8).fill(deployInfoFailedWithRealTime)
  );

  before(async function () {
    mock.onGet("2019.json").reply(200, Holiday2019);
    mock.onGet("2020.json").reply(200, Holiday2020);
    await loadHolidayList(2019);
    await loadHolidayList(2020);
  });

  describe("should return correct deployment frequency", () => {
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
    it("should return deployment frequency of two pipelines", async () => {
      const expectFiveTimesDeployment: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name5", "step", 5, []),
      ];
      const expectTwoPipelineDeploymentInFiveDays: DeploymentFrequencyOfPipeline[] = [
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
          expectTwoPipelineDeploymentInFiveDays,
          expectAvgDeploymentInFiveDays
        )
      );
    });

    it("should return correct deployment frequency when contains over three pipelines", async () => {
      const expectAvgDeploymentInOneDay = new AvgDeploymentFrequency(5);

      const expectFourPipelineDeploymentInOneDay: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name5", "step", 5, []),
        new DeploymentFrequencyOfPipeline("name10", "step", 10, []),
        new DeploymentFrequencyOfPipeline("name3", "step", 3, []),
        new DeploymentFrequencyOfPipeline("name2", "step", 2, []),
      ];

      expect(
        calculateDeploymentFrequency(
          [deployTimes5, deployTimes10, deployTimes3, deployTimes2],
          new Date("2020-5-11").getTime(),
          new Date("2020-5-11").getTime()
        )
      ).deep.equal(
        new Pair(
          expectFourPipelineDeploymentInOneDay,
          expectAvgDeploymentInOneDay
        )
      );
    });

    it("should return correct deployment frequency when some deploy date not falls into the date range", async () => {
      const expectSixTimesDeployment: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name6", "step", 5, [
          { count: 1, date: "4/15/2020" },
        ]),
      ];
      const sixTimesAvgDeploymentFrequency = new AvgDeploymentFrequency(5);

      const result = calculateDeploymentFrequency(
        [deployTimes6],
        new Date("2020-4-7").getTime(),
        new Date("2020-4-7").getTime()
      );

      expect(result).deep.equal(
        new Pair(expectSixTimesDeployment, sixTimesAvgDeploymentFrequency)
      );
    });
  });

  describe("should return correct deployment passed items", () => {
    it("should return 8 deployment passed items when 8 deployment all passed", async () => {
      const expectAvgDeploymentInOneDay = new AvgDeploymentFrequency(8);

      const expectOnePipelineDeploymentInOneDay: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name8", "step", 8, [
          { count: 8, date: "5/11/2020" },
        ]),
      ];

      expect(
        calculateDeploymentFrequency(
          [deployTimes8],
          new Date("2020-5-11").getTime(),
          new Date("2020-5-11").getTime()
        )
      ).deep.equal(
        new Pair(
          expectOnePipelineDeploymentInOneDay,
          expectAvgDeploymentInOneDay
        )
      );
    });

    it("should return 0 deployment passed items when deployment all failed", async () => {
      const expectAvgDeploymentInOneDay = new AvgDeploymentFrequency(0);

      const expectOnePipelineDeploymentInOneDay: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name9", "step", 0, []),
      ];

      expect(
        calculateDeploymentFrequency(
          [deployTimes9],
          new Date("2020-5-11").getTime(),
          new Date("2020-5-11").getTime()
        )
      ).deep.equal(
        new Pair(
          expectOnePipelineDeploymentInOneDay,
          expectAvgDeploymentInOneDay
        )
      );
    });

    it("should return 6 deployment passed items of one pipeline when 6 deployment passed and 6 deployment failed", async () => {
      const expectAvgDeploymentInOneDay = new AvgDeploymentFrequency(6);

      const expectOnePipelineDeploymentInOneDay: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name12", "step", 6, [
          { count: 6, date: "5/11/2020" },
        ]),
      ];

      expect(
        calculateDeploymentFrequency(
          [deployTimes12],
          new Date("2020-5-11").getTime(),
          new Date("2020-5-11").getTime()
        )
      ).deep.equal(
        new Pair(
          expectOnePipelineDeploymentInOneDay,
          expectAvgDeploymentInOneDay
        )
      );
    });

    it("should return 8 deployment passed items of two pipelines when one pipeline all passed and another all failed", async () => {
      const expectAvgDeploymentInOneDay = new AvgDeploymentFrequency(4);

      const expectTwoPipelineDeploymentInOneDay: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name8", "step", 8, [
          { count: 8, date: "5/11/2020" },
        ]),
        new DeploymentFrequencyOfPipeline("name9", "step", 0, []),
      ];

      expect(
        calculateDeploymentFrequency(
          [deployTimes8, deployTimes9],
          new Date("2020-5-11").getTime(),
          new Date("2020-5-11").getTime()
        )
      ).deep.equal(
        new Pair(
          expectTwoPipelineDeploymentInOneDay,
          expectAvgDeploymentInOneDay
        )
      );
    });

    it("should return 8 deployment passed items of two pipelines when both of them contain passed and failed deployment", async () => {
      const expectAvgDeploymentInOneDay = new AvgDeploymentFrequency(8);

      const expectTwoPipelineDeploymentInOneDay: DeploymentFrequencyOfPipeline[] = [
        new DeploymentFrequencyOfPipeline("name12", "step", 6, [
          { count: 6, date: "5/11/2020" },
        ]),
        new DeploymentFrequencyOfPipeline("name18", "step", 10, [
          { count: 10, date: "5/11/2020" },
        ]),
      ];

      expect(
        calculateDeploymentFrequency(
          [deployTimes12, deployTimes18],
          new Date("2020-5-11").getTime(),
          new Date("2020-5-11").getTime()
        )
      ).deep.equal(
        new Pair(
          expectTwoPipelineDeploymentInOneDay,
          expectAvgDeploymentInOneDay
        )
      );
    });
  });
});
