import "mocha";
import sinon from "sinon";
import axios from "axios";
import { StatusSelf } from "../../../../src/models/kanban/JiraBoard/StatusSelf";
import { expect } from "chai";
import { KanbanTokenVerifyModel } from "../../../../src/contract/kanban/KanbanTokenVerify";
import { mock } from "../../../TestTools";
import JiraColumnConfig from "../../../fixture/JiraColumnConfig.json";
import JiraFields from "../../../fixture/JiraFields.json";
import StatusData from "../../../fixture/StatusData.json";

import JiraCardCycleTime from "../../../fixture/JiraCardCycleTime.json";
import JiraCards from "../../../fixture/JiraCards.json";
import { JiraVerifyToken } from "../../../../src/services/kanban/Jira/JiraVerifyToken";
import { ThereIsNoCardsInDoneColumn } from "../../../../src/types/ThereIsNoCardsInDoneColumn";

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
describe("verify token and return columns and users", () => {
  afterEach(() => sinon.restore());

  it("should throw exception when token is invalid", async () => {
    mock.onGet(`/project/${tokenVerifyModel.projectKey}`).reply(401);
    expect(async () => {
      await jiraVerifyToken.verifyTokenAndGetColumnsAndUser(tokenVerifyModel);
    }).to.throw;
  });

  it("should return columns and users when token is valid", async () => {
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
        key: "labels",
        name: "Labels",
        flag: false,
      },
      {
        key: "assignee",
        name: "Assignee",
        flag: false,
      },
    ];

    const statusSelf: StatusSelf = new StatusSelf(
      "https://dorametrics.atlassian.net/rest/api/2/status/10006",
      "TODO",
      "TODO",
      {
        key: "done",
        name: "完成",
      }
    );

    jiraVerifyTokenProto.httpClient = axios.create({
      baseURL: "https://site.atlassian.net/rest/api/2",
    });
    jiraVerifyTokenProto.httpClient.defaults.headers.common["Authorization"] =
      "test Token";

    mock
      .onGet(
        `https://${tokenVerifyModel.site}.atlassian.net/rest/agile/1.0/board/${tokenVerifyModel.boardId}/configuration`
      )
      .reply(200, JiraColumnConfig);

    sinon.stub(JiraVerifyToken, <any>"queryStatus").callsFake(() => statusSelf);

    sinon
      .stub(jiraVerifyTokenProto, "queryUsersByCards")
      .returns(["Hu hua", "Jiang Jiang", "Kang Pang"]);

    mock
      .onGet(
        `/issue/createmeta?projectKeys=${tokenVerifyModel.projectKey}&expand=projects.issuetypes.fields`
      )
      .reply(200, JiraFields);

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

describe("get query status", () => {
  it("should return query status data when token is valid", async () => {
    mock
      .onGet("https://domain.atlassian.net/rest/api/2/status/10006", {
        headers: { Authorization: "testToken" },
      })
      .reply(200, StatusData);

    const result: StatusSelf =
      await jiraVerifyTokenProto.constructor.queryStatus(
        "https://domain.atlassian.net/rest/api/2/status/10006",
        "testToken"
      );
    expect(result.statusCategory.key).equal("indeterminate");
  });
});

describe("get all done cards", () => {
  it("should return all done cards when board has done cards in time range", async () => {
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

    expect(response.length).deep.equal(1);
  });
});

describe("make page query", () => {
  it("should return cards issues when total cards number is larger than query count limit", async () => {
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
    expect(cards.length).equal(1);
  });
});

describe("get assignee set", () => {
  afterEach(() => sinon.restore());

  it("should return assigneeset when the card has been assigned", async () => {
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

    const asigneeSet = await JiraVerifyToken.getAssigneeSet(
      jiraCardKey,
      tokenVerifyModel.token,
      tokenVerifyModel.site
    );

    expect(asigneeSet.size).equal(1);
  });
});

describe("query users by cards", () => {
  afterEach(() => sinon.restore());
  it("should throw error when there is no cards in Done column", async () => {
    sinon.stub(jiraVerifyTokenProto, "getAllDoneCards").returns([]);

    try {
      await jiraVerifyTokenProto.queryUsersByCards(
        tokenVerifyModel,
        doneColumn
      );
    } catch (error) {
      if (error instanceof ThereIsNoCardsInDoneColumn) {
        expect(error.message).equals("There is no cards in Done column.");
      }
    }
  });

  it("should return users when there exists assigned card in done column", async () => {
    const allDoneCards = [
      {
        expand:
          "operations,versionedRepresentations,editmeta,changelog,renderedFields",
        id: "10238",
        self: "https://dorametrics.atlassian.net/rest/agile/1.0/issue/10238",
        key: "ADM-222",
      },
    ];

    sinon.stub(jiraVerifyTokenProto, "getAllDoneCards").returns(allDoneCards);

    sinon
      .stub(JiraVerifyToken, "getAssigneeSet")
      .returns(Promise.resolve(new Set<string>(["Peng Peng", "Ming xiao"])));

    const expectedUsers = ["Peng Peng", "Ming xiao"];
    const Users = await jiraVerifyTokenProto.queryUsersByCards(
      tokenVerifyModel,
      doneColumn
    );

    expect(Users).deep.equal(expectedUsers);
  });
});
