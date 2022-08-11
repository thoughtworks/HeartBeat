import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import "mocha";
import { GenerateSprintReporterService } from "../../../src/services/GenerateReporter/GenerateSprintReporterService";
import { JiraCard, JiraCardField } from "../../../src/models/kanban/JiraCard";
import {
  CodebaseSetting,
  GenerateReportRequest,
  PipelineSetting,
  RequestKanbanSetting,
} from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import {
  BlockedAndDevelopingPercentage,
  CompleteCardsNumber,
  CycleTime,
  GenerateReporterResponse,
  LatestSprintBlockReason,
  StandardDeviation,
} from "../../../src/contract/GenerateReporter/GenerateReporterResponse";
import sinon from "sinon";
import { GenerateReportService } from "../../../src/services/GenerateReporter/GenerateReportService";
import { WorkDayCalculate } from "../../../src/services/common/WorkDayCalculate";
import { changeConsiderHolidayMode } from "../../../src/services/common/WorkDayCalculate";
import { Cards } from "../../../src/models/kanban/RequestKanbanResults";
import { JiraBlockReasonEnum } from "../../../src/models/kanban/JiraBlockReasonEnum";
import { expect } from "chai";
import { SprintStatistics } from "../../../src/models/kanban/SprintStatistics";
const service = new GenerateSprintReporterService();
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

const cycleTime1: CycleTimeInfo[] = [
  { column: "TODO", day: 0.01 },
  { column: "DOING", day: 1.3 },
];

const kanbanSetting: RequestKanbanSetting = {
  type: "jira",
  token:
    "Basic aHVhbnJhbi55dW5AdGhvdWdodHdvcmtzLmNvbTpqcjVIMnQxdWxDNFMxbGd1UDVSaTdDNDc=",
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
  users: ["Huijun Hong", "Wu Jinpeng", "Xinyi Wei", "junfeng.dai"],
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
const cycleTimeArray: CycleTimeInfo[] = [
  { column: "DOING", day: 0.98 },
  { column: "DONE", day: 5.02 },
  { column: "TEST", day: 0 },
  { column: "DOING", day: 1 },
  { column: "BLOCKED", day: 2 },
];
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
  completedCardsNumber: [
    {
      sprintName: "ADM Sprint 4",
      value: 3,
    },
  ],
  standardDeviation: [
    {
      sprintName: "ADM Sprint 4",
      value: {
        standardDeviation: 1.69,
        average: 3.93,
      },
    },
  ],
  blockedAndDevelopingPercentage: [
    {
      sprintName: "ADM Sprint 4",
      value: {
        blockedPercentage: 0.16,
        developingPercentage: 0.84,
      },
    },
  ],
  deploymentFrequency: undefined,
  leadTimeForChanges: undefined,
  meanTimeToRecovery: undefined,
  latestSprintBlockReason: {
    totalBlockedPercentage: 0.16,
    blockReasonPercentage: [
      {
        reasonName: "dependencies_not_work",
        percentage: 0,
      },
      {
        reasonName: "sit_env_down",
        percentage: 0,
      },
      {
        reasonName: "priority_change",
        percentage: 0,
      },
      {
        reasonName: "solution_review",
        percentage: 0,
      },
      {
        reasonName: "pr_review",
        percentage: 0,
      },
      {
        reasonName: "question_to_be_answered",
        percentage: 0,
      },
      {
        reasonName: "take_leave",
        percentage: 0,
      },
      {
        reasonName: "others",
        percentage: 0.16,
      },
    ],
  },
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
const latestSprintBlockReason = {
  totalBlockedPercentage: 0.16,
  blockReasonPercentage: [
    {
      reasonName: "dependencies_not_work",
      percentage: 0,
    },
    {
      reasonName: "sit_env_down",
      percentage: 0,
    },
    {
      reasonName: "priority_change",
      percentage: 0,
    },
    {
      reasonName: "solution_review",
      percentage: 0,
    },
    {
      reasonName: "pr_review",
      percentage: 0,
    },
    {
      reasonName: "question_to_be_answered",
      percentage: 0,
    },
    {
      reasonName: "take_leave",
      percentage: 0,
    },
    {
      reasonName: "others",
      percentage: 0.16,
    },
  ],
};
const statistics = new SprintStatistics(
  completedCardsNumber,
  standardDeviation,
  blockedAndDevelopingPercentage,
  latestSprintBlockReason
);
describe("GenerateReportService", () => {
  it("generate report ", async () => {
    sinon.stub(changeConsiderHolidayMode);
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");
    const service = new GenerateReportService();
    service.setCards(cards);
    service.setKanbanSprintStatistics(statistics);

    const reportResponse = await service.generateReporter(request);

    const velocityForCards = reportResponse;
    expect(reportResponse).deep.equal(response);
  });
});
