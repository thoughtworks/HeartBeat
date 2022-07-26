import { expect } from "chai";
import sinon from "sinon";
import { mock } from "../../TestTools";
import { RequestKanbanColumnSetting } from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import { StoryPointsAndCycleTimeRequest } from "../../../src/contract/kanban/KanbanStoryPointParameterVerify";
import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import { JiraCard, JiraCardField } from "../../../src/models/kanban/JiraCard";
import { Jira } from "../../../src/services/kanban/Jira/Jira";
import "mocha";
import { GenerateSprintReporterService } from "../../../src/services/GenerateReporter/GenerateSprintReporterService";
import JiraCards from "../../fixture/JiraCards.json";
import { Sprint } from "../../../src/models/kanban/Sprint";

const service = new GenerateSprintReporterService();
const jira = new Jira("testToken", "domain");
const emptyJiraCardField: JiraCardField = new JiraCardField();

describe("generate Kanban reporter service", () => {
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
  it("should map cards by iteration", async () => {
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

    const cards = response.matchedCards;
    const map = service.mapCardsByIteration(cards);
    expect(map).deep.equal(
      new Map<string, JiraCardResponse[]>([
        ["test Sprint 1", [cards[0]]],
        ["test Sprint 2", [cards[1]]],
      ])
    );

    sinon.restore();
  });

  it("should return blocked percentage given cards", async () => {
    const emptyJiraCard: JiraCard = { fields: emptyJiraCardField, key: "" };

    const cycleTimeArray: CycleTimeInfo[] = [
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
      new JiraCardResponse(emptyJiraCard, cycleTimeArray),
      new JiraCardResponse(emptyJiraCard, cycleTimeArray2),
    ];
    const boardColumns: RequestKanbanColumnSetting[] = [
      { name: "DOING", value: "In Dev" },
      { name: "WAIT", value: "Waiting for testing" },
      { name: "TEST", value: "Testing" },
      { name: "BLOCKED", value: "Block" },
      { name: "REVIEW", value: "Review" },
    ];

    const blockedPercentage = service.calculateCardsBlockedPercentage(
      cards,
      boardColumns
    );
    expect(blockedPercentage).equal(0.25);

    sinon.restore();
  });

  it("should return blocked percentage given iteration hashmap", async () => {
    const emptyJiraCard: JiraCard = { fields: emptyJiraCardField, key: "" };

    const cycleTimeArray: CycleTimeInfo[] = [
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

    const mapIterationCards = new Map<string, JiraCardResponse[]>([
      ["test Sprint 1", [new JiraCardResponse(emptyJiraCard, cycleTimeArray)]],
      ["test Sprint 2", [new JiraCardResponse(emptyJiraCard, cycleTimeArray2)]],
    ]);
    const boardColumns: RequestKanbanColumnSetting[] = [
      { name: "DOING", value: "In Dev" },
      { name: "WAIT", value: "Waiting for testing" },
      { name: "TEST", value: "Testing" },
      { name: "BLOCKED", value: "Block" },
      { name: "REVIEW", value: "Review" },
    ];

    const map = service.calculateIterationBlockedAndDevelopingPercentage(
      mapIterationCards,
      boardColumns
    );
    expect(map).deep.equal(
      new Map<string, any>([
        [
          "test Sprint 1",
          { blockedPercentage: 0.26, developingPercentage: 0.74 },
        ],
        [
          "test Sprint 2",
          { blockedPercentage: 0.25, developingPercentage: 0.75 },
        ],
      ])
    );

    sinon.restore();
  });
  it("should sort the percentages by sprint completed time", async () => {
    const map = new Map<string, any>([
      [
        "test Sprint 1",
        { blockedPercentage: 0.26, developingPercentage: 0.74 },
      ],
      [
        "test Sprint 2",
        { blockedPercentage: 0.25, developingPercentage: 0.75 },
      ],
      ["test Sprint 4", { blockedPercentage: 0.7, developingPercentage: 0.3 }],
    ]);
    const sprints: Sprint[] = [
      new Sprint(
        1,
        "closed",
        "test Sprint 1",
        "2020-07-26T03:20:43.632Z",
        "2020-06-09T03:20:37.000Z",
        "2020-07-23T01:50:20.917Z"
      ),
      new Sprint(
        2,
        "closed",
        "test Sprint 2",
        "2020-07-22T01:48:39.455Z",
        "2020-08-05T01:48:37.000Z",
        "2020-07-22T01:49:26.508Z"
      ),
      new Sprint(
        3,
        "closed",
        "test Sprint 3",
        "2020-07-22T01:48:39.455Z",
        "2020-08-05T01:48:37.000Z",
        "2020-07-22T01:49:26.508Z"
      ),
      new Sprint(4, "active", "test Sprint 4", "2020-08-26T03:20:43.632Z"),
      new Sprint(5, "future", "test Sprint 5"),
    ];

    const sortedPercentage = service.sortBySprintStartDate(map, sprints);
    expect(sortedPercentage).deep.equal(
      new Map<string, any>([
        [
          "test Sprint 2",
          { blockedPercentage: 0.25, developingPercentage: 0.75 },
        ],
        [
          "test Sprint 1",
          { blockedPercentage: 0.26, developingPercentage: 0.74 },
        ],
        [
          "test Sprint 4",
          { blockedPercentage: 0.7, developingPercentage: 0.3 },
        ],
      ])
    );

    sinon.restore();
  });
});
