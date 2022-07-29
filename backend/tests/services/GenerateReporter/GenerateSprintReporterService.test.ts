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

describe("calculate percentage of different block reasons in the latest iteration", () => {
  const service = new GenerateSprintReporterService();

  const sprint1JiraCardField: JiraCardField = new JiraCardField();
  const sprint2JiraCardField: JiraCardField = new JiraCardField();
  const sprint3JiraCardField: JiraCardField = new JiraCardField();

  const sprint1 = new Sprint(
    1,
    "active",
    "test Sprint 1",
    "2020-07-22T01:48:39.455Z",
    "2020-08-09T03:20:37.000Z"
  );
  const sprint2 = new Sprint(
    4,
    "closed",
    "test Sprint 2",
    "2020-05-26T03:20:43.632Z",
    "2020-08-05T01:48:37.000Z",
    "2020-08-22T01:49:26.508Z"
  );
  const sprint3 = new Sprint(9, "future", "test Sprint 3");
  const sprints: Sprint[] = [sprint1, sprint2, sprint3];
  const activeAndClosedSprints = [sprint1, sprint2];

  sprint1JiraCardField.sprint = "test Sprint 1";
  sprint2JiraCardField.sprint = "test Sprint 2";
  sprint1JiraCardField.label = "dependencies_not_work";
  sprint2JiraCardField.label = "take_leave";

  const sprint1JiraCard: JiraCard = { fields: sprint1JiraCardField, key: "" };
  const sprint2JiraCard: JiraCard = { fields: sprint2JiraCardField, key: "" };
  const sprint3JiraCard: JiraCard = { fields: sprint3JiraCardField, key: "" };

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
  const cycleTimeArray3: CycleTimeInfo[] = [
    { column: "DOING", day: 1 },
    { column: "WAIT", day: 8 },
    { column: "TEST", day: 4 },
    { column: "BLOCKED", day: 9 },
    { column: "REVIEW", day: 6 },
  ];

  const stepsDay: StepsDay = {
    analyse: 0,
    development: 0,
    waiting: 0,
    testing: 0,
    blocked: 1,
    review: 0,
  };

  const cardCycleTime1: CardCycleTime = {
    name: "Card 1",
    total: 2,
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

  const card1 = new JiraCardResponse(
    sprint1JiraCard,
    cycleTimeArray1,
    [],
    cardCycleTime1
  );
  const card2 = new JiraCardResponse(
    sprint2JiraCard,
    cycleTimeArray2,
    [],
    cardCycleTime2
  );
  const card3 = new JiraCardResponse(
    sprint3JiraCard,
    cycleTimeArray3,
    [],
    cardCycleTime3
  );

  const cardList1 = [card1, card2, card3];
  const cardList2 = [card1, card2];
  const cardList3 = [card1];
  const emptyCardList: JiraCardResponse[] = [];

  const mapSprintCards = new Map<string, JiraCardResponse[]>([
    ["test Sprint 1", cardList1],
    ["test Sprint 2", cardList2],
    ["test Sprint 3", cardList3],
  ]);
  const mapLatestSprintEmptyCards = new Map<string, JiraCardResponse[]>([
    ["test Sprint 1", emptyCardList],
    ["test Sprint 2", cardList2],
    ["test Sprint 3", cardList3],
  ]);

  const boardColumns: RequestKanbanColumnSetting[] = [
    { name: "DOING", value: "In Dev" },
    { name: "WAIT", value: "Waiting for testing" },
    { name: "TEST", value: "Testing" },
    { name: "BLOCKED", value: "Block" },
    { name: "REVIEW", value: "Review" },
  ];

  it("should return map with key is sprintName and value is list of cards", async () => {
    const expected: Map<string, JiraCardResponse[]> = new Map<
      string,
      JiraCardResponse[]
    >();
    expected.set("test Sprint 1", [card1]);
    expected.set("test Sprint 2", [card2]);

    const mapSprintCards = service.mapCardsBySprintName(cardList1);

    expect(mapSprintCards).deep.equal(expected);
  });

  it("should return empty map when there is no matchedCards", async () => {
    const expected: Map<string, JiraCardResponse[]> = new Map<
      string,
      JiraCardResponse[]
    >();

    const mapSprintCards = service.mapCardsBySprintName(emptyCardList);

    expect(mapSprintCards).deep.equal(expected);
  });

  it("should return blocked reason percentage", async () => {
    const blockedPercentageByReason = service.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      mapSprintCards
    );

    expect(blockedPercentageByReason.get("dependencies_not_work")).equal(0.07);
    expect(blockedPercentageByReason.get("take_leave")).equal(0.07);
    expect(blockedPercentageByReason.get("others")).equal(0.07);
  });

  it("should return blocked reason percentage when there is no matchedCards", async () => {
    const blockedPercentageByReason = service.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      mapLatestSprintEmptyCards
    );

    expect(blockedPercentageByReason.get("dependencies_not_work")).equal(0);
    expect(blockedPercentageByReason.get("take_leave")).equal(0);
    expect(blockedPercentageByReason.get("others")).equal(0);
  });

  it("should calculate standard deviation", async () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set("test Sprint 1", { standardDeviation: 1.91, avgerage: 4.53 });
    expected.set("test Sprint 2", { standardDeviation: 1.5, avgerage: 3.5 });
    expected.set("test Sprint 3", { standardDeviation: 0, avgerage: 2 });

    const mapSprintStandardDeviation =
      service.calculateStandardDeviation(mapSprintCards);

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });

  it("should calculate standard deviation when there is no matchedCards", async () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set("test Sprint 1", { standardDeviation: 0, avgerage: 0 });
    expected.set("test Sprint 2", { standardDeviation: 1.5, avgerage: 3.5 });
    expected.set("test Sprint 3", { standardDeviation: 0, avgerage: 2 });

    const mapSprintStandardDeviation = service.calculateStandardDeviation(
      mapLatestSprintEmptyCards
    );

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });

  it("should calculate blocked and developing percentage", async () => {
    const mapIterationBlockedPercentage =
      service.calculateBlockedAndDevelopingPercentage(mapSprintCards);
    const expected: Map<string, any> = new Map<string, number>();

    expected.set("test Sprint 1", {
      blockedPercentage: 0.22,
      developingPercentage: 0.78,
    });
    expected.set("test Sprint 2", {
      blockedPercentage: 0.29,
      developingPercentage: 0.71,
    });
    expected.set("test Sprint 3", {
      blockedPercentage: 0.5,
      developingPercentage: 0.5,
    });
    expect(mapIterationBlockedPercentage).deep.equal(expected);
  });

  it("should calculate blocked and developing percentage when there is no matchedCards", async () => {
    const mapIterationBlockedPercentage =
      service.calculateBlockedAndDevelopingPercentage(
        mapLatestSprintEmptyCards
      );
    const expected: Map<string, any> = new Map<string, number>();

    expected.set("test Sprint 1", {
      blockedPercentage: 0,
      developingPercentage: 1,
    });
    expected.set("test Sprint 2", {
      blockedPercentage: 0.29,
      developingPercentage: 0.71,
    });
    expected.set("test Sprint 3", {
      blockedPercentage: 0.5,
      developingPercentage: 0.5,
    });
    expect(mapIterationBlockedPercentage).deep.equal(expected);
  });
});
