import { expect } from "chai";
import "mocha";
import sinon from "sinon";
import linearCards from "../../../fixture/LinearCards";
import linearCardHistory from "../../../fixture/LinearCardsHistory";
import { StoryPointsAndCycleTimeRequest } from "../../../../src/contract/kanban/KanbanStoryPointParameterVerify";
import { Linear } from "../../../../src/services/kanban/Linear/Linear";
import { LinearClient } from "@linear/sdk";

describe("get story points and cycle times of done cards during period", () => {
  let linear: Linear;
  before(() => {
    linear = new Linear("test token");
    // eslint-disable-next-line
    const WorkDayCalculate = require("../../../../src/services/common/WorkDayCalculate");
    sinon.stub(WorkDayCalculate, "calculateWorkDaysBy24Hours").returns(0.5);
    sinon
      .stub(LinearClient.prototype, "issues")
      .returns(Promise.resolve(linearCards as any));
    sinon.replace(
      linearCards.nodes[0],
      "history",
      sinon.fake.returns(Promise.resolve(linearCardHistory as any))
    );
    sinon.replace(
      linearCards.nodes[1],
      "history",
      sinon.fake.returns(Promise.resolve(linearCardHistory as any))
    );
  });
  after(() => {
    sinon.restore();
  });
  const storyPointsAndCycleTimeRequest = new StoryPointsAndCycleTimeRequest(
    "testToken",
    "jira",
    "domain",
    "project",
    2,
    ["Done"],
    1636439702020,
    1636439704020,
    [
      {
        key: "customfield_10016",
        name: "Story point estimate",
        flag: true,
      },
    ],
    false
  );

  it("should return story points and cycle time when having matched cards", async () => {
    const response = await linear.getStoryPointsAndCycleTime(
      storyPointsAndCycleTimeRequest,
      [],
      ["test"]
    );
    expect(response.storyPointSum).equal(3);
    expect(response.matchedCards[0].cycleTime).deep.equal([
      {
        column: "IN PROGRESS",
        day: 0.5,
      },
      {
        column: "DONE",
        day: 0.5,
      },
    ]);
    sinon.restore();
  });
});
