import { expect } from "chai";
import "mocha";
import sinon from "sinon";
import linearCards from "../../../fixture/LinearCards";
import linearCardHistory from "../../../fixture/LinearCardsHistory";
import linearWorkflowStates from "../../../fixture/LinearWorkflowStates";
import { StoryPointsAndCycleTimeRequest } from "../../../../src/contract/kanban/KanbanStoryPointParameterVerify";
import { Linear } from "../../../../src/services/kanban/Linear/Linear";
import { LinearClient } from "@linear/sdk";
import { LinearVerifyToken } from "../../../../src/services/kanban/Linear/LinearVerifyToken";
import { KanbanTokenVerifyModel } from "../../../../src/contract/kanban/KanbanTokenVerify";
import {
  IssueConnection,
  LinearFetch,
  Team,
  WorkflowStateConnection,
} from "@linear/sdk/dist/_generated_sdk";
import { linearTeam } from "../../../fixture/LinearTeam";
import WorkDayCalculate from "../../../../src/services/common/WorkDayCalculate";

describe("get story points and cycle times of done cards during period", () => {
  let linear: Linear;
  before(() => {
    linear = new Linear("test token");
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
    "2",
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

describe("verify token and return columns and users for Linear", async function () {
  before(() => {
    sinon
      .stub(LinearClient.prototype, "issues")
      .returns(Promise.resolve((linearCards as unknown) as IssueConnection));
    sinon
      .stub(LinearClient.prototype, "team")
      .returns(Promise.resolve((linearTeam as unknown) as LinearFetch<Team>));
    sinon
      .stub(LinearClient.prototype, "workflowStates")
      .returns(
        Promise.resolve(
          (linearWorkflowStates as unknown) as WorkflowStateConnection
        )
      );
  });
  after(() => {
    sinon.restore();
  });
  it("should return KanbanTokenVerifyResponse", async function () {
    const linearVerifyToken = new LinearVerifyToken("test apikey");
    const res = await linearVerifyToken.verifyTokenAndGetColumnsAndUser(
      new KanbanTokenVerifyModel(
        "test apikey",
        "yingkai-fan",
        "projectKey",
        "testName",
        "testId",
        "linear",
        1633046400000,
        1640660806109,
        "test-project-1"
      )
    );
    expect(res.jiraColumns).deep.equal([
      {
        key: "started",
        value: {
          name: "In Progress",
          statuses: ["started"],
        },
      },
      {
        key: "unstarted",
        value: {
          name: "Todo",
          statuses: ["unstarted"],
        },
      },
      {
        key: "completed",
        value: {
          name: "Done",
          statuses: ["completed"],
        },
      },
      {
        key: "canceled",
        value: {
          name: "Canceled",
          statuses: ["canceled"],
        },
      },
      {
        key: "backlog",
        value: {
          name: "Backlog",
          statuses: ["backlog"],
        },
      },
    ]);
    expect(res.targetFields).deep.equal([
      { key: "Status", name: "Status", flag: false },
      { key: "Priority", name: "Priority", flag: false },
      { key: "Assignee", name: "Assignee", flag: false },
      { key: "Estimate", name: "Estimate", flag: false },
      { key: "Labels", name: "Labels", flag: false },
    ]);
    expect(res.users).deep.equal(["Yingkai Fan"]);
  });
});
