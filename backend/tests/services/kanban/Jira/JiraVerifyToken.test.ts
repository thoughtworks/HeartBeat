import { expect } from "chai";
import "mocha";
import { KanbanTokenVerifyModel } from "../../../../src/contract/kanban/KanbanTokenVerify";
import { mock } from "../../../TestTools";
import JiraColumns from "../../../fixture/JiraColumns.json";
import JiraFields from "../../../fixture/JiraFields.json";
import { JiraVerifyToken } from "../../../../src/services/kanban/Jira/JiraVerifyToken";
import sinon from "sinon";
import axios from "axios";
import { StatusSelf } from "../../../../src/models/kanban/JiraBoard/StatusSelf";

const jiraVerifyToken = new JiraVerifyToken("testToken", "domain");
const jiraVerifyTokenProto = Object.getPrototypeOf(jiraVerifyToken);

describe("verify token and return columns and users", async () => {
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
