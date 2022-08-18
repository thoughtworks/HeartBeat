import "mocha";
import { expect } from "chai";
import { GenerateReportService } from "../../../src/services/GenerateReporter/GenerateReportService";
import fs from "fs";
import { JiraBlockReasonEnum } from "../../../src/models/kanban/JiraBlockReasonEnum";
import { SprintStatistics } from "../../../src/models/kanban/SprintStatistics";
const sprint1Name = "test Sprint 1";
const sprint2Name = "test Sprint 2";
const sprint3Name = "test Sprint 3";
const sprintStatistics = new SprintStatistics(
  [
    { sprintName: sprint1Name, value: 3 },
    { sprintName: sprint2Name, value: 2 },
    { sprintName: sprint3Name, value: 2 },
  ],
  [
    {
      sprintName: sprint1Name,
      value: { standardDeviation: 1.91, average: 4.53 },
    },
    {
      sprintName: sprint2Name,
      value: { standardDeviation: 1.5, average: 3.5 },
    },
    {
      sprintName: sprint3Name,
      value: { standardDeviation: 0, average: 2 },
    },
  ],
  [
    {
      sprintName: sprint1Name,
      value: { blockedPercentage: 0.22, developingPercentage: 0.78 },
    },
    {
      sprintName: sprint2Name,
      value: {
        blockedPercentage: 0.29,
        developingPercentage: 0.71,
      },
    },
    {
      sprintName: sprint3Name,
      value: {
        blockedPercentage: 0.5,
        developingPercentage: 0.5,
      },
    },
  ],
  [
    {
      sprintName: sprint1Name,
      totalBlockedPercentage: 0.22,
      blockDetails: [
        {
          reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
          percentage: 0.05,
          time: 0,
        },
        {
          reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
          percentage: 0.15,
          time: 0,
        },
        {
          reasonName: JiraBlockReasonEnum.OTHERS,
          percentage: 0.02,
          time: 0,
        },
      ],
    },
    {
      sprintName: sprint2Name,
      totalBlockedPercentage: 0.29,
      blockDetails: [
        {
          reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
          percentage: 0.09,
          time: 0,
        },
        {
          reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
          percentage: 0.15,
          time: 0,
        },
        {
          reasonName: JiraBlockReasonEnum.OTHERS,
          percentage: 0.05,
          time: 0,
        },
      ],
    },
    {
      sprintName: sprint3Name,
      totalBlockedPercentage: 0.5,
      blockDetails: [
        {
          reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
          percentage: 0.35,
          time: 0,
        },
        {
          reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
          percentage: 0.1,
          time: 0,
        },
        {
          reasonName: JiraBlockReasonEnum.OTHERS,
          percentage: 0.05,
          time: 0,
        },
      ],
    },
  ],
  [
    {
      sprintName: sprint1Name,
      cycleTime: 1,
      blockedTime: 1,
    },
    {
      sprintName: sprint2Name,
      cycleTime: 2,
      blockedTime: 2,
    },
    {
      sprintName: sprint3Name,
      cycleTime: 3,
      blockedTime: 3,
    },
  ]
);
describe("generate excel file", () => {
  const reportService = new GenerateReportService();
  const reportServiceProto = Object.getPrototypeOf(reportService);
  it("should return the sprint statistics map when given sprint statistics", () => {
    const iterationDataMap =
      reportServiceProto.getSprintStatisticsMap(sprintStatistics);
    const expected = new Map();
    expected.set("test Sprint 1", [
      "test Sprint 1",
      1.91,
      1,
      1,
      0.78,
      0.22,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0.05,
      0,
      0,
      0,
      0,
      0,
      0.15,
      0.02,
    ]);
    expected.set("test Sprint 2", [
      "test Sprint 2",
      1.5,
      2,
      2,
      0.71,
      0.29,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0.09,
      0,
      0,
      0,
      0,
      0,
      0.15,
      0.05,
    ]);
    expected.set("test Sprint 3", [
      "test Sprint 3",
      0,
      3,
      3,
      0.5,
      0.5,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0.35,
      0,
      0,
      0,
      0,
      0,
      0.1,
      0.05,
    ]);
    expect(iterationDataMap).deep.equal(expected);
  });

  it("should return the empty sprint statistics map when given empty sprint statistics", () => {
    const emptySprintStatistics = new SprintStatistics([], [], [], [], []);
    const emptyIterationDataMap = reportServiceProto.getSprintStatisticsMap(
      emptySprintStatistics
    );
    const expected = new Map();
    expect(emptyIterationDataMap).deep.equal(expected);
  });

  it("should generate the file when given time stamp", () => {
    reportServiceProto.kanabanSprintStatistics = sprintStatistics;
    const testTimeStamp = 11;
    reportServiceProto.generateExcelFile(testTimeStamp);
    setTimeout(() => {
      fs.stat("xlsx/exportSprintExcel-11.xlsx", (err, stats) => {
        expect(stats !== undefined).equal(true);
      });
      fs.stat("xlsx/exportSprintExcel-a.xlsx", (err, stats) => {
        expect(stats !== undefined).equal(false);
      });
    }, 1000);
  });
});
