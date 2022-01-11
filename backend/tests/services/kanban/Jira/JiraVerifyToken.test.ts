import { expect } from "chai";
import "mocha";
import { KanbanTokenVerifyModel } from "../../../../src/contract/kanban/KanbanTokenVerify";
import { mock } from "../../../TestTools";
import JiraColumns from "../../../fixture/JiraColumns.json";
import JiraFields from "../../../fixture/JiraFields.json";
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

const jiraVerifyToken = new JiraVerifyToken("testToken", "domain");

describe("verify token and return columns and users", async () => {
  const tokenVerifyModel = new KanbanTokenVerifyModel(
    "testToken",
    "domain",
    "ADM",
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
    mock
      .onGet(
        `https://${tokenVerifyModel.site}.atlassian.net/rest/agile/1.0/board/${tokenVerifyModel.boardId}/issue?maxResults=100&jql=status in ('DONE','PRODUCTION')`
      )
      .reply(200, JiraCards);
    mock
      .onGet(
        `/issue/createmeta?projectKeys=${tokenVerifyModel.projectKey}&expand=projects.issuetypes.fields`
      )
      .reply(200, JiraFields);
    const jiraCardKey = "ADM-64";
    mock
      .onGet(
        `https://${tokenVerifyModel.site}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed`
      )
      .reply(200, JiraCardCycleTime);

    mock
      .onGet(
        `https://${tokenVerifyModel.site}.atlassian.net/rest/agile/1.0/board/${tokenVerifyModel.boardId}/configuration`
      )
      .reply(200, JiraColumns);

    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/10011")
      .reply(200, ReadyForDevStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/10066")
      .reply(200, InDevStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/21008")
      .reply(200, BlockedStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/10009")
      .reply(200, InReviewStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/10005")
      .reply(200, ReadyForTestStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/19429")
      .reply(200, InTestStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/14205")
      .reply(200, DoneStatus);
    mock
      .onGet("https://test.atlassian.net/rest/api/2/status/21127")
      .reply(200, InProductionStatus);

    const response = await jiraVerifyToken.verifyTokenAndGetColumnsAndUser(
      tokenVerifyModel
    );
    const jiraReadyForDevColumn = new ColumnResponse();
    jiraReadyForDevColumn.key = "new";
    jiraReadyForDevColumn.value.name = "Ready for Dev";
    jiraReadyForDevColumn.value.statuses.push("TO DO");
    const jiraInDevColumn = new ColumnResponse();
    jiraInDevColumn.key = "indeterminate";
    jiraInDevColumn.value.name = "In Dev";
    jiraInDevColumn.value.statuses.push("IN DEV");
    jiraInDevColumn.value.statuses.push("BLOCK");
    const jiraBlockColumn = new ColumnResponse();
    jiraBlockColumn.key = "indeterminate";
    jiraBlockColumn.value.name = "Blocked";
    jiraBlockColumn.value.statuses.push("BLOCK");
    const jiraInReviewColumn = new ColumnResponse();
    jiraInReviewColumn.key = "indeterminate";
    jiraInReviewColumn.value.name = "In Review";
    jiraInReviewColumn.value.statuses.push("IN REVIEW");
    const jiraReadyForTestColumn = new ColumnResponse();
    jiraReadyForTestColumn.key = "indeterminate";
    jiraReadyForTestColumn.value.name = "Ready for Test";
    jiraReadyForTestColumn.value.statuses.push("READY FOR TEST");
    const jiraInTestColumn = new ColumnResponse();
    jiraInTestColumn.key = "indeterminate";
    jiraInTestColumn.value.name = "In Test";
    jiraInTestColumn.value.statuses.push("IN TEST");
    const jiraDoneColumn = new ColumnResponse();
    jiraDoneColumn.key = "done";
    jiraDoneColumn.value.name = "Done (In SIT)";
    jiraDoneColumn.value.statuses.push("DONE");
    const jiraInProductionColumn = new ColumnResponse();
    jiraInProductionColumn.key = "done";
    jiraInProductionColumn.value.name = "In Production";
    jiraInProductionColumn.value.statuses.push("PRODUCTION");
    const jiraColumnNames = Array.of<ColumnResponse>(
      jiraReadyForDevColumn,
      jiraInDevColumn,
      jiraBlockColumn,
      jiraInReviewColumn,
      jiraReadyForTestColumn,
      jiraInTestColumn,
      jiraDoneColumn,
      jiraInProductionColumn
    );
    const jiraUserNames = Array.of<string>("Yuxuan Bi");
    const expectedResponse = new KanbanTokenVerifyResponse();
    expectedResponse.targetFields = [
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
    expectedResponse.users = jiraUserNames;
    expectedResponse.jiraColumns = jiraColumnNames;
    expect(response).deep.equal(expectedResponse);
  });
});
