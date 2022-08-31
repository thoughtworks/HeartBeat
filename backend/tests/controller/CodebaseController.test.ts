import "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/server";
import sinon from "sinon";
import { GitHub } from "../../src/services/codebase/GitHub/GitHub";
import { mock } from "../TestTools";

chai.use(chaiHttp);
chai.should();

describe("CodebaseController", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return 200 when github token is valid", async () => {
    sinon.stub(GitHub.prototype, "fetchAllOrganization");
    const expectedResponse = ["https://github.com/hello/nihao"];
    sinon
      .stub(GitHub.prototype, "fetchAllRepo")
      .returns(Promise.resolve(expectedResponse));

    const response = await chai
      .request(app)
      .get("/codebase/fetch/repos?token=test-token&type=Github");
    expect(response.status).equal(200);
    expect(response.body).deep.equal(expectedResponse);
  });

  it("should return 401 when github token is invalid", async () => {
    mock.onGet("/user/orgs").reply(401);
    const response = await chai
      .request(app)
      .get("/codebase/fetch/repos?token=test-token&type=Github");
    expect(response.status).equal(401);
  });
});
