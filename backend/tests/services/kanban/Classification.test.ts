import "mocha";
import { Cards } from "../../../src/models/kanban/RequestKanbanResults";
import { JiraCardField } from "../../../src/models/kanban/JiraBoard/JiraCard";
import { TargetField } from "../../../src/contract/kanban/KanbanTokenVerifyResponse";
import { ClassificationField } from "../../../src/contract/GenerateReporter/GenerateReporterResponse";
import { getClassificationOfSelectedFields } from "../../../src/services/kanban/Classification";
import { expect } from "chai";
import sinon from "sinon";

describe("verify token and get cards", () => {
  const emptyJiraCardField: JiraCardField = {
    assignee: { accountId: "", displayName: "" },
    storyPoints: 0,
    fixVersions: [],
    issuetype: { name: "" },
    reporter: { displayName: "" },
    status: { name: "" },
    statuscategorychangedate: "",
    summary: "",
  };
  const cards: Cards = {
    cardsNumber: 3,
    matchedCards: [
      {
        baseInfo: {
          key: "",
          fields: ((): JiraCardField => {
            emptyJiraCardField.storyPoints = 1;
            emptyJiraCardField.fixVersions = [{ name: "Release 1" }];
            emptyJiraCardField.reporter = { displayName: "reporter one" };
            return { ...emptyJiraCardField };
          })(),
        },
        cycleTime: [],
        originCycleTime: [],
        cycleTimeFlat: undefined,
        buildCycleTimeFlatObject: () => void {},
        calculateTotalCycleTimeDivideStoryPoints: () => void {},
        getCardId: sinon.fake(),
        getStatus: sinon.fake(),
        getStoryPoint: sinon.fake(),
        getTotalOrZero: sinon.fake(),
      },
      {
        baseInfo: {
          key: "",
          fields: ((): JiraCardField => {
            emptyJiraCardField.storyPoints = 2;
            emptyJiraCardField.fixVersions = [{ name: "Release 1" }];
            emptyJiraCardField.reporter = { displayName: "reporter one" };
            return { ...emptyJiraCardField };
          })(),
        },
        cycleTime: [],
        originCycleTime: [],
        cycleTimeFlat: undefined,
        buildCycleTimeFlatObject: () => void {},
        calculateTotalCycleTimeDivideStoryPoints: () => void {},
        getCardId: sinon.fake(),
        getStatus: sinon.fake(),
        getStoryPoint: sinon.fake(),
        getTotalOrZero: sinon.fake(),
      },
      {
        baseInfo: {
          key: "",
          fields: ((): JiraCardField => {
            emptyJiraCardField.storyPoints = undefined;
            emptyJiraCardField.fixVersions = [{ name: "Release 2" }];
            emptyJiraCardField.reporter = { displayName: "reporter two" };
            return { ...emptyJiraCardField };
          })(),
        },
        cycleTime: [],
        originCycleTime: [],
        cycleTimeFlat: undefined,
        buildCycleTimeFlatObject: () => void {},
        calculateTotalCycleTimeDivideStoryPoints: () => void {},
        getCardId: sinon.fake(),
        getStatus: sinon.fake(),
        getStoryPoint: sinon.fake(),
        getTotalOrZero: sinon.fake(),
      },
    ],
    storyPointSum: 3,
  };
  const targetField: TargetField[] = [
    {
      key: "fixVersions",
      name: "Fix versions",
      flag: true,
    },
    {
      key: "storyPoints",
      name: "Story point estimate",
      flag: true,
    },
    {
      key: "reporter",
      name: "Reporter",
      flag: true,
    },
  ];

  const resultOne: ClassificationField = {
    fieldName: "Fix versions",
    pairs: [
      { name: "Release 1", value: "66.67%" },
      { name: "Release 2", value: "33.33%" },
    ],
  };
  const resultTwo: ClassificationField = {
    fieldName: "Story point estimate",
    pairs: [
      { name: "None", value: "33.33%" },
      { name: "1", value: "33.33%" },
      {
        name: "2",
        value: "33.33%",
      },
    ],
  };
  const resultThree: ClassificationField = {
    fieldName: "Reporter",
    pairs: [
      { name: "reporter one", value: "66.67%" },
      { name: "reporter two", value: "33.33%" },
    ],
  };
  it("should return classification", () => {
    const classificationList: ClassificationField[] =
      getClassificationOfSelectedFields(cards, targetField);
    expect(classificationList).deep.equal([resultOne, resultTwo, resultThree]);
  });
});
