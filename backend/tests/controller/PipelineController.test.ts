import "mocha";
import { mock } from "../TestTools";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/server";
import BKOrganizationInfo from "../fixture/BKOrganizationInfo.json";
import BKPipelineInfo from "../fixture/BKPipelineInfo.json";
import BKBuildInfoList from "../fixture/BKBuildInfoList.json";
import { PipelineInfo } from "../../src/contract/pipeline/PipelineInfo";
import { API_VERSION } from "../fixture/common";

chai.use(chaiHttp);
chai.should();

describe("PipelineController", () => {
  describe("fetch pipeline API test", () => {
    const PIPELINE_FETCH_URL = `${API_VERSION}/pipeline/fetch`;

    it("should return 200 when using valid token", async () => {
      mock.onGet("/organizations").reply(200, BKOrganizationInfo);
      mock
        .onGet(
          `/organizations/${BKOrganizationInfo[0].slug}/pipelines/${BKPipelineInfo[0].slug}/builds`
        )
        .reply(200, BKBuildInfoList, {
          link: null,
        });
      mock
        .onGet(`/organizations/${BKOrganizationInfo[0].slug}/pipelines`)
        .reply(200, BKPipelineInfo, {
          link: null,
        });
      mock.onGet("/access-token").reply(200, {
        scopes: ["read_builds", "read_organizations", "read_pipelines"],
      });

      const response = await chai.request(app).post(PIPELINE_FETCH_URL).send({
        token: "test-token",
        type: "buildkite",
        startTime: 5678,
        endTime: 6789,
      });
      const expectPipelineInfo: PipelineInfo[] = [
        new PipelineInfo(
          "buildkite-test-slug",
          "buildkite-test-name",
          [],
          "https://github.com/expample/example.git",
          "buildkite-test-slug",
          "buildkite-test-name"
        ),
      ];
      expect(response.status).equal(200);
      expect(response.body).deep.equal(expectPipelineInfo);
    });

    it("should return the origin status code when call buildkite failed", async () => {
      mock.onGet("/organizations").reply(406);
      mock.onGet("/access-token").reply(200, {
        scopes: ["read_builds", "read_organizations", "read_pipelines"],
      });

      const response = await chai.request(app).post(PIPELINE_FETCH_URL).send({
        token: "test-token",
        type: "buildkite",
        startTime: 5678,
        endTime: 6789,
      });
      expect(response.status).equal(406);
    });
  });
});
