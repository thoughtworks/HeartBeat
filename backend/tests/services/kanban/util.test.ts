import { expect } from "chai";
import "mocha";
import {
  confirmThisCardHasAssignedBySelectedUser,
  getCardTimeForEachStep,
  getThisStepCostTime,
  reformTimeLineForFlaggedCards,
  sortStatusChangedArray,
  StatusChangedArrayItem, transformLinearCardToJiraCard
} from "../../../src/services/kanban/util";
import sinon from "sinon";
import {CycleTimeInfo} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import linearCards from "../../fixture/LinearCards";
import {Issue} from "@linear/sdk";

const statusChangedArrayInTimeOrder = [
  {
    timestamp: 	1628227640000,
    status: "To do",
  },
  {
    timestamp: 	1630906040000,
    status: "In Dev",
  },
  {
    timestamp: 	1633498040000,
    status: "Review",
  },
  {
    timestamp: 	1636176440000,
    status: "Done",
  },
] as StatusChangedArrayItem[];

const statusChangedArrayNotInTimeOrder = [
  {
    timestamp: 	1636176440000,
    status: "Done",
  },
  {
    timestamp: 	1630906040000,
    status: "In Dev",
  },
  {
    timestamp: 	1628227640000,
    status: "To do",
  },
  {
    timestamp: 	1633498040000,
    status: "Review",
  },
] as StatusChangedArrayItem[];

const statusChangedArrayContainingFlaggedItem = [
  {
    timestamp: 	1628227640000,
    status: "To do",
  },
  {
    timestamp: 	1630906040000,
    status: "In Dev",
  },
  {
    timestamp: 	1633498040000,
    status: "FLAG",
  },
  {
    timestamp: 	1636176440000,
    status: "Done",
  },
] as StatusChangedArrayItem[];

sinon.stub(Date, "now").returns(new Date("2021-11-10").getTime());

describe("utils", () => {
  it("getThisStepCostTime", () => {
    const inDevCostTime = getThisStepCostTime(1, statusChangedArrayInTimeOrder);
    const doneCostTime = getThisStepCostTime(3, statusChangedArrayInTimeOrder);

    expect(inDevCostTime).equal(22);
    expect(doneCostTime).equal(2.33);
  });

  it("getCardTimeForEachStep", () => {
    const cardTimeForEachStep = getCardTimeForEachStep(statusChangedArrayInTimeOrder, statusChangedArrayInTimeOrder);

    expect(cardTimeForEachStep).to.have.deep.members([
      { column: "TO DO", day: 21 },
      { column: "IN DEV", day: 22 },
      { column: "REVIEW", day: 22.44 },
      { column: "DONE", day: 2.33 }
    ] as CycleTimeInfo[]);
  });

  it("sortStatusChangedArray", () => {
    const sortedStatusChangedArray = sortStatusChangedArray(statusChangedArrayNotInTimeOrder);

    expect(sortedStatusChangedArray).to.have.deep.members([
      { timestamp: 1628227640000, status: "To do" },
      { timestamp: 1630906040000, status: "In Dev" },
      { timestamp: 1633498040000, status: "Review" },
      { timestamp: 1636176440000, status: "Done" }
    ]);
  });

  it("reformTimeLineForFlaggedCards", () => {
    const reformedStatusChangedArray = reformTimeLineForFlaggedCards(statusChangedArrayContainingFlaggedItem);

    expect(reformedStatusChangedArray).to.have.deep.members(
        [
          { timestamp: 1628227640000, status: "To do" },
          { timestamp: 1630906040000, status: "In Dev" },
          { timestamp: 1633498040000, status: "FLAG" }
        ]);
  });

  it("confirmThisCardHasAssignedBySelectedUser", () => {
    const selectedUsers: string[] = ["testUser1", "testUser2", "testUser2", "testUser3"];
    const cardIncludedUsers: Set<string> = new Set<string>();
    cardIncludedUsers.add("testUser1");
    const ifThisCardHasAssignedBySelectedUser = confirmThisCardHasAssignedBySelectedUser(selectedUsers, cardIncludedUsers);

    expect(ifThisCardHasAssignedBySelectedUser).equal(true);
  });

  it("transformLinearCardToJiraCard", async () => {
    const linearCard = linearCards.nodes[0] as unknown as Issue;
    const jiraCard = await transformLinearCardToJiraCard(linearCard);

    expect(jiraCard.key).equal(linearCard.identifier);
    expect(jiraCard.fields.status).equal(undefined);
    expect(jiraCard.fields.priority).deep.equal({ name: linearCard.priority.toString() });
  });
});
