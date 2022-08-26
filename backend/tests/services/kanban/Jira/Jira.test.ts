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
import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../../src/contract/kanban/KanbanStoryPointResponse";
import { StatusSelf } from "../../../../src/models/kanban/JiraBoard/StatusSelf";
import { StatusCategory } from "../../../../src/models/kanban/JiraBoard/StatusSelf";
import axios from "axios";
import {
  HistoryDetail,
  JiraCardHistory,
  Status,
} from "../../../../src/models/kanban/JiraBoard/JiraCardHistory";
import {
  JiraCard,
  JiraCardField,
} from "../../../../src/models/kanban/JiraBoard/JiraCard";
import { JiraBlockReasonEnum } from "../../../../src/models/kanban/JiraBoard/JiraBlockReasonEnum";
import {
  CardCycleTime,
  StepsDay,
} from "../../../../src/models/kanban/CardCycleTime";
import {
  BlockedReason,
  SprintCycleTimeAndBlockedTime,
  SprintStatistics,
} from "../../../../src/models/kanban/SprintStatistics";
import * as WorkDayCalculate from "../../../../src/services/common/WorkDayCalculate";

const jira = new Jira("testToken", "domain");
const jiraTest = Object.getPrototypeOf(jira);

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

jiraCardField1.sprint = sprint1Name;
jiraCardField1.label = JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK;

jiraCardField2.sprint = sprint2Name;
jiraCardField2.label = JiraBlockReasonEnum.TAKE_LEAVE;

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

describe("get sprints data by domain name and boardId", () => {
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
      .onGet("https://domain.atlassian.net/rest/api/2/status/10006", {
        headers: { Authorization: "testToken" },
      })
      .reply(200, StatusData);
    const result: StatusSelf = await jiraTest.constructor.queryStatus(
      "https://domain.atlassian.net/rest/api/2/status/10006",
      "testToken"
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
      baseURL: "https://domain.atlassian.net/rest/agile/1.0/board",
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
      baseURL: "https://domain.atlassian.net/rest/agile/1.0/board",
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
      baseURL: "https://domain.atlassian.net/rest/agile/1.0/board",
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
      baseURL: "https://domain.atlassian.net/rest/agile/1.0/board",
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

describe("map cards by sprint name", () => {
  const jiraCardField1: JiraCardField = new JiraCardField();
  const jiraCardField2: JiraCardField = new JiraCardField();
  const jiraCard1: JiraCard = { fields: jiraCardField1, key: "" };
  const jiraCard2: JiraCard = { fields: jiraCardField2, key: "" };
  const card1 = new JiraCardResponse(jiraCard1, cycleTimeArray1);
  const card2 = new JiraCardResponse(jiraCard2, cycleTimeArray2);
  const cardList = [card1, card2];

  it("should return a map when all cards have sprint names", () => {
    jiraCardField1.sprint = sprint1Name;
    jiraCardField2.sprint = sprint2Name;

    const mapSprintCards = jiraTest.mapCardsBySprintName(cardList);

    expect(mapSprintCards).deep.equal(
      new Map<string, JiraCardResponse[]>([
        [sprint1Name, [card1]],
        [sprint2Name, [card2]],
      ])
    );
  });

  it("should return a map with one entry when a part of the cards have sprint names", () => {
    jiraCardField1.sprint = sprint1Name;
    jiraCardField2.sprint = "";

    const mapSprintCards = jiraTest.mapCardsBySprintName(cardList);

    expect(mapSprintCards).deep.equal(
      new Map<string, JiraCardResponse[]>([[sprint1Name, [card1]]])
    );
  });

  it("should return empty map when all cards do not have any sprint name", () => {
    jiraCardField1.sprint = "";
    jiraCardField2.sprint = "";

    const mapSprintCards = jiraTest.mapCardsBySprintName(cardList);

    expect(mapSprintCards).deep.equal(new Map<string, JiraCardResponse[]>());
  });

  it("should return empty map when the card list is empty", () => {
    const mapSprintCards = jiraTest.mapCardsBySprintName(emptyCardList);

    expect(mapSprintCards).deep.equal(new Map<string, JiraCardResponse[]>());
  });
});
describe("calculate cycleTime and blockedTime", () => {
  it("should return correct cycleTime and blockedTime when there are matched cards in sprint", () => {
    const cycleTimeAndBlockedTime =
      jiraTest.calculateTotalCycleTimeAndBlockedTime(mapSprintCards);
    const expected = [
      { sprintName: "test Sprint 1", cycleTime: 13.6, blockedTime: 3 },
      { sprintName: "test Sprint 2", cycleTime: 7, blockedTime: 2 },
      { sprintName: "test Sprint 3", cycleTime: 2, blockedTime: 1 },
    ];
    expect(cycleTimeAndBlockedTime).deep.equal(expected);
  });
  it("should return an empty array when there is no matched card in sprint", () => {
    const cycleTimeAndBlockedTime =
      jiraTest.calculateTotalCycleTimeAndBlockedTime(
        new Map<string, JiraCardResponse[]>()
      );
    const expected = new Array<SprintCycleTimeAndBlockedTime>();
    expect(cycleTimeAndBlockedTime).deep.equal(expected);
  });
});
describe("calculate percentage of different block reasons in the latest sprint", () => {
  it("should return correct blocked reason percentage when there are matched cards in sprint", () => {
    const blockedPercentageByReason = jiraTest.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      mapSprintCards
    );
    expect(blockedPercentageByReason[0].blockDetails[0].percentage).equal(0.07);
    expect(blockedPercentageByReason[0].blockDetails[6].percentage).equal(0.07);
    expect(blockedPercentageByReason[0].blockDetails[7].percentage).equal(0.07);
  });

  it("should return a empty array when there is no matched card in sprint", () => {
    const mapLatestSprintEmptyCards = new Map<string, JiraCardResponse[]>([
      [sprint1Name, emptyCardList],
      [sprint3Name, cardList3],
    ]);
    const blockedPercentageByReason = jiraTest.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      mapLatestSprintEmptyCards
    );

    expect(blockedPercentageByReason).deep.equal([]);
  });
});

describe("calculate standard deviation", () => {
  it("should return correct standard deviation and avgerage when there are matched cards in sprint", () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set(sprint1Name, { standardDeviation: 1.91, average: 4.53 });
    expected.set(sprint2Name, { standardDeviation: 1.5, average: 3.5 });
    expected.set(sprint3Name, { standardDeviation: 0, average: 2 });

    const mapSprintStandardDeviation =
      jiraTest.calculateStandardDeviation(mapSprintCards);

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });

  it("should return 0 when there is not any matched card in sprint", () => {
    const expected: Map<string, any> = new Map<string, any>();
    expected.set(sprint1Name, { standardDeviation: 0, average: 0 });

    const mapSprintStandardDeviation =
      jiraTest.calculateStandardDeviation(mapSprintEmptyCards);

    expect(mapSprintStandardDeviation).deep.equal(expected);
  });
});

describe("calculate blocked and developing percentage", () => {
  it("should return correct blocked and developing percentage when there are matched cards in sprint", () => {
    const mapIterationBlockedPercentage =
      jiraTest.calculateBlockedAndDevelopingPercentage(mapSprintCards);

    const expected: Map<string, any> = new Map<string, any>();
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
      jiraTest.calculateBlockedAndDevelopingPercentage(mapSprintEmptyCards);

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
      jiraTest.calculateCompletedCardsNumber(mapSprintCards);

    const expected: Map<string, number> = new Map<string, number>();
    expected.set(sprint1Name, 3);
    expected.set(sprint2Name, 2);

    expect(mapSprintCompletedCardsNumber).deep.equal(expected);
  });

  it("should return 0 when the cardList is empty", () => {
    const mapSprintCards = new Map<string, JiraCardResponse[]>([
      [sprint1Name, emptyCardList],
    ]);

    const mapSprintCompletedCardsNumber =
      jiraTest.calculateCompletedCardsNumber(mapSprintCards);
    const expected: Map<string, number> = new Map<string, number>();
    expected.set(sprint1Name, 0);

    expect(mapSprintCompletedCardsNumber).deep.equal(expected);
  });
});

describe("generate Jira sprint statistics", () => {
  it("should return the Jira sprint statistics when statistic data are not empty", () => {
    const sprintBlockReason = [
      {
        sprintName: sprint1Name,
        totalBlockedPercentage: 0.22,
        blockDetails: [
          {
            reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
            percentage: 0.05,
            time: 0,
          },
          {
            reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
            percentage: 0.15,
            time: 0,
          },
          {
            reasonName: JiraBlockReasonEnum.OTHERS,
            percentage: 0.02,
            time: 0,
          },
        ],
      },
      {
        sprintName: sprint2Name,
        totalBlockedPercentage: 0.29,
        blockDetails: [
          {
            reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
            percentage: 0.09,
            time: 0,
          },
          {
            reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
            percentage: 0.15,
            time: 0,
          },
          {
            reasonName: JiraBlockReasonEnum.OTHERS,
            percentage: 0.05,
            time: 0,
          },
        ],
      },
      {
        sprintName: sprint3Name,
        totalBlockedPercentage: 0.5,
        blockDetails: [
          {
            reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
            percentage: 0.35,
            time: 0,
          },
          {
            reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
            percentage: 0.15,
            time: 0,
          },
          {
            reasonName: JiraBlockReasonEnum.OTHERS,
            percentage: 0.05,
            time: 0,
          },
        ],
      },
    ];
    const cycleTimeAndBlockedTime = [
      { sprintName: sprint1Name, cycleTime: 1, blockedTime: 1 },
      { sprintName: sprint2Name, cycleTime: 2, blockedTime: 2 },
      { sprintName: sprint3Name, cycleTime: 3, blockedTime: 3 },
    ];
    const sprintBlockPercentageMap = new Map<string, any>([
      [sprint1Name, { blockedPercentage: 0.22, developingPercentage: 0.78 }],
      [
        sprint2Name,
        {
          blockedPercentage: 0.29,
          developingPercentage: 0.71,
        },
      ],
      [
        sprint3Name,
        {
          blockedPercentage: 0.5,
          developingPercentage: 0.5,
        },
      ],
    ]);
    const sprintStandardDeviationMap = new Map<string, any>([
      [sprint1Name, { standardDeviation: 1.91, average: 4.53 }],
      [sprint2Name, { standardDeviation: 1.5, average: 3.5 }],
      [sprint3Name, { standardDeviation: 0, average: 2 }],
    ]);
    const sprintCompletedCardsNumberMap = new Map<string, number>([
      [sprint1Name, 3],
      [sprint2Name, 2],
      [sprint3Name, 2],
    ]);

    const sprintStartistics = jiraTest.generateJiraSprintStatistics(
      sprintCompletedCardsNumberMap,
      sprintBlockPercentageMap,
      sprintStandardDeviationMap,
      sprintBlockReason,
      cycleTimeAndBlockedTime
    );

    const expected = new SprintStatistics(
      [
        { sprintName: sprint1Name, value: 3 },
        { sprintName: sprint2Name, value: 2 },
        { sprintName: sprint3Name, value: 2 },
      ],
      [
        {
          sprintName: sprint1Name,
          value: { standardDeviation: 1.91, average: 4.53 },
        },
        {
          sprintName: sprint2Name,
          value: { standardDeviation: 1.5, average: 3.5 },
        },
        {
          sprintName: sprint3Name,
          value: { standardDeviation: 0, average: 2 },
        },
      ],
      [
        {
          sprintName: sprint1Name,
          value: { blockedPercentage: 0.22, developingPercentage: 0.78 },
        },
        {
          sprintName: sprint2Name,
          value: {
            blockedPercentage: 0.29,
            developingPercentage: 0.71,
          },
        },
        {
          sprintName: sprint3Name,
          value: {
            blockedPercentage: 0.5,
            developingPercentage: 0.5,
          },
        },
      ],
      [
        {
          sprintName: sprint1Name,
          totalBlockedPercentage: 0.22,
          blockDetails: [
            {
              reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
              percentage: 0.05,
              time: 0,
            },
            {
              reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
              percentage: 0.15,
              time: 0,
            },
            {
              reasonName: JiraBlockReasonEnum.OTHERS,
              percentage: 0.02,
              time: 0,
            },
          ],
        },
        {
          sprintName: sprint2Name,
          totalBlockedPercentage: 0.29,
          blockDetails: [
            {
              reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
              percentage: 0.09,
              time: 0,
            },
            {
              reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
              percentage: 0.15,
              time: 0,
            },
            {
              reasonName: JiraBlockReasonEnum.OTHERS,
              percentage: 0.05,
              time: 0,
            },
          ],
        },
        {
          sprintName: sprint3Name,
          totalBlockedPercentage: 0.5,
          blockDetails: [
            {
              reasonName: JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK,
              percentage: 0.35,
              time: 0,
            },
            {
              reasonName: JiraBlockReasonEnum.TAKE_LEAVE,
              percentage: 0.15,
              time: 0,
            },
            {
              reasonName: JiraBlockReasonEnum.OTHERS,
              percentage: 0.05,
              time: 0,
            },
          ],
        },
      ],
      [
        { sprintName: sprint1Name, cycleTime: 1, blockedTime: 1 },
        { sprintName: sprint2Name, cycleTime: 2, blockedTime: 2 },
        { sprintName: sprint3Name, cycleTime: 3, blockedTime: 3 },
      ]
    );

    expect(sprintStartistics).deep.equal(expected);
  });
  it("should return the empty Jira sprint statistics when statistic data is empty", () => {
    const sprintBlockReason = new Array<BlockedReason>();
    const sprintBlockPercentageMap = new Map<string, any>();
    const sprintStandardDeviationMap = new Map<string, any>();
    const sprintCompletedCardsNumberMap = new Map<string, number>();
    const cycleTimeAndBlockedTime = new Array<SprintCycleTimeAndBlockedTime>();

    const sprintStatistics = jiraTest.generateJiraSprintStatistics(
      sprintCompletedCardsNumberMap,
      sprintBlockPercentageMap,
      sprintStandardDeviationMap,
      sprintBlockReason,
      cycleTimeAndBlockedTime
    );
    const expected = new SprintStatistics([], [], [], [], []);
    expect(sprintStatistics).deep.equal(expected);
  });
});

describe("sort sprints by sprint start date", () => {
  it("sort sprints by sprint start date", () => {
    const unorderedMap = new Map<string, JiraCardResponse[]>([
      [sprint1Name, cardList1],
      [sprint2Name, cardList2],
    ]);
    const excepted = new Map<string, JiraCardResponse[]>([
      [sprint2Name, cardList2],
      [sprint1Name, cardList1],
    ]);

    const orderedMap = jiraTest.sortBySprintStartDate(unorderedMap, sprints);
    expect(orderedMap).deep.equal(excepted);
  });
});
describe("get active and closed Sprints", () => {
  it("get active and closed Sprints", () => {
    const excepted = [activeSprint, closedSprint];
    const filteredSprints = jiraTest.getActiveAndClosedSprints(sprints);
    expect(filteredSprints).deep.equal(excepted);
  });
});

describe("get sprint statistics", () => {
  it("get sprint statistics", async () => {
    sinon.stub(Jira.prototype, <any>"getAllSprintsByBoardId").returns(sprints);
    const cards = { storyPointSum: 0, cardsNumber: 3, matchedCards: cardList1 };
    const expected = new SprintStatistics(
      [
        { sprintName: "test Sprint 2", value: 1 },
        { sprintName: "test Sprint 1", value: 1 },
      ],
      [
        {
          sprintName: "test Sprint 2",
          value: { standardDeviation: 0, average: 5 },
        },
        {
          sprintName: "test Sprint 1",
          value: { standardDeviation: 0, average: 2 },
        },
      ],
      [
        {
          sprintName: "test Sprint 2",
          value: { blockedPercentage: 0.2, developingPercentage: 0.8 },
        },
        {
          sprintName: "test Sprint 1",
          value: { blockedPercentage: 0.5, developingPercentage: 0.5 },
        },
      ],
      [
        {
          sprintName: sprint1Name,
          totalBlockedPercentage: 0.5,
          blockDetails: [
            { reasonName: "dependencies_not_work", percentage: 0.5, time: 1 },
            { reasonName: "sit_env_down", percentage: 0, time: 0 },
            { reasonName: "priority_change", percentage: 0, time: 0 },
            { reasonName: "solution_review", percentage: 0, time: 0 },
            { reasonName: "pr_review", percentage: 0, time: 0 },
            { reasonName: "question_to_be_answered", percentage: 0, time: 0 },
            { reasonName: "take_leave", percentage: 0, time: 0 },
            { reasonName: "others", percentage: 0, time: 0 },
          ],
        },
        {
          sprintName: sprint2Name,
          totalBlockedPercentage: 0.2,
          blockDetails: [
            { reasonName: "dependencies_not_work", percentage: 0, time: 0 },
            { reasonName: "sit_env_down", percentage: 0, time: 0 },
            { reasonName: "priority_change", percentage: 0, time: 0 },
            { reasonName: "solution_review", percentage: 0, time: 0 },
            { reasonName: "pr_review", percentage: 0, time: 0 },
            { reasonName: "question_to_be_answered", percentage: 0, time: 0 },
            { reasonName: "take_leave", percentage: 0.2, time: 1 },
            { reasonName: "others", percentage: 0, time: 0 },
          ],
        },
      ],
      [
        { sprintName: sprint1Name, cycleTime: 2, blockedTime: 1 },
        { sprintName: sprint2Name, cycleTime: 5, blockedTime: 1 },
      ]
    );
    const actual: SprintStatistics = await jira.getSprintStatistics(
      storyPointsAndCycleTimeRequest,
      cards
    );
    expect(expected).deep.equals(actual);
  });
});
