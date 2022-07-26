import { expect } from "chai";
import "mocha";
import sinon from "sinon";
import { Jira } from "../../../../src/services/kanban/Jira/Jira";
import { mock } from "../../../TestTools";
import JiraCards from "../../../fixture/JiraCards.json";
import Sprints from "../../../fixture/Sprints.json";
import EmptySprints from "../../../fixture/EmptySprints.json";
import JiraCardCycleTime from "../../../fixture/JiraCardCycleTime.json";
import { StoryPointsAndCycleTimeRequest } from "../../../../src/contract/kanban/KanbanStoryPointParameterVerify";
import { CycleTimeInfo } from "../../../../src/contract/kanban/KanbanStoryPointResponse";
import { Sprint } from "../../../../src/models/kanban/Sprint";

const jira = new Jira("testToken", "domain");

describe("get story points and cycle times of done cards during period", () => {
  const storyPointsAndCycleTimeRequest = new StoryPointsAndCycleTimeRequest(
    "testToken",
    "jira",
    "domain",
    "project",
    "2",
    ["Done"],
    1589080044000,
    1589944044000,
    [
      {
        key: "customfield_10016",
        name: "Story point estimate",
        flag: true,
      },
    ],
    false
  );

  it("should return story points when having matched cards", async () => {
    sinon.stub(Jira, "getCycleTimeAndAssigneeSet").returns(
      Promise.resolve({
        cycleTimeInfos: Array.of<CycleTimeInfo>(),
        assigneeSet: new Set<string>(["Test User"]),
        originCycleTimeInfos: Array.of<CycleTimeInfo>(),
      })
    );
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=status in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`
      )
      .reply(200, JiraCards);

    const response = await jira.getStoryPointsAndCycleTime(
      storyPointsAndCycleTimeRequest,
      [],
      ["Test User"]
    );
    expect(response.storyPointSum).deep.equal(3);
    sinon.restore();
  });

  it("should filter cards by selected user", async () => {
    sinon.stub(Jira, "getCycleTimeAndAssigneeSet").returns(
      Promise.resolve({
        cycleTimeInfos: Array.of<CycleTimeInfo>(),
        assigneeSet: new Set<string>([]),
        originCycleTimeInfos: Array.of<CycleTimeInfo>(),
      })
    );
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql= status in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`
      )
      .reply(200, JiraCards);

    const response = await jira.getStoryPointsAndCycleTime(
      storyPointsAndCycleTimeRequest,
      [],
      []
    );
    expect(response.storyPointSum).deep.equal(0);
    sinon.restore();
  });

  it("should return cycle time when having matched cards", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const WorkDayCalculate = require("../../../../src/services/common/WorkDayCalculate");
    sinon.stub(WorkDayCalculate, "calculateWorkDaysBy24Hours").returns(0.5);

    const jiraCardKey = "ADM-50";
    mock
      .onGet(
        `https://${storyPointsAndCycleTimeRequest.site}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed`
      )
      .reply(200, JiraCardCycleTime);

    const response: {
      cycleTimeInfos: CycleTimeInfo[];
    } = await Jira.getCycleTimeAndAssigneeSet(
      jiraCardKey,
      storyPointsAndCycleTimeRequest.token,
      storyPointsAndCycleTimeRequest.site,
      false
    );

    const cycleTime = Array.of(
      new CycleTimeInfo("BACKLOG", 0.5),
      new CycleTimeInfo("DOING", 0.5),
      new CycleTimeInfo("DONE", 0.5)
    );

    expect(response.cycleTimeInfos).deep.equal(cycleTime);
    sinon.restore();
  });
});

describe("get sprints data by domain name and boardId", () => {
  const storyPointsAndCycleTimeRequest = new StoryPointsAndCycleTimeRequest(
    "testToken",
    "jira",
    "domain",
    "project",
    "2",
    ["Done"],
    1589080044000,
    1589944044000,
    [
      {
        key: "customfield_10016",
        name: "Story point estimate",
        flag: true,
      },
    ],
    false
  );

  it("should return all the sprints when has sprints", async () => {
    const expected = [
      new Sprint(
        1,
        "closed",
        "ADM Sprint 1",
        "2020-05-26T03:20:43.632Z",
        "2020-06-09T03:20:37.000Z",
        "2020-07-22T01:46:20.917Z"
      ),
      new Sprint(
        4,
        "active",
        "ADM Sprint 2",
        "2020-07-22T01:48:39.455Z",
        "2020-08-05T01:48:37.000Z"
      ),
      new Sprint(9, "future", "ADM Sprint 5"),
    ];

    mock
      .onGet(
        `https://${storyPointsAndCycleTimeRequest.site}.atlassian.net/rest/agile/1.0/board/${storyPointsAndCycleTimeRequest.boardId}/sprint`
      )
      .reply(200, Sprints);

    expect(
      await jira.getAllSprintsByBoardId(storyPointsAndCycleTimeRequest)
    ).deep.equal(expected);
  });

  it("should return empty when no sprints", async () => {
    mock
      .onGet(
        `https://${storyPointsAndCycleTimeRequest.site}.atlassian.net/rest/agile/1.0/board/${storyPointsAndCycleTimeRequest.boardId}/sprint`
      )
      .reply(200, EmptySprints);

    expect(
      await jira.getAllSprintsByBoardId(storyPointsAndCycleTimeRequest)
    ).deep.equal([]);
  });
});
