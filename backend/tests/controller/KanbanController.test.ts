import "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/server";
import sinon from "sinon";
import {
  ColumnResponse,
  KanbanTokenVerifyResponse,
} from "../../src/contract/kanban/KanbanTokenVerifyResponse";
import { JiraVerifyToken } from "../../src/services/kanban/Jira/JiraVerifyToken";
import { API_VERSION } from "../fixture/common";

chai.use(chaiHttp);
chai.should();

describe("KanbanController", () => {
  describe("verify token API test", () => {
    const KANBAN_VERIFY_URL =
      `${API_VERSION}/kanban/verify?token=test-token&site=dorametrics&projectKey=ADM&startTime=0&endTime=0&boardId=2`;

    it("should return 200 when using valid token", async () => {
      const jiraColumn1 = new ColumnResponse();
      jiraColumn1.key = "DOING";
      jiraColumn1.value.name = "DOING";
      const jiraColumn2 = new ColumnResponse();
      jiraColumn2.key = "TESTING";
      jiraColumn2.value.name = "TESTING";
      const jiraColumnNames = Array.of<ColumnResponse>(
        jiraColumn1,
        jiraColumn2
      );
      const jiraUserNames = Array.of<string>("Lisa", "Tom");
      const expectedResponse = new KanbanTokenVerifyResponse();
      expectedResponse.users = jiraUserNames;
      expectedResponse.jiraColumns = jiraColumnNames;
      sinon
        .stub(JiraVerifyToken.prototype, "verifyTokenAndGetColumnsAndUser")
        .returns(Promise.resolve(expectedResponse));

      const response = await chai.request(app).get(KANBAN_VERIFY_URL + "&type=jira");
      expect(response.status).equal(200);
      expect(response.body).deep.equal(expectedResponse);

      sinon.restore();
    });

    it("should return 400 when type is not jira", async () => {
      sinon.stub(JiraVerifyToken.prototype, "verifyTokenAndGetColumnsAndUser");

      const response = await chai.request(app).get(KANBAN_VERIFY_URL + "&type=not-jira");
      expect(response.status).equals(400);

      sinon.restore();
    });

    it("should throw error when using invalid token", async () => {
      const error = Error("invalid token");
      sinon
        .stub(JiraVerifyToken.prototype, "verifyTokenAndGetColumnsAndUser")
        .throws(error);

      const response = await chai.request(app).get(KANBAN_VERIFY_URL + "&type=jira");
      expect(response).to.throws;

      sinon.restore();
    });
  });
});
