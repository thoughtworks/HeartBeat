import "mocha";
import sinon from "sinon";
import axios from "axios";
import { StatusSelf } from "../../../../src/models/kanban/JiraBoard/StatusSelf";
import { expect } from "chai";
import { KanbanTokenVerifyModel } from "../../../../src/contract/kanban/KanbanTokenVerify";
import { mock } from "../../../TestTools";
import JiraColumns from "../../../fixture/JiraColumns.json";
import JiraFields from "../../../fixture/JiraFields.json";
import StatusData from "../../../fixture/StatusData.json";

import ReadyForDevStatus from "../../../fixture/statuses/ReadyForDevStatus.json";
import InDevStatus from "../../../fixture/statuses/InDevStatus.json";
import BlockedStatus from "../../../fixture/statuses/BlockedStatus.json";
import InReviewStatus from "../../../fixture/statuses/InReviewStatus.json";
import ReadyForTestStatus from "../../../fixture/statuses/ReadyForTest.json";
import InTestStatus from "../../../fixture/statuses/InTest.json";
import DoneStatus from "../../../fixture/statuses/DoneStatus.json";
import InProductionStatus from "../../../fixture/statuses/InProductionStatus.json";

import JiraCardCycleTime from "../../../fixture/JiraCardCycleTime.json";
import JiraCards from "../../../fixture/JiraCards.json";
import {
  ColumnResponse,
  KanbanTokenVerifyResponse,
} from "../../../../src/contract/kanban/KanbanTokenVerifyResponse";
import { JiraVerifyToken } from "../../../../src/services/kanban/Jira/JiraVerifyToken";
import { IssueImportCreateClubhouseDocument } from "@linear/sdk/dist/_generated_documents";
import { StoryPointsAndCycleTimeRequest } from "../../../../src/contract/kanban/KanbanStoryPointParameterVerify";
import { NoCardsInDoneColumnError } from "../../../../src/errors/NoCardsInDoneColumnError";

const jiraVerifyToken = new JiraVerifyToken("testToken", "domain");
const jiraVerifyTokenProto = Object.getPrototypeOf(jiraVerifyToken);
const tokenVerifyModel = new KanbanTokenVerifyModel(
  "testToken",
  "domain",
  "ADM",
  "teamName",
  "teamId",
  "jira",
  1589010717000,
  1591471243000,
  "2"
);
const doneColumn = ["DONE", "CANCELLED"];
describe("verify token and return columns and users", async () => {
  it("should throw exception when token is invalid", async () => {
    mock.onGet(`/project/${tokenVerifyModel.projectKey}`).reply(401);
    expect(async () => {
      await jiraVerifyToken.verifyTokenAndGetColumnsAndUser(tokenVerifyModel);
    }).to.throw;
  });

  it("should return columns and users when token is valid", async () => {
    jiraVerifyTokenProto.httpClient = axios.create({
      baseURL: "https://site.atlassian.net/rest/api/2",
    });
    jiraVerifyTokenProto.httpClient.defaults.headers.common["Authorization"] =
      "test Token";
    mock
      .onGet(
        `https://${tokenVerifyModel.site}.atlassian.net/rest/agile/1.0/board/${tokenVerifyModel.boardId}/configuration`
      )
      .reply(200, JiraColumns);
    const statusSelf: StatusSelf = new StatusSelf(
      "https://dorametrics.atlassian.net/rest/api/2/status/10006",
      "TODO",
      "TODO",
      {
        key: "done",
        name: "完成",
      }
    );
    sinon.stub(JiraVerifyToken, <any>"queryStatus").callsFake(() => statusSelf);
    sinon
      .stub(jiraVerifyTokenProto, "queryUsersByCards")
      .returns(["Hu hua", "Jiang Jiang", "Kang Pang"]);
    mock
      .onGet(
        `/issue/createmeta?projectKeys=${tokenVerifyModel.projectKey}&expand=projects.issuetypes.fields`
      )
      .reply(200, JiraFields);

    const jiraColumns = [
      {
        key: "done",
        value: { name: "Ready for Dev", statuses: ["TODO"] },
      },
      {
        key: "done",
        value: { name: "In Dev", statuses: ["TODO", "TODO"] },
      },
      {
        key: "done",
        value: { name: "Blocked", statuses: ["TODO"] },
      },
      {
        key: "done",
        value: { name: "In Review", statuses: ["TODO"] },
      },
      {
        key: "done",
        value: { name: "Ready for Test", statuses: ["TODO"] },
      },
      {
        key: "done",
        value: { name: "In Test", statuses: ["TODO"] },
      },
      {
        key: "done",
        value: { name: "Done (In SIT)", statuses: ["TODO"] },
      },
      {
        key: "done",
        value: { name: "In Production", statuses: ["TODO"] },
      },
    ];
    const users = ["Hu hua", "Jiang Jiang", "Kang Pang"];
    const targetFields = [
      {
        key: "issuetype",
        name: "Issue Type",
        flag: false,
      },
      {
        key: "parent",
        name: "Parent",
        flag: false,
      },
      {
        key: "project",
        name: "Project",
        flag: false,
      },
      {
        key: "reporter",
        name: "Reporter",
        flag: false,
      },
      {
        key: "customfield_10021",
        name: "Flagged",
        flag: false,
      },
      {
        key: "fixVersions",
        name: "Fix versions",
        flag: false,
      },
      {
        flag: false,
        key: "customfield_10000",
        name: "Development",
      },
      {
        key: "priority",
        name: "Priority",
        flag: false,
      },
      {
        key: "labels",
        name: "Labels",
        flag: false,
      },
      {
        flag: false,
        key: "customfield_10015",
        name: "Start date",
      },
      {
        key: "customfield_10016",
        name: "Story point estimate",
        flag: false,
      },
      {
        flag: false,
        key: "customfield_10019",
        name: "Rank",
      },
      {
        key: "assignee",
        name: "Assignee",
        flag: false,
      },
      {
        flag: false,
        key: "customfield_10017",
        name: "Issue color",
      },
      {
        key: "customfield_10027",
        name: "Feature/Operation",
        flag: false,
      },
    ];
    const expectedResponse = {
      jiraColumns,
      users,
      targetFields,
    };
    const response = await jiraVerifyToken.verifyTokenAndGetColumnsAndUser(
      tokenVerifyModel
    );
    expect(response.targetFields[0].flag).to.equal(false);
    expect(response.users.length).to.equal(3);
    expect(response).deep.equal(expectedResponse);
  });
});

describe("should return query status data", () => {
  afterEach(() => sinon.restore());
  it("should return query status data", async () => {
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/10006", {
        headers: { Authorization: "testToken" },
      })
      .reply(200, StatusData);
    const result = await jiraVerifyTokenProto.constructor.queryStatus(
      "https://test.atlassian.net/rest/api/2/status/10006",
      "testToken"
    );
    expect(result.name).equal("TODO");
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
    jiraVerifyTokenProto.httpClient = axios.create({
      baseURL: "https://domain.atlassian.net/rest/agile/1.0/board",
    });
    jiraVerifyTokenProto.httpClient.defaults.headers.common["Authorization"] =
      "testToken";
    jiraVerifyTokenProto.queryCount = 100;
    mock
      .onGet(
        `https://${
          tokenVerifyModel.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&jql=status in ('${doneColumn.join(
          "','"
        )}') AND statusCategoryChangedDate >= ${
          tokenVerifyModel.startTime
        } AND statusCategoryChangedDate <= ${tokenVerifyModel.endTime}`,
        {
          headers: { Authorization: `${tokenVerifyModel.token}` },
        }
      )
      .reply(200, JiraCards);

    const response = await jiraVerifyTokenProto.getAllDoneCards(
      tokenVerifyModel,
      doneColumn
    );

    expect(response.length).deep.equal(2);
  });
});

describe("make page query", () => {
  it("should return cards issues ", async () => {
    const total = 123;
    const jql = `status in ('${doneColumn.join(
      "','"
    )}') AND statusCategoryChangedDate >= ${
      tokenVerifyModel.startTime
    } AND statusCategoryChangedDate <= ${tokenVerifyModel.endTime}`;
    const cards: any = [];
    jiraVerifyTokenProto.queryCount = 100;
    mock
      .onGet(
        `https://${
          tokenVerifyModel.site
        }.atlassian.net/rest/agile/1.0/board/2/issue?maxResults=100&startAt=100&jql=status in ('${doneColumn.join(
          "','"
        )}') AND statusCategoryChangedDate >= ${
          tokenVerifyModel.startTime
        } AND statusCategoryChangedDate <= ${tokenVerifyModel.endTime}`,
        {
          headers: { Authorization: `${tokenVerifyModel.token}` },
        }
      )
      .reply(200, JiraCards);
    await jiraVerifyTokenProto.pageQuerying(
      tokenVerifyModel,
      total,
      jql,
      cards
    );
    expect(cards.length).equal(2);
  });
});

describe("get cycle time and assignee set", () => {
  afterEach(() => sinon.restore());

  it("should return cycle time and assigneeset", async () => {
    const jiraCardKey = "ADM-50";
    mock
      .onGet(
        `https://${tokenVerifyModel.site}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed
      )}')`,
        {
          headers: { Authorization: `${tokenVerifyModel.token}` },
        }
      )
      .reply(200, JiraCardCycleTime);

    const response = await JiraVerifyToken.getCycleTimeAndAssigneeSet(
      jiraCardKey,
      tokenVerifyModel.token,
      tokenVerifyModel.site
    );
    expect(response.values.length).equal(0);
  });
});

describe("query users by cards", () => {
  it("should throw error when allDoneCards length is Zero", async () => {
    sinon.stub(jiraVerifyTokenProto, "getAllDoneCards").returns("");

    try {
      await jiraVerifyTokenProto.queryUsersByCards(
        tokenVerifyModel,
        doneColumn
      );
    } catch (error) {
      if (error instanceof NoCardsInDoneColumnError) {
        expect(error.message).equals(
          "unsupported type: There is no cards in done column."
        );
      }
    }
  });

  // it("should return users", async => {
  //   sinon
  //     .stub(jiraVerifyTokenProto, "getAllDoneCards")
  //     .returns("");

  //   sinon.stub(jiraVerifyTokenProto, "getCycleTimeAndAssigneeSet")
  //     .returns();

  // });
});
