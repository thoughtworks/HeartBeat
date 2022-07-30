import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import "mocha";
import { expect } from "chai";
import { GenerateSprintReporterService } from "../../../src/services/GenerateReporter/GenerateSprintReporterService";
import {
  JiraCard,
  JiraCardField,
  Status,
} from "../../../src/models/kanban/JiraCard";
import { Sprint } from "../../../src/models/kanban/Sprint";
import {
  CardCycleTime,
  StepsDay,
} from "../../../src/models/kanban/CardCycleTime";
import { JiraBlockReasonEnum } from "../../../src/models/kanban/JiraBlockReasonEnum";
import { CardStepsEnum } from "../../../src/models/kanban/CardStepsEnum";

const service = new GenerateSprintReporterService();

const sprint1Name = "test Sprint 1";
const sprint2Name = "test Sprint 2";
const sprint3Name = "test Sprint 3";

const jiraCardField1: JiraCardField = new JiraCardField();
const jiraCardField2: JiraCardField = new JiraCardField();
const jiraCardField3: JiraCardField = new JiraCardField();

const activeSprint = new Sprint(
  1,
  "active",
  sprint1Name,
  "2020-07-22T01:48:39.455Z",
  "2020-08-09T03:20:37.000Z"
);
const closedSprint = new Sprint(
  4,
  "closed",
  sprint2Name,
  "2020-05-26T03:20:43.632Z",
  "2020-08-05T01:48:37.000Z",
  "2020-08-22T01:49:26.508Z"
);

const futureSprint = new Sprint(9, "future", sprint3Name);

const sprints: Sprint[] = [activeSprint, closedSprint, futureSprint];
const activeAndClosedSprints = [activeSprint, closedSprint];

const todoStatus: Status = { name: CardStepsEnum.TODO };
const doneStatus: Status = { name: CardStepsEnum.DONE };

jiraCardField1.sprint = sprint1Name;
jiraCardField1.label = JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK;
jiraCardField1.status = todoStatus;

jiraCardField2.sprint = sprint2Name;
jiraCardField2.label = JiraBlockReasonEnum.TAKE_LEAVE;
jiraCardField2.status = doneStatus;

jiraCardField3.status = doneStatus;

const jiraCard1: JiraCard = { fields: jiraCardField1, key: "" };
const jiraCard2: JiraCard = { fields: jiraCardField2, key: "" };
const jiraCard3: JiraCard = { fields: jiraCardField3, key: "" };

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
  jiraCard1,
  cycleTimeArray1,
  [],
  cardCycleTime1
);
const card2 = new JiraCardResponse(
  jiraCard2,
  cycleTimeArray2,
  [],
  cardCycleTime2
);
const card3 = new JiraCardResponse(
  jiraCard3,
  cycleTimeArray3,
  [],
  cardCycleTime3
);

const cardList1 = [card1, card2, card3];
const cardList2 = [card1, card2];
const cardList3 = [card1];
const emptyCardList: JiraCardResponse[] = [];

const mapSprintCards = new Map<string, JiraCardResponse[]>([
  [sprint1Name, cardList1],
  [sprint2Name, cardList2],
  [sprint3Name, cardList3],
]);
const mapSprintEmptyCards = new Map<string, JiraCardResponse[]>([
  [sprint1Name, emptyCardList],
]);

describe("map cards by sprint name", () => {
  const jiraCardField: JiraCardField = new JiraCardField();
  const jiraCard: JiraCard = { fields: jiraCardField, key: "" };
  const card = new JiraCardResponse(jiraCard, cycleTimeArray1);
  const cardList = [card];

  it("should return a map when all cards have sprint name", () => {
    jiraCardField.sprint = sprint1Name;

    const mapSprintCards = service.mapCardsBySprintName(cardList);

    expect(mapSprintCards).deep.equal(
      new Map<string, JiraCardResponse[]>([[sprint1Name, cardList]])
    );
  });

  it("should return empty map when all cards do not have any sprint name", () => {
    jiraCardField.sprint = "";

    const mapSprintCards = service.mapCardsBySprintName(cardList);

    expect(mapSprintCards).deep.equal(new Map<string, JiraCardResponse[]>());
  });

  it("should return empty map when the card list is empty", () => {
    const mapSprintCards = service.mapCardsBySprintName(emptyCardList);

    expect(mapSprintCards).deep.equal(new Map<string, JiraCardResponse[]>());
  });
});

describe("calculate percentage of different block reasons in the latest sprint", () => {
  it("should return correct blocked reason percentage when there are matched cards in sprint", () => {
    const blockedPercentageByReason = service.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      mapSprintCards
    );

    expect(
      blockedPercentageByReason.get(JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK)
    ).equal(0.07);
    expect(blockedPercentageByReason.get(JiraBlockReasonEnum.TAKE_LEAVE)).equal(
      0.07
    );
    expect(blockedPercentageByReason.get(JiraBlockReasonEnum.OTHERS)).equal(
      0.07
    );
  });

  it("should return 0 when there is not any matched card in sprint", () => {
    const mapLatestSprintEmptyCards = new Map<string, JiraCardResponse[]>([
      [sprint1Name, emptyCardList],
      [sprint2Name, cardList2],
      [sprint3Name, cardList3],
    ]);

    const blockedPercentageByReason = service.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      mapLatestSprintEmptyCards
    );

    expect(
      blockedPercentageByReason.get(JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK)
    ).equal(0);
    expect(blockedPercentageByReason.get(JiraBlockReasonEnum.TAKE_LEAVE)).equal(
      0
    );
    expect(blockedPercentageByReason.get(JiraBlockReasonEnum.OTHERS)).equal(0);
  });
});

describe("calculate standard deviation", () => {
  it("should return correct standard deviation and avgerage when there are matched cards in sprint", () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set(sprint1Name, { standardDeviation: 1.91, avgerage: 4.53 });
    expected.set(sprint2Name, { standardDeviation: 1.5, avgerage: 3.5 });
    expected.set(sprint3Name, { standardDeviation: 0, avgerage: 2 });

    const mapSprintStandardDeviation =
      service.calculateStandardDeviation(mapSprintCards);

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });

  it("should return 0 when there is not any matched card in sprint", () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set(sprint1Name, { standardDeviation: 0, avgerage: 0 });

    const mapSprintStandardDeviation =
      service.calculateStandardDeviation(mapSprintEmptyCards);

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });
});

describe("calculate blocked and developing percentage", () => {
  it("should return correct blocked and developing percentage when there are matched cards in sprint", () => {
    const mapIterationBlockedPercentage =
      service.calculateBlockedAndDevelopingPercentage(mapSprintCards);

    const expected: Map<string, any> = new Map<string, number>();
    expected.set(sprint1Name, {
      blockedPercentage: 0.22,
      developingPercentage: 0.78,
    });
    expected.set(sprint2Name, {
      blockedPercentage: 0.29,
      developingPercentage: 0.71,
    });
    expected.set(sprint3Name, {
      blockedPercentage: 0.5,
      developingPercentage: 0.5,
    });

    expect(mapIterationBlockedPercentage).deep.equal(expected);
  });

  it("should return 0% blocked percentage and 100% developing percentage when there is not any matched card in sprint", () => {
    const mapIterationBlockedPercentage =
      service.calculateBlockedAndDevelopingPercentage(mapSprintEmptyCards);

    const expected: Map<string, any> = new Map<string, number>();
    expected.set(sprint1Name, {
      blockedPercentage: 0,
      developingPercentage: 1,
    });

    expect(mapIterationBlockedPercentage).deep.equal(expected);
  });
});

describe("calculate the number of completed cards in every sprint", () => {
  it("should return the correct number of completed cards when there are matched cards in sprint", () => {
    const mapSprintCards = new Map<string, JiraCardResponse[]>([
      [sprint1Name, cardList1],
      [sprint2Name, cardList2],
    ]);

    const mapSprintCompletedCardsNumber =
      service.calculateCompletedCardsNumber(mapSprintCards);

    const expected: Map<string, number> = new Map<string, number>();
    expected.set(sprint1Name, 2);
    expected.set(sprint2Name, 1);

    expect(mapSprintCompletedCardsNumber).deep.equal(expected);
  });

  it("should return 0 when the cardlist does not have any done card", () => {
    const mapSprintCards = new Map<string, JiraCardResponse[]>([
      [sprint1Name, cardList3],
    ]);

    const mapSprintCompletedCardsNumber =
      service.calculateCompletedCardsNumber(mapSprintCards);

    const expected: Map<string, number> = new Map<string, number>();
    expected.set(sprint1Name, 0);

    expect(mapSprintCompletedCardsNumber).deep.equal(expected);
  });

  it("should return 0 when the cardlist is empty", () => {
    const mapSprintCards = new Map<string, JiraCardResponse[]>([
      [sprint1Name, emptyCardList],
    ]);

    const mapSprintCompletedCardsNumber =
      service.calculateCompletedCardsNumber(mapSprintCards);
    const expected: Map<string, number> = new Map<string, number>();
    expected.set(sprint1Name, 0);

    expect(mapSprintCompletedCardsNumber).deep.equal(expected);
  });
});
