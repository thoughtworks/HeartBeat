import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import "mocha";
import {
  JiraCard,
  JiraCardField,
} from "../../../src/models/kanban/JiraBoard/JiraCard";
import {
  CodebaseSetting,
  GenerateReportRequest,
  PipelineSetting,
  RequestKanbanSetting,
} from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import { GenerateReporterResponse } from "../../../src/contract/GenerateReporter/GenerateReporterResponse";
import sinon from "sinon";
import { GenerateReportService } from "../../../src/services/GenerateReporter/GenerateReportService";
import { changeConsiderHolidayMode } from "../../../src/services/common/WorkDayCalculate";
import { Cards } from "../../../src/models/kanban/RequestKanbanResults";
import { JiraBlockReasonEnum } from "../../../src/models/kanban/JiraBoard/JiraBlockReasonEnum";
import { expect } from "chai";
import { SprintStatistics } from "../../../src/models/kanban/SprintStatistics";
import { Jira } from "../../../src/services/kanban/Jira/Jira";
import * as GeneraterCsvFile from "../../../src/services/common/GeneraterCsvFile";
import { RequireDataEnum } from "../../../src/models/RequireDataEnum";
import { GitHub } from "../../../src/services/codebase/GitHub/GitHub";
import { SettingMissingError } from "../../../src/errors/SettingMissingError";
import { Buildkite } from "../../../src/services/pipeline/Buildkite/Buildkite";
import fs from "fs";

const sprint1Name = "test Sprint 1";
const sprint2Name = "test Sprint 2";
const sprint3Name = "test Sprint 3";
const jiraCardField1: JiraCardField = new JiraCardField();
const jiraCardField2: JiraCardField = new JiraCardField();
const jiraCardField3: JiraCardField = new JiraCardField();

jiraCardField1.sprint = sprint1Name;
jiraCardField1.label = JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK;

jiraCardField2.sprint = sprint2Name;
jiraCardField2.label = JiraBlockReasonEnum.TAKE_LEAVE;

const jiraCard1: JiraCard = { fields: jiraCardField1, key: "" };
const jiraCard2: JiraCard = { fields: jiraCardField2, key: "" };
const jiraCard3: JiraCard = { fields: jiraCardField3, key: "" };

const kanbanSetting: RequestKanbanSetting = {
  type: "jira",
  token: "test-token",
  site: "dorametrics",
  projectKey: "ADM",
  boardId: "2",
  boardColumns: [
    {
      name: "TODO",
      value: "To do",
    },
    {
      name: "Blocked",
      value: "Block",
    },
    {
      name: "Doing",
      value: "In Dev",
    },
    {
      name: "Testing",
      value: "Testing",
    },
    {
      name: "Done",
      value: "Done",
    },
  ],
  treatFlagCardAsBlock: true,
  users: ["aaa", "bbb", "ccc", "ddd"],
  targetFields: [
    {
      key: "parent",
      name: "Parent",
      flag: false,
    },
    {
      key: "issuerestriction",
      name: "Restrict to",
      flag: false,
    },
    {
      key: "issuetype",
      name: "Issue Type",
      flag: false,
    },
    {
      key: "project",
      name: "Project",
      flag: false,
    },
    {
      key: "customfield_10020",
      name: "Sprint",
      flag: false,
    },
    {
      key: "customfield_10021",
      name: "Flagged",
      flag: false,
    },
    {
      key: "customfield_10000",
      name: "Development",
      flag: false,
    },
    {
      key: "fixVersions",
      name: "Fix versions",
      flag: false,
    },
    {
      key: "priority",
      name: "Priority",
      flag: false,
    },
    {
      key: "customfield_10037",
      name: "Partner",
      flag: false,
    },
    {
      key: "customfield_10015",
      name: "Start date",
      flag: false,
    },
    {
      key: "timetracking",
      name: "Time tracking",
      flag: false,
    },
    {
      key: "labels",
      name: "Labels",
      flag: false,
    },
    {
      key: "customfield_10038",
      name: "QA",
      flag: false,
    },
    {
      key: "customfield_10016",
      name: "Story point estimate",
      flag: false,
    },
    {
      key: "customfield_10019",
      name: "Rank",
      flag: false,
    },
    {
      key: "assignee",
      name: "Assignee",
      flag: false,
    },
    {
      key: "customfield_10017",
      name: "Issue color",
      flag: false,
    },
    {
      key: "customfield_10027",
      name: "Feature/Operation",
      flag: false,
    },
  ],
  doneColumn: ["DONE", "CANCELLED"],
  teamName: "",
  teamId: "",
};
const matchedCards: JiraCardResponse[] = [
  {
    baseInfo: jiraCard1,
    cycleTime: [
      { column: "TODO", day: 0.01 },
      { column: "DOING", day: 1.3 },
      { column: "TESTING", day: 0.25 },
      { column: "DONE", day: 8.64 },
    ],
    originCycleTime: [
      { column: "TODO", day: 0.01 },
      { column: "DOING", day: 1.3 },
      { column: "TESTING", day: 0.25 },
      { column: "DONE", day: 8.64 },
    ],
    cardCycleTime: {
      name: "ADM-221",
      steps: {
        analyse: 0,
        development: 1.3,
        waiting: 0,
        testing: 0.25,
        blocked: 0,
        review: 0,
      },
      total: 1.55,
    },
    cycleTimeFlat: { TODO: 0.01, DOING: 1.3, TESTING: 0.25, DONE: 8.64 },
    totalCycleTimeDivideStoryPoints: "0.78",
    buildCycleTimeFlatObject: () => void {},
    calculateTotalCycleTimeDivideStoryPoints: () => void {},
    getCardId: sinon.fake(),
    getStatus: sinon.fake(),
    getStoryPoint: sinon.fake(),
    getTotalOrZero: sinon.fake(),
  },
  {
    baseInfo: jiraCard2,
    cycleTime: [
      { column: "BACKLOG", day: 248.73 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 2.35 },
      { column: "FLAG", day: 0 },
      { column: "BLOCKED", day: 0.96 },
      { column: "TESTING", day: 1.81 },
      { column: "DONE", day: 10.08 },
    ],
    originCycleTime: [
      { column: "BACKLOG", day: 248.73 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 2.35 },
      { column: "FLAG", day: 0 },
      { column: "BLOCKED", day: 0.96 },
      { column: "TESTING", day: 1.81 },
      { column: "DONE", day: 10.08 },
    ],
    cardCycleTime: {
      name: "ADM-212",
      steps: {
        analyse: 0,
        development: 2.35,
        waiting: 0,
        testing: 1.81,
        blocked: 0.96,
        review: 0,
      },
      total: 5.12,
    },
    cycleTimeFlat: {
      BACKLOG: 248.73,
      TODO: 0.97,
      DOING: 2.35,
      FLAG: 0,
      BLOCKED: 0.96,
      TESTING: 1.81,
      DONE: 10.08,
    },
    totalCycleTimeDivideStoryPoints: "2.56",
    buildCycleTimeFlatObject: () => void {},
    calculateTotalCycleTimeDivideStoryPoints: () => void {},
    getCardId: sinon.fake(),
    getStatus: sinon.fake(),
    getStoryPoint: sinon.fake(),
    getTotalOrZero: sinon.fake(),
  },
  {
    baseInfo: jiraCard3,
    cycleTime: [
      { column: "BACKLOG", day: 248.78 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 3.03 },
      { column: "BLOCKED", day: 0.94 },
      { column: "TESTING", day: 1.16 },
      { column: "DONE", day: 10.08 },
    ],
    originCycleTime: [
      { column: "BACKLOG", day: 248.78 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 3.03 },
      { column: "BLOCKED", day: 0.94 },
      { column: "TESTING", day: 1.16 },
      { column: "DONE", day: 10.08 },
    ],
    cardCycleTime: {
      name: "ADM-208",
      steps: {
        analyse: 0,
        development: 3.03,
        waiting: 0,
        testing: 1.16,
        blocked: 0.94,
        review: 0,
      },
      total: 5.13,
    },
    cycleTimeFlat: {
      BACKLOG: 248.78,
      TODO: 0.97,
      DOING: 3.03,
      BLOCKED: 0.94,
      TESTING: 1.16,
      DONE: 10.08,
    },
    totalCycleTimeDivideStoryPoints: "2.56",
    buildCycleTimeFlatObject: () => void {},
    calculateTotalCycleTimeDivideStoryPoints: () => void {},
    getCardId: sinon.fake(),
    getStatus: sinon.fake(),
    getStoryPoint: sinon.fake(),
    getTotalOrZero: sinon.fake(),
  },
];
const cards: Cards = {
  storyPointSum: 6,
  cardsNumber: 3,
  matchedCards: matchedCards,
};
const request: GenerateReportRequest = {
  metrics: ["Velocity", "Cycle time", "Classification"],
  startTime: 1640966400000,
  endTime: 1659369599000,
  considerHoliday: false,
  kanbanSetting: kanbanSetting,
  csvTimeStamp: 1660201532188,
  pipeline: new PipelineSetting(),
  codebaseSetting: new CodebaseSetting(),
};
const requestWithNullKanbanSetting: GenerateReportRequest = {
  metrics: ["Velocity", "Cycle time", "Classification"],
  startTime: 1640966400000,
  endTime: 1659369599000,
  considerHoliday: false,
  kanbanSetting: new RequestKanbanSetting(),
  csvTimeStamp: 1660201532188,
  pipeline: new PipelineSetting(),
  codebaseSetting: new CodebaseSetting(),
};
const completedCardsNumber = [
  {
    sprintName: "ADM Sprint 4",
    value: 3,
  },
];
const standardDeviation = [
  {
    sprintName: "ADM Sprint 4",
    value: {
      standardDeviation: 1.69,
      average: 3.93,
    },
  },
];
const blockedAndDevelopingPercentage = [
  {
    sprintName: "ADM Sprint 4",
    value: {
      blockedPercentage: 0.16,
      developingPercentage: 0.84,
    },
  },
];
const sprintBlockReason = [
  {
    sprintName: "ADM Sprint 4",
    totalBlockedPercentage: 0.16,
    blockDetails: [
      {
        reasonName: "dependencies_not_work",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "sit_env_down",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "priority_change",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "solution_review",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "pr_review",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "question_to_be_answered",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "take_leave",
        percentage: 0,
        time: 0,
      },
      {
        reasonName: "others",
        percentage: 0.16,
        time: 1,
      },
    ],
  },
];
const response: GenerateReporterResponse = {
  velocity: {
    velocityForSP: "6",
    velocityForCards: "3",
  },
  cycleTime: {
    averageCircleTimePerCard: "3.93",
    averageCycleTimePerSP: "1.97",
    totalTimeForCards: 11.8,
    swimlaneList: [
      {
        optionalItemName: "To do",
        averageTimeForSP: "0.33",
        averageTimeForCards: "0.65",
        totalTime: "1.95",
      },
      {
        optionalItemName: "In Dev",
        averageTimeForSP: "1.11",
        averageTimeForCards: "2.23",
        totalTime: "6.68",
      },
      {
        optionalItemName: "Testing",
        averageTimeForSP: "0.54",
        averageTimeForCards: "1.07",
        totalTime: "3.22",
      },
      {
        optionalItemName: "Done",
        averageTimeForSP: "4.80",
        averageTimeForCards: "9.60",
        totalTime: "28.80",
      },
      {
        optionalItemName: "Block",
        averageTimeForSP: "0.32",
        averageTimeForCards: "0.63",
        totalTime: "1.90",
      },
    ],
  },
  changeFailureRate: undefined,
  classification: [],
  completedCardsNumber: completedCardsNumber,
  standardDeviation: standardDeviation,
  blockedAndDevelopingPercentage: blockedAndDevelopingPercentage,
  deploymentFrequency: undefined,
  leadTimeForChanges: undefined,
  meanTimeToRecovery: undefined,
  latestSprintBlockReason: {
    totalBlockedPercentage: sprintBlockReason[0].totalBlockedPercentage,
    blockReasonPercentage: sprintBlockReason[0].blockDetails,
  },
};
const statistics = new SprintStatistics(
  completedCardsNumber,
  standardDeviation,
  blockedAndDevelopingPercentage,
  sprintBlockReason
);
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
const pipeLineMetrics = [
  RequireDataEnum.CHANGE_FAILURE_RATE,
  RequireDataEnum.DEPLOYMENT_FREQUENCY,
  RequireDataEnum.MEAN_TIME_TO_RECOVERY,
].map((metric) => metric.toLowerCase());
const codebaseMetrics = [RequireDataEnum.LEAD_TIME_OF_CHANGES].map((metric) =>
  metric.toLowerCase()
);
const kanbanMetrics = [
  RequireDataEnum.VELOCITY,
  RequireDataEnum.CYCLE_TIME,
  RequireDataEnum.CLASSIFICATION,
].map((metric) => metric.toLowerCase());

const service = new GenerateReportService();
const serviceProto = Object.getPrototypeOf(service);
serviceProto.kanbanMetrics = kanbanMetrics;
serviceProto.pipeLineMetrics = pipeLineMetrics;
serviceProto.codebaseMetrics = codebaseMetrics;

describe("Generate report", () => {
  afterEach(() => sinon.restore());
  it("should generate report with velocity & cycle time & classification", async () => {
    sinon.stub(changeConsiderHolidayMode);
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");
    const service = new GenerateReportService();
    service.setCards(cards);
    service.setKanbanSprintStatistics(statistics);

    const reportResponse = await service.generateReporter(request);
    expect(reportResponse).deep.equal(response);
  });

  it("should generate report with deployment frequnency & change failure rate & mean time to recovery & lead time for changes", async () => {
    const requestWithOtherMetrics: GenerateReportRequest = {
      metrics: [
        "deployment frequency",
        "change failure rate",
        "mean time to recovery",
        "lead time for changes",
      ],
      startTime: 1640966400000,
      endTime: 1659369599000,
      considerHoliday: false,
      kanbanSetting: kanbanSetting,
      csvTimeStamp: 1660201532188,
      pipeline: new PipelineSetting(),
      codebaseSetting: new CodebaseSetting(),
    };
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");

    const deployInfo1 = {
      pipelineCreateTime: "2021-12-17T07:22:38.100Z",
      jobStartTime: "2021-12-18T07:37:36.455Z",
      jobFinishTime: "2021-12-19T07:38:08.835Z",
      commitId: "1",
      state: "passed",
    };
    const deployInfo2 = {
      pipelineCreateTime: "2021-12-17T07:22:38.100Z",
      jobStartTime: "2021-12-17T07:37:36.455Z",
      jobFinishTime: "2021-12-17T07:38:08.835Z",
      commitId: "2",
      state: "passed",
    };
    const deployTimes = {
      pipelineId: "reporting",
      pipelineName: "reporting",
      pipelineStep: ':white_check_mark: Record "qa" release',
      passed: [deployInfo1, deployInfo2],
      failed: [" ", " "],
    };
    serviceProto.deployTimesListFromDeploySetting = [deployTimes];
    serviceProto.leadTimes = [];
    const reportResponse = await serviceProto.generateReporter(
      requestWithOtherMetrics
    );
    expect(
      reportResponse.deploymentFrequency?.avgDeploymentFrequency?.name
    ).equals("Average");
    expect(
      reportResponse.changeFailureRate?.avgChangeFailureRate?.failureRate
    ).equals("50.00% (2/4)");
    expect(
      reportResponse.meanTimeToRecovery?.avgMeanTimeToRecovery?.name
    ).equals("Average");
    expect(
      reportResponse.leadTimeForChanges?.avgLeadTimeForChanges?.name
    ).equals("Average");
  });
});

describe("process response when given different metrics", () => {
  afterEach(() => sinon.restore());
  it("process response when given kanban metrics", async () => {
    request.metrics = ["Velocity", "Cycle time", "Classification"];
    const fetchDataFromKanban = sinon.stub(
      GenerateReportService.prototype,
      <any>"fetchDataFromKanban"
    );
    await (service as any).fetchOriginalData(request);
    expect(fetchDataFromKanban.callCount).equal(1);
  });

  it("process response when given codebse metrics", async () => {
    const fetchDataFromCodebase = sinon.stub(
      GenerateReportService.prototype,
      <any>"fetchDataFromCodebase"
    );
    request.metrics = ["lead time for changes"];
    request.codebaseSetting = new CodebaseSetting();
    request.codebaseSetting.type = "Github";
    request.codebaseSetting.token = "abc";
    request.pipeline = new PipelineSetting();
    request.pipeline.type = "buildkite";
    request.pipeline.token = "abc";

    await serviceProto.fetchOriginalData(request);
    expect(fetchDataFromCodebase.callCount).equal(1);
  });

  it("process response when given pipeline metrics", async () => {
    const fetchDataFromPipeline = sinon.stub(
      GenerateReportService.prototype,
      <any>"fetchDataFromPipeline"
    );
    request.metrics = ["change failure rate"];
    request.pipeline = new PipelineSetting();
    request.pipeline.type = "buildkite";
    await serviceProto.fetchOriginalData(request);
    expect(fetchDataFromPipeline.callCount).equal(1);
  });

  it("should throw error when metrics does not exist", async () => {
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");
    const requestWithoutMatchedMetrics: GenerateReportRequest = {
      metrics: ["test"],
      startTime: 1640966400000,
      endTime: 1659369599000,
      considerHoliday: false,
      kanbanSetting: kanbanSetting,
      csvTimeStamp: 1660201532188,
      pipeline: new PipelineSetting(),
      codebaseSetting: new CodebaseSetting(),
    };
    try {
      await service.generateReporter(requestWithoutMatchedMetrics);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        expect(err.message).equals("can not match this metric: test");
      }
    }
  });
});

describe("fetch data from different sources", () => {
  afterEach(() => sinon.restore());
  it("should fetch data from Kanban", async () => {
    sinon
      .stub(Jira.prototype, "getStoryPointsAndCycleTime")
      .returns(Promise.resolve(cards));
    sinon
      .stub(Jira.prototype, "getSprintStatistics")
      .returns(Promise.resolve(statistics));
    sinon
      .stub(Jira.prototype, "getStoryPointsAndCycleTimeForNonDoneCards")
      .returns(Promise.resolve(cards));
    sinon.stub(Jira.prototype, "getColumns");
    sinon.stub(GeneraterCsvFile, "ConvertBoardDataToXlsx");

    sinon
      .stub(GenerateReportService.prototype, <any>"generateExcelFile")
      .resolves();
    sinon.stub(GeneraterCsvFile, "ConvertBoardDataToCsv");

    await serviceProto.fetchDataFromKanban(request);

    expect(serviceProto.cards).deep.equal(cards);
    expect(serviceProto.kanabanSprintStatistics).deep.equal(statistics);
  });

  it("should fetch data from codebase", async () => {
    const leadTime1 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "deploymentTest",
      name: "deploymentTest",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/orgtest-Technology/deploymentTest",
    };
    const leadTime2 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "leadtimeTest",
      name: "leadtimeTest",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/orgtest-Technology/leadtimeTest",
    };
    request.codebaseSetting = {
      type: "Github",
      token: " test-token ",
      leadTime: [leadTime1, leadTime2],
    };
    const deployment1 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "deploymentTest",
      name: "deploymentTest",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/orgtest-Technology/deploymentTest",
    };
    const deployment2 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "leadtimeTest",
      name: "leadtimeTest",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/orgtest-Technology/leadtimeTest",
    };
    request.pipeline = {
      type: "BuildKite",
      token: "test-token",
      deployment: [deployment1, deployment2],
    };
    sinon.stub(Buildkite.prototype, "fetchPipelineBuilds");
    sinon.stub(Buildkite.prototype, "countDeployTimes");
    sinon.stub(GitHub.prototype, "fetchPipelinesLeadTime");

    serviceProto.deployTimesListFromLeadTimeSetting = [];
    serviceProto.BuildInfosOfLeadtimes = [];

    await serviceProto.fetchDataFromCodebase(
      request,
      1640966400000,
      1659369599000
    );

    expect(serviceProto.deployTimesListFromLeadTimeSetting.length).equals(2);
    expect(serviceProto.BuildInfosOfLeadtimes.length).equals(2);
  });

  it("should get repo map", async () => {
    const leadTime1 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "deploymentTest",
      name: "deploymentTest",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/orgtest-Technology/deploymentTest",
    };
    const leadTime2 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "leadtimeTest",
      name: "leadtimeTest",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/orgtest-Technology/leadtimeTest",
    };
    const codebaseSetting = {
      type: "Github",
      token: " test-token ",
      leadTime: [leadTime1, leadTime2],
    };
    const responseMap = await serviceProto.constructor.getRepoMap(
      codebaseSetting
    );
    const expectedMap: Map<string, string> = new Map();
    expectedMap.set(
      "deploymentTest",
      "https://github.com/orgtest-Technology/deploymentTest"
    );
    expectedMap.set(
      "leadtimeTest",
      "https://github.com/orgtest-Technology/leadtimeTest"
    );
    expect(responseMap).deep.equals(expectedMap);
  });

  it("should fetch data from pipeline", async () => {
    const deployment1 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "deploymentTest",
      name: "deploymentTest",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/orgtest-Technology/deploymentTest",
    };
    const deployment2 = {
      orgId: "orgtest",
      orgName: "orgtest",
      id: "leadtimeTest",
      name: "leadtimeTest",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/orgtest-Technology/leadtimeTest",
    };
    request.pipeline = {
      type: "BuildKite",
      token: "test-token",
      deployment: [deployment1, deployment2],
    };
    serviceProto.deployTimesListFromDeploySetting = [];
    serviceProto.BuildInfos = [];

    sinon.stub(Buildkite.prototype, "fetchPipelineBuilds");
    sinon.stub(Buildkite.prototype, "countDeployTimes");

    await serviceProto.fetchDataFromPipeline(
      request,
      1640966400000,
      1659369599000
    );
    expect(serviceProto.deployTimesListFromDeploySetting.length).equals(2);
    expect(serviceProto.BuildInfos.length).equals(2);
  });
});

describe("throw error when fetching original data without relevant setting", () => {
  afterEach(() => sinon.restore());
  it("should throw error when fetching original data without kanban setting", async () => {
    try {
      await serviceProto.fetchOriginalData(requestWithNullKanbanSetting);
    } catch (err) {
      if (err instanceof SettingMissingError) {
        expect(err.message).equals(
          new SettingMissingError("kanban setting").message
        );
      }
    }
  });

  it("should throw error when fetching original data without pipeline setting", async () => {
    request.metrics = ["change failure rate"];
    request.pipeline = new PipelineSetting();
    try {
      await serviceProto.fetchOriginalData(request);
    } catch (err) {
      if (err instanceof SettingMissingError) {
        expect(err.message).equals(
          new SettingMissingError("pipeline setting").message
        );
      }
    }
  });

  it("should throw error when fetching original data without codebase or pipeline setting", async () => {
    request.metrics = ["lead time for changes"];
    request.codebaseSetting = new CodebaseSetting();
    try {
      await serviceProto.fetchOriginalData(request);
    } catch (err) {
      if (err instanceof SettingMissingError) {
        expect(err.message).equals(
          new SettingMissingError("codebase setting or pipeline setting")
            .message
        );
      }
    }
  });
});

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
    reportServiceProto.boardStatisticsXlsx = [
      [
        { header: "Issue key", key: "Issue key" },
        { header: "Summary", key: "Summary" },
      ],
      [
        {
          "Issue key": "ADM-91",
          Summary: "Export the result on report page",
          "Issue Type": "故事",
          Status: "已完成",
          "Story Points": "1",
        },
        {
          "Issue key": "ADM-105",
          Summary: "Fetch pipeline steps after user choose the pipeline(BE+FE)",
          "Issue Type": "故事",
          Status: "已完成",
          "Story Points": "2",
        },
      ],
    ];
    reportServiceProto.generateExcelFile(request);
    setTimeout(() => {
      fs.stat("xlsx/exportSprintExcel-1660201532188.xlsx", (error, stats) => {
        expect(stats !== undefined).equal(true);
      });
      fs.stat("xlsx/exportSprintExcel-a.xlsx", (error, stats) => {
        expect(stats !== undefined).equal(false);
      });
    }, 1000);
  });
});
