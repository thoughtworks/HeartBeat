import "mocha";
import chai from "chai";
import { expect } from "chai";
import chaiHttp = require("chai-http");
import app from "../../src/server";
import { GenerateReporterResponse } from "../../src/contract/GenerateReporter/GenerateReporterResponse";
import { GenerateReportRequest } from "../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import { API_VERSION } from "../fixture/common";

chai.use(chaiHttp);
chai.should();

describe("GenerateReporter", () => {
  const GENERATOR_REPORT_URL = `${API_VERSION}/generateReporter`;

  it("should return 200 and report data when post data correct", async () => {
    const response = await chai
      .request(app)
      .post(GENERATOR_REPORT_URL)
      .send(new GenerateReportRequest());
    expect(response.status).equal(200);
    expect(response.body).to.deep.equal({});
  });

  it("should return 400 when request lack required data", async () => {
    const response = await chai
      .request(app)
      .post(GENERATOR_REPORT_URL)
      .send(new GenerateReporterResponse());
    expect(response.status).equal(400);
  });
});
