import { expect } from "chai";
import "mocha";
import sinon from "sinon";
import { Jira } from "../../../../src/services/kanban/Jira/Jira";
import { mock } from "../../../TestTools";
import JiraCards from "../../../fixture/JiraCards.json";
import NonDoneJiraCard from "../../../fixture/NonDoneJiraCard.json";
import Sprints from "../../../fixture/Sprints.json";
import ColumnResponse from "../../../fixture/ColumnResponse.json";
import EmptySprints from "../../../fixture/EmptySprints.json";
import JiraCardCycleTime from "../../../fixture/JiraCardCycleTime.json";
import NonDoneJiraCardCycleTime from "../../../fixture/NonDoneJiraCardCycleTime.json";
import StatusData from "../../../fixture/StatusData.json";
import { StoryPointsAndCycleTimeRequest } from "../../../../src/contract/kanban/KanbanStoryPointParameterVerify";
import { Sprint } from "../../../../src/models/kanban/Sprint";
import { CycleTimeInfo } from "../../../../src/contract/kanban/KanbanStoryPointResponse";
import { StatusSelf } from "../../../../src/models/kanban/JiraBoard/StatusSelf";
import { StatusCategory } from "../../../../src/models/kanban/JiraBoard/StatusSelf";

import axios from "axios";
import {
  HistoryDetail,
  JiraCardHistory,
  Status,
} from "../../../../src/models/kanban/JiraCardHistory";

const jira = new Jira("testToken", "domain");
const jiraTest = Object.getPrototypeOf(jira);
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

  it("should return all the sprints", async () => {
    const expected = [sprint1, sprint2, sprint3];

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

describe("get Columns data by domain name and boardId", () => {
  afterEach(() => sinon.restore());
  const storyPointsAndCycleTimeRequest = new StoryPointsAndCycleTimeRequest(
    "testToken",
    "jira",
    "dorametrics",
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

  it("should return all columns data", async () => {
    const statusCategory = new StatusCategory("indeterminate", "In Progress");
    const statusSelf: StatusSelf = new StatusSelf(
      "https://dorametrics.atlassian.net/rest/api/2/status/10006",
      "TODO",
      "TODO",
      statusCategory
    );

    sinon.stub(Jira, <any>"queryStatus").callsFake(() => statusSelf);

    const expected = [
      {
        key: "indeterminate",
        value: {
          name: "TODO",
          statuses: ["TODO"],
        },
      },
      {
        key: "indeterminate",
        value: {
          name: "Blocked",
          statuses: ["TODO"],
        },
      },
      {
        key: "indeterminate",
        value: {
          name: "Doing",
          statuses: ["TODO"],
        },
      },
      {
        key: "indeterminate",
        value: {
          name: "Testing",
          statuses: ["TODO"],
        },
      },
      {
        key: "indeterminate",
        value: {
          name: "Done",
          statuses: ["TODO", "TODO"],
        },
      },
    ];
    mock
      .onGet(
        `https://${storyPointsAndCycleTimeRequest.site}.atlassian.net/rest/agile/1.0/board/${storyPointsAndCycleTimeRequest.boardId}/configuration`,
        {
          headers: { Authorization: `${storyPointsAndCycleTimeRequest.token}` },
        }
      )
      .reply(200, ColumnResponse);

    expect(await jira.getColumns(storyPointsAndCycleTimeRequest)).deep.equal(
      expected
    );
  });
});

describe("get query status", () => {
  afterEach(() => sinon.restore());
  it("should return query status data", async () => {
    mock
      .onGet(`https://domain.atlassian.net/rest/api/2/status/10006`, {
        headers: { Authorization: `testToken` },
      })
      .reply(200, StatusData);
    const result: StatusSelf = await jiraTest.constructor.queryStatus(
      "https://domain.atlassian.net/rest/api/2/status/10006",
      `testToken`
    );
    expect(result.statusCategory.key).equal("indeterminate");
  });
});

describe("get story points and cycle times of done cards during period", () => {
  afterEach(() => sinon.restore());
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
    expect(response.storyPointSum).deep.equal(6);
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
  });
});

describe("get story points and cycle times of non done cards during period", () => {
  afterEach(() => sinon.restore());
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

  it("should return story points when having matched non done cards", async () => {
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
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=sprint in openSprints() AND status not in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`
      )
      .reply(200, NonDoneJiraCard);

    const response = await jira.getStoryPointsAndCycleTimeForNonDoneCards(
      storyPointsAndCycleTimeRequest,
      [],
      ["Test User"]
    );

    expect(response.storyPointSum).deep.equal(2);
  });

  it("should return cycle time when having matched  non done cards", async () => {
    const WorkDayCalculate = require("../../../../src/services/common/WorkDayCalculate");
    sinon.stub(WorkDayCalculate, "calculateWorkDaysBy24Hours").returns(0.5);

    const jiraCardKey = "ADM-224";
    mock
      .onGet(
        `https://${storyPointsAndCycleTimeRequest.site}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed`
      )
      .reply(200, NonDoneJiraCardCycleTime);

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
      new CycleTimeInfo("TODO", 0.5),
      new CycleTimeInfo("DOING", 0.5)
    );

    expect(response.cycleTimeInfos).deep.equal(cycleTime);
  });
});

describe("get all done cards", () => {
  afterEach(() => sinon.restore());
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

  it("should return all done cards", async () => {
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=status in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`,
        {
          headers: { Authorization: `${storyPointsAndCycleTimeRequest.token}` },
        }
      )
      .reply(200, JiraCards);

    jiraTest.httpClient = axios.create({
      baseURL: `https://domain.atlassian.net/rest/agile/1.0/board`,
    });
    jiraTest.httpClient.defaults.headers.common["Authorization"] = "testToken";
    jiraTest.queryCount = 100;
    const response = await jiraTest.getAllDoneCards(
      storyPointsAndCycleTimeRequest
    );

    expect(response.length).deep.equal(2);
  });
});

describe("get all non done cards for active sprint", () => {
  afterEach(() => sinon.restore());
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

  it("should return all non done cards for active sprint", async () => {
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=sprint in openSprints() AND status not in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`,
        {
          headers: { Authorization: `${storyPointsAndCycleTimeRequest.token}` },
        }
      )
      .reply(200, NonDoneJiraCard);

    jiraTest.httpClient = axios.create({
      baseURL: `https://domain.atlassian.net/rest/agile/1.0/board`,
    });
    jiraTest.httpClient.defaults.headers.common["Authorization"] = "testToken";
    jiraTest.queryCount = 100;
    const response = await jiraTest.getAllNonDoneCardsForActiveSprint(
      storyPointsAndCycleTimeRequest
    );

    expect(response.length).deep.equal(1);
  });
});
describe("get all non done cards for kanban", () => {
  afterEach(() => sinon.restore());
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

  it("should return all non done cards for kanban", async () => {
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=status not in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`,
        {
          headers: { Authorization: `${storyPointsAndCycleTimeRequest.token}` },
        }
      )
      .reply(200, JiraCards);

    jiraTest.httpClient = axios.create({
      baseURL: `https://domain.atlassian.net/rest/agile/1.0/board`,
    });
    jiraTest.httpClient.defaults.headers.common["Authorization"] = "testToken";
    jiraTest.queryCount = 100;
    const response = await jiraTest.getAllNonDoneCardsForKanBan(
      storyPointsAndCycleTimeRequest
    );

    expect(response.length).deep.equal(0);
  });
});

describe("process costumed fields for card", () => {
  afterEach(() => sinon.restore());
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

  it("should return card", async () => {
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=status not in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`,
        {
          headers: { Authorization: `${storyPointsAndCycleTimeRequest.token}` },
        }
      )
      .reply(200, JiraCards);

    const response = await jiraTest.constructor.processCustomFieldsForCard(
      JiraCards
    );

    expect(response.issues.length).deep.equal(2);
  });
});

describe("generate sprint name", () => {
  afterEach(() => sinon.restore());
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
  const sprintField = [
    {
      id: 1,
      self: "https://dorametrics.atlassian.net/rest/agile/1.0/sprint/1",
      state: "closed",
      name: "ADM Sprint 1",
      startDate: "2020-05-26T03:20:43.632Z",
      endDate: "2020-06-09T03:20:37.000Z",
      completeDate: "2020-07-22T01:46:20.917Z",
      originBoardId: 2,
      goal: "",
    },
    {
      id: 4,
      self: "https://dorametrics.atlassian.net/rest/agile/1.0/sprint/4",
      state: "closed",
      name: "ADM Sprint 2",
      startDate: "2020-07-22T01:48:39.455Z",
      endDate: "2020-08-05T01:48:37.000Z",
      completeDate: "2020-07-22T01:49:26.508Z",
      originBoardId: 2,
      goal: "",
    },
    {
      id: 7,
      self: "https://dorametrics.atlassian.net/rest/agile/1.0/sprint/7",
      state: "closed",
      name: "ADM Sprint 3",
      startDate: "2020-07-27T02:38:07.710Z",
      endDate: "2020-08-10T02:38:04.000Z",
      completeDate: "2022-07-20T06:09:05.498Z",
      originBoardId: 2,
      goal: "",
    },
  ];

  it("should return sprint name when given a correct sprintField", () => {
    const expected = "ADM Sprint 3";

    const response = jiraTest.constructor.generateSprintName(sprintField);

    expect(response).deep.equal(expected);
  });
  it("should return sprint name when given an empty sprintField", () => {
    const expected = "";
    const empty: any = [];
    const response = jiraTest.constructor.generateSprintName(empty);

    expect(response).deep.equal(expected);
  });
});

describe("get cycle time and assignee set", () => {
  afterEach(() => sinon.restore());
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

  it("should return cycle time and assigneeset", async () => {
    const jiraCardKey = "ADM-50";
    mock
      .onGet(
        `https://${storyPointsAndCycleTimeRequest.site}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed
      )}')`,
        {
          headers: { Authorization: `${storyPointsAndCycleTimeRequest.token}` },
        }
      )
      .reply(200, JiraCardCycleTime);

    const response = await Jira.getCycleTimeAndAssigneeSet(
      jiraCardKey,
      storyPointsAndCycleTimeRequest.token,
      storyPointsAndCycleTimeRequest.site,
      true
    );

    expect(response.cycleTimeInfos.length).equal(3);
  });
});

describe("put status change events into an array", () => {
  it("should return the StatusChangedArrayItem ", () => {
    const historyDetail1: HistoryDetail = new HistoryDetail(
      "status",
      1589252603589,
      new Status("Backlog"),
      new Status("Doing")
    );
    const historyDetail2: HistoryDetail = new HistoryDetail(
      "status",
      1589337149222,
      new Status("Doing"),
      new Status("Done")
    );
    const jiraCardHistory: JiraCardHistory = new JiraCardHistory([
      historyDetail1,
      historyDetail2,
    ]);
    const response = jiraTest.constructor.putStatusChangeEventsIntoAnArray(
      jiraCardHistory,
      true
    );

    expect(response.length).equal(3);
  });
});

describe("get match time", () => {
  it("should return true when given time in the time period", () => {
    const cardTime = "11 Jul 2023 20:54:04 GMT";
    const startTime = 1689080044000;
    const endTime = 1789944044000;

    const response = jiraTest.constructor.matchTime(
      cardTime,
      startTime,
      endTime
    );

    expect(response).equal(true);
  });
  it("should return false when given time not  in the time period", () => {
    const cardTime = "11 Jul 2010 20:54:04 GMT";
    const startTime = 1689080044000;
    const endTime = 1789944044000;

    const response = jiraTest.constructor.matchTime(
      cardTime,
      startTime,
      endTime
    );

    expect(response).equal(false);
  });
});

describe("make page query", () => {
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

  it("should return cards issues ", async () => {
    const total = 123;
    const jql = `status in ('${storyPointsAndCycleTimeRequest.status.join(
      "','"
    )}')`;

    const cards: any = [];
    jiraTest.queryCount = 100;
    jiraTest.httpClient = axios.create({
      baseURL: `https://domain.atlassian.net/rest/agile/1.0/board`,
    });
    jiraTest.httpClient.defaults.headers.common["Authorization"] = "testToken";
    mock
      .onGet(
        `https://${
          storyPointsAndCycleTimeRequest.site
        }.atlassian.net/rest/agile/1.0/board/2/issue/?maxResults=100&startAt=100&jql=status in ('${storyPointsAndCycleTimeRequest.status.join(
          "','"
        )}')`
      )
      .reply(200, JiraCards);
    await jiraTest.pageQuerying(total, jql, cards, 2);
    expect(cards.length).equal(2);
  });
});
