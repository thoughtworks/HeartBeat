import "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { BuildkiteGetSteps } from "../../../src/services/pipeline/Buildkite/BuildkiteGetSteps";
import { PipelineGetStepsRequest } from "../../../src/contract/pipeline/PipelineGetStepsRequest";
import { FetchParams } from "../../../src/types/FetchParams";
import axios from "axios";
import { mock } from "../../TestTools";

const buildkitegetsteps = new BuildkiteGetSteps("testToken");
const buildkitegetstepsProto = Object.getPrototypeOf(buildkitegetsteps);

const buildkitedata = [
  {
    id: "f7c42703-4925-4c8c-aa0f-dbc105696055",
    created_at: "2021-12-11T02:19:01.748Z",
    scheduled_at: "2021-12-11T02:19:01.701Z",
    started_at: "2021-12-11T02:19:11.509Z",
    finished_at: "2021-12-11T02:24:05.276Z",
    jobs: [
      {
        name: "test01",
      },
    ],
  },
  {
    id: "f7c42703-4925-4c8c-aa0f-dbc105696056",
    created_at: "2021-12-11T02:19:01.748Z",
    scheduled_at: "2021-12-11T02:19:01.701Z",
    started_at: "2021-12-11T02:19:11.509Z",
    finished_at: "2021-12-11T02:24:05.276Z",
    jobs: [
      {
        name: "test02",
      },
    ],
  },
];

describe("fetch pipeline info", () => {
  afterEach(() => sinon.restore());
  it("fetch pipeline info", async () => {
    const pipelineGetStepsRequest: PipelineGetStepsRequest = {
      orgId: "testId",
      orgName: "testName",
      pipelineId: "testPipelineId",
      pipelineName: "testPipelineName",
      repository: "https://github.com/expample/example.git",
      token: "testToken",
      type: "",
      startTime: 1590080044000,
      endTime: 1590080094000,
    };
    sinon
      .stub(buildkitegetstepsProto, "fetchDataPageByPage")
      .returns(buildkitedata);
    const result = await buildkitegetsteps.fetchPipelineInfo(
      pipelineGetStepsRequest
    );
    expect(result.orgId).contains("testId");
    expect(result.orgName).contains("testName");
    expect(result.id).contains("testPipelineId");
  });
});

describe("fetch data page by page", async () => {
  it("should return data collector", async () => {
    const fetchUrl = "/organizations/mytest/pipelines/mytest/builds";
    const fetchParams: FetchParams = new FetchParams(
      "1",
      "100",
      new Date(1590080044000),
      new Date(1590080094000)
    );
    buildkitegetstepsProto.httpClient = axios.create({
      baseURL: "https://api.buildkite.com/v2",
    });
    mock
      .onGet("/organizations/mytest/pipelines/mytest/builds")
      .reply(200, buildkitedata, {
        link: '<https://api.buildkite.com/v2/organizations/mytest/pipelines?created_to=2021-12-17T15%3A59%3A59.000Z&finished_from=2021-12-05T16%3A00%3A00.000Z&page=2&per_page=100>; rel="next", <https://api.buildkite.com/v2/organizations/mytest/pipelines?created_to=2021-12-17T15%3A59%3A59.000Z&finished_from=2021-12-05T16%3A00%3A00.000Z&page=2&per_page=100>; rel="last"',
      });
    const dataCollector = await buildkitegetstepsProto.fetchDataPageByPage(
      fetchUrl,
      fetchParams
    );
    expect(dataCollector.length).to.equal(4);
  });
});
