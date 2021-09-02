import "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/server";
import { GenerateReporterResponse } from "../../src/contract/GenerateReporter/GenerateReporterResponse";
import { GenerateReportRequest } from "../../src/contract/GenerateReporter/GenerateReporterRequestBody";

chai.use(chaiHttp);
chai.should();

describe("GenerateReporter", () => {
  it("should return 200 and report data when post data correct", async () => {
    const response = await chai
      .request(app)
      .post("/generateReporter")
      .send(new GenerateReportRequest());
    expect(response.status).equal(200);
    expect(response.body).to.deep.equal(new GenerateReporterResponse());
  });

  it("should return 400 when request lack required data", async () => {
    const response = await chai.request(app).post("/generateReporter").send({});
    expect(response.status).equal(400);
  });
});
