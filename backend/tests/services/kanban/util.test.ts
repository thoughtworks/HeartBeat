import { expect } from "chai";
import "mocha";
import {
  confirmThisCardHasAssignedBySelectedUser,
  getCardTimeForEachStep,
  getThisStepCostTime,
  reformTimeLineForFlaggedCards,
  sortStatusChangedArray,
  StatusChangedArrayItem,
  transformLinearCardToJiraCard,
} from "../../../src/services/kanban/util";
import sinon from "sinon";
import { CycleTimeInfo } from "../../../src/contract/kanban/KanbanStoryPointResponse";
import linearCards from "../../fixture/LinearCards";
import { Issue } from "@linear/sdk";
import * as WorkDayCalculate from "../../../src/services/common/WorkDayCalculate";
const statusChangedArrayInTimeOrder = [
  {
    timestamp: 1628227640000,
    status: "To do",
  },
  {
    timestamp: 1630906040000,
    status: "In Dev",
  },
  {
    timestamp: 1633498040000,
    status: "Review",
  },
  {
    timestamp: 1636176440000,
    status: "Done",
  },
] as StatusChangedArrayItem[];

const statusChangedArrayNotInTimeOrder = [
  {
    timestamp: 1636176440000,
    status: "Done",
  },
  {
    timestamp: 1630906040000,
    status: "In Dev",
  },
  {
    timestamp: 1628227640000,
    status: "To do",
  },
  {
    timestamp: 1633498040000,
    status: "Review",
  },
] as StatusChangedArrayItem[];

const statusChangedArrayContainingFlaggedItem = [
  {
    timestamp: 1628227640000,
    status: "To do",
  },
  {
    timestamp: 1630906040000,
    status: "In Dev",
  },
  {
    timestamp: 1633498040000,
    status: "FLAG",
  },
  {
    timestamp: 1636176440000,
    status: "Done",
  },
] as StatusChangedArrayItem[];

describe("utils", () => {
  before(() => {
    sinon.stub(WorkDayCalculate, "calculateWorkDaysBy24Hours").returns(0.5);
  });
  after(() => {
    sinon.restore();
  });
  it("getThisStepCostTime", () => {
    const inDevCostTime = getThisStepCostTime(1, statusChangedArrayInTimeOrder);
    const doneCostTime = getThisStepCostTime(3, statusChangedArrayInTimeOrder);

    expect(inDevCostTime).equal(0.5);
    expect(doneCostTime).equal(0.5);
  });

  it("getCardTimeForEachStep", () => {
    const cardTimeForEachStep = getCardTimeForEachStep(
      statusChangedArrayInTimeOrder
    );

    expect(cardTimeForEachStep).to.have.deep.members([
      { column: "TO DO", day: 0.5 },
      { column: "IN DEV", day: 0.5 },
      { column: "REVIEW", day: 0.5 },
      { column: "DONE", day: 0.5 },
    ] as CycleTimeInfo[]);
  });

  it("sortStatusChangedArray", () => {
    const sortedStatusChangedArray = sortStatusChangedArray(
      statusChangedArrayNotInTimeOrder
    );

    expect(sortedStatusChangedArray).to.have.deep.members([
      { timestamp: 1628227640000, status: "To do" },
      { timestamp: 1630906040000, status: "In Dev" },
      { timestamp: 1633498040000, status: "Review" },
      { timestamp: 1636176440000, status: "Done" },
    ]);
  });

  it("reformTimeLineForFlaggedCards", () => {
    const reformedStatusChangedArray = reformTimeLineForFlaggedCards(
      statusChangedArrayContainingFlaggedItem
    );

    expect(reformedStatusChangedArray).to.have.deep.members([
      { timestamp: 1628227640000, status: "To do" },
      { timestamp: 1630906040000, status: "In Dev" },
      { timestamp: 1633498040000, status: "FLAG" },
    ]);
  });

  it("confirmThisCardHasAssignedBySelectedUser", () => {
    const selectedUsers: string[] = [
      "testUser1",
      "testUser2",
      "testUser2",
      "testUser3",
    ];
    const cardIncludedUsers: Set<string> = new Set<string>();
    cardIncludedUsers.add("testUser1");
    const ifThisCardHasAssignedBySelectedUser =
      confirmThisCardHasAssignedBySelectedUser(
        selectedUsers,
        cardIncludedUsers
      );

    expect(ifThisCardHasAssignedBySelectedUser).equal(true);
  });

  it("transformLinearCardToJiraCard", async () => {
    const linearCard = linearCards.nodes[0] as unknown as Issue;
    const jiraCard = await transformLinearCardToJiraCard(linearCard);

    expect(jiraCard.key).equal(linearCard.identifier);
    expect(jiraCard.fields.status).equal(undefined);
    expect(jiraCard.fields.priority).deep.equal({
      name: linearCard.priority.toString(),
    });
  });
});
