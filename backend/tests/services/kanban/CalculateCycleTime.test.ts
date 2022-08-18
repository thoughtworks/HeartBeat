import "mocha";
import {
  CalculateCardCycleTime,
  CalculateCycleTime,
} from "../../../src/services/kanban/CalculateCycleTime";
import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import {
  JiraCard,
  JiraCardField,
} from "../../../src/models/kanban/JiraBoard/JiraCard";
import { RequestKanbanColumnSetting } from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import { expect } from "chai";
import { CycleTime } from "../../../src/contract/GenerateReporter/GenerateReporterResponse";
import { Cards } from "../../../src/models/kanban/RequestKanbanResults";
import { StepsDay } from "../../../src/models/kanban/CardCycleTime";

let emptyJiraCardField: JiraCardField;

describe("CalculateCycleTimeTest", () => {
  const emptyJiraCard: JiraCard = { fields: emptyJiraCardField, key: "" };
  const cycleTimeArray: CycleTimeInfo[] = [
    { column: "DOING", day: 0.98 },
    { column: "DONE", day: 5.02 },
    { column: "TEST", day: 0 },
    { column: "DOING", day: 1 },
    { column: "BLOCKED", day: 2 },
  ];
  const cards: Cards = {
    cardsNumber: 1,
    matchedCards: [new JiraCardResponse(emptyJiraCard, cycleTimeArray)],
    storyPointSum: 2,
  };
  const boardColumns: RequestKanbanColumnSetting[] = [
    { name: "DOING", value: "In Dev" },
    { name: "TEST", value: "Testing" },
    { name: "DONE", value: "Done" },
  ];
  const expectedCircleTime: CycleTime = {
    totalTimeForCards: 1.98,
    averageCircleTimePerCard: "1.98",
    averageCycleTimePerSP: "0.99",
    swimlaneList: [
      {
        optionalItemName: "In Dev",
        averageTimeForSP: "0.99",
        averageTimeForCards: "1.98",
        totalTime: "1.98",
      },
      {
        optionalItemName: "Done",
        averageTimeForSP: "2.51",
        averageTimeForCards: "5.02",
        totalTime: "5.02",
      },
      {
        optionalItemName: "Testing",
        averageTimeForSP: "0.00",
        averageTimeForCards: "0.00",
        totalTime: "0.00",
      },
    ],
  };
  it("should return right CircleTime", () => {
    expect(CalculateCycleTime(cards, boardColumns)).deep.equal(
      expectedCircleTime
    );
  });

  it("should return cycleTime for one card", () => {
    const step = new StepsDay();
    step.development = 1.98;
    expect(
      CalculateCardCycleTime(cards.matchedCards[0], boardColumns).steps
    ).deep.equal(step);
  });
});
