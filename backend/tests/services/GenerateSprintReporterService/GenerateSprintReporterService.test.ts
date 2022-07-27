import sinon from "sinon";
import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import "mocha";
import { expect } from "chai";
import { GenerateSprintReporterService } from "../../../src/services/GenerateReporter/GenerateSprintReporterService";
import { JiraCard, JiraCardField } from "../../../src/models/kanban/JiraCard";
import { Sprint } from "../../../src/models/kanban/Sprint";
import { RequestKanbanColumnSetting } from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import {
  CardCycleTime,
  StepsDay,
} from "../../../src/models/kanban/CardCycleTime";
import { Cards } from "../../../src/models/kanban/RequestKanbanResults";

describe("calculate percentage of different block reasons in the latest iteration", () => {
  const service = new GenerateSprintReporterService();
  const sprint1JiraCardField: JiraCardField = new JiraCardField();
  const sprint2JiraCardField: JiraCardField = new JiraCardField();
  const sprint1 = new Sprint(
    1,
    "closed",
    "test Sprint 1",
    "2020-05-26T03:20:43.632Z",
    "2020-06-09T03:20:37.000Z",
    "2020-07-22T01:46:20.917Z"
  );
  const sprint2 = new Sprint(
    4,
    "closed",
    "test Sprint 2",
    "2020-07-22T01:48:39.455Z",
    "2020-08-05T01:48:37.000Z",
    "2020-07-22T01:49:26.508Z"
  );
  const sprint3 = new Sprint(9, "future", "test Sprint 5");
  const sprints: Sprint[] = [sprint1, sprint2, sprint3];

  sprint1JiraCardField.sprint = "test sprint 1";
  sprint2JiraCardField.sprint = "test Sprint 2";
  sprint2JiraCardField.label = "dependencies_not_work";

  const sprint1JiraCard: JiraCard = { fields: sprint1JiraCardField, key: "" };
  const sprint2JiraCard: JiraCard = { fields: sprint2JiraCardField, key: "" };

  const cycleTimeArray1: CycleTimeInfo[] = [
    { column: "DOING", day: 1 },
    { column: "WAIT", day: 2 },
    { column: "TEST", day: 3 },
    { column: "BLOCKED", day: 4 },
    { column: "REVIEW", day: 5 },
  ];
  const cycleTimeArray2: CycleTimeInfo[] = [
    { column: "DOING", day: 2 },
    { column: "WAIT", day: 3 },
    { column: "TEST", day: 4 },
    { column: "BLOCKED", day: 5 },
    { column: "REVIEW", day: 6 },
  ];

  const cards = [
    new JiraCardResponse(sprint1JiraCard, cycleTimeArray1),
    new JiraCardResponse(sprint2JiraCard, cycleTimeArray2),
  ];

  const boardColumns: RequestKanbanColumnSetting[] = [
    { name: "DOING", value: "In Dev" },
    { name: "WAIT", value: "Waiting for testing" },
    { name: "TEST", value: "Testing" },
    { name: "BLOCKED", value: "Block" },
    { name: "REVIEW", value: "Review" },
  ];

  it("should return the latest sprint name", async () => {
    const latestSprintName = service.getLatestIterationSprintName(sprints);

    expect(latestSprintName).equal("test Sprint 2");
  });

  it("should return an empty string when there are no matched cards", async () => {
    const sprintWithoutMatchedCards = [sprint3];

    const latestSprintName = service.getLatestIterationSprintName(
      sprintWithoutMatchedCards
    );

    expect(latestSprintName).equal("");
  });

  it("should return the latest iteration cards by sprint name", async () => {
    const cards = [
      new JiraCardResponse(sprint1JiraCard, []),
      new JiraCardResponse(sprint2JiraCard, []),
    ];

    const latestCards = service.getAllCardsByLatestSprintName(
      cards,
      "test Sprint 2"
    );

    console.log(latestCards[0].baseInfo.fields);

    expect(latestCards[0].baseInfo.fields.sprint).deep.equal("test Sprint 2");
    expect(latestCards[0]).deep.equal(cards[1]);
    expect(latestCards.length).deep.equal(1);
  });

  it("should return blocked reason percentage", async () => {
    sinon
      .stub(
        GenerateSprintReporterService.prototype,
        "initTotalBlockTimeForEveryReasonMap"
      )
      .returns(
        new Map([
          ["dependencies_not_work", 0],
          ["unknown", 0],
        ])
      );

    sinon
      .stub(
        GenerateSprintReporterService.prototype,
        "getLatestIterationSprintName"
      )
      .returns("test Sprint 2");

    const matchedCards = new JiraCardResponse(sprint2JiraCard, cycleTimeArray2);
    const list: JiraCardResponse[] = [matchedCards];
    sinon
      .stub(
        GenerateSprintReporterService.prototype,
        "getAllCardsByLatestSprintName"
      )
      .returns(list);

    const blockedPercentageByReason = service.calculateBlockReasonPercentage(
      cards,
      boardColumns,
      sprints
    );

    expect(blockedPercentageByReason.get("dependencies_not_work")).equal(1);
    expect(blockedPercentageByReason.get("unknown")).equal(0);

    sinon.restore();
  });

  it("should return a initMap when there are no matched card", async () => {
    sinon
      .stub(
        GenerateSprintReporterService.prototype,
        "getLatestIterationSprintName"
      )
      .returns("test Sprint 2");
    sinon
      .stub(
        GenerateSprintReporterService.prototype,
        "getAllCardsByLatestSprintName"
      )
      .returns([]);
    sinon
      .stub(
        GenerateSprintReporterService.prototype,
        "initTotalBlockTimeForEveryReasonMap"
      )
      .returns(
        new Map([
          ["dependencies_not_work", 0],
          ["unknown", 0],
        ])
      );
    const map = service.calculateBlockReasonPercentage(
      cards,
      boardColumns,
      sprints
    );

    expect(map).deep.equal(
      new Map([
        ["dependencies_not_work", 0],
        ["unknown", 0],
      ])
    );

    sinon.restore();
  });
});

describe("calculate standard deviation without order", () => {
  const service = new GenerateSprintReporterService();
  const sprint1JiraCardField: JiraCardField = new JiraCardField();
  const sprint2JiraCardField: JiraCardField = new JiraCardField();
  const sprint1 = new Sprint(
    1,
    "closed",
    "ADM Sprint 1",
    "2020-07-22T01:48:39.455Z",
    "2020-08-09T03:20:37.000Z",
    "2020-08-22T01:46:20.917Z"
  );
  const sprint2 = new Sprint(
    4,
    "active",
    "ADM Sprint 2",
    "2020-05-26T03:20:43.632Z",
    "2020-08-05T01:48:37.000Z"
  );
  const sprint3 = new Sprint(9, "future", "ADM Sprint 5");
  const sprints: Sprint[] = [sprint1, sprint2, sprint3];

  sprint1JiraCardField.sprint = "Sprint 1";
  sprint2JiraCardField.sprint = "Sprint 2";
  sprint2JiraCardField.label = "dependencies_not_work";

  const sprint1JiraCard: JiraCard = { fields: sprint1JiraCardField, key: "" };
  const sprint2JiraCard: JiraCard = { fields: sprint2JiraCardField, key: "" };

  const cycleTimeArray: CycleTimeInfo[] = [
    { column: "DOING", day: 0 },
    { column: "DONE", day: 0 },
    { column: "TEST", day: 0 },
    { column: "DOING", day: 0 },
    { column: "BLOCKED", day: 0 },
  ];
  const stepsDay: StepsDay = {
    analyse: 0,
    development: 0,
    waiting: 0,
    testing: 0,
    blocked: 0,
    review: 0,
  };
  const cardCycleTime1: CardCycleTime = {
    name: "Card 1",
    total: 1,
    steps: stepsDay,
  };
  const cardCycleTime2: CardCycleTime = {
    name: "Card 2",
    total: 5,
    steps: stepsDay,
  };
  const cardCycleTime3: CardCycleTime = {
    name: "Card 3",
    total: 6.6,
    steps: stepsDay,
  };
  const cardCycleTime4: CardCycleTime = {
    name: "Card 4",
    total: 1.1,
    steps: stepsDay,
  };
  const cardCycleTime5: CardCycleTime = {
    name: "Card 5",
    total: 12.77,
    steps: stepsDay,
  };

  const cards: Cards = {
    cardsNumber: 5,
    matchedCards: [
      new JiraCardResponse(sprint1JiraCard, cycleTimeArray, [], cardCycleTime1),
      new JiraCardResponse(sprint1JiraCard, cycleTimeArray, [], cardCycleTime2),
      new JiraCardResponse(sprint1JiraCard, cycleTimeArray, [], cardCycleTime3),
      new JiraCardResponse(sprint2JiraCard, cycleTimeArray, [], cardCycleTime4),
      new JiraCardResponse(sprint2JiraCard, cycleTimeArray, [], cardCycleTime5),
    ],
    storyPointSum: 8,
  };

  it("should only get active and closed sprints", async () => {
    const expected = [sprint1, sprint2];

    expect(service.getActiveAndClosedSprints(sprints)).deep.equal(expected);
  });

  it("should classify the cards by sprint name", () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set("Sprint 1", {
      count: 3,
      totalCycleTime: 12.6,
      cycleTimes: [1, 5, 6.6],
    });
    expected.set("Sprint 2", {
      count: 2,
      totalCycleTime: 13.87,
      cycleTimes: [1.1, 12.77],
    });

    const mapSprintObj = service.classifyCardsBySprintName(cards);

    expect(mapSprintObj).deep.equal(expected);
  });

  it("should calculate standard deviation", async () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set("Sprint 2", { standardDeviation: 5.84, avgerage: 6.93 });
    expected.set("Sprint 1", { standardDeviation: 2.36, avgerage: 4.2 });

    const mapSprintStandardDeviation =
      service.calculateStandardDeviation(cards);

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });
});
