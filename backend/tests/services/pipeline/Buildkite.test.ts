import "mocha";
import { expect } from "chai";
import { mock } from "../../TestTools";
import BKOrganizationInfo from "../../fixture/BKOrganizationInfo.json";
import BKPipelineInfo from "../../fixture/BKPipelineInfo.json";
import BKBuildInfoList from "../../fixture/BKBuildInfoList.json";
import { Buildkite } from "../../../src/services/pipeline/Buildkite/Buildkite";
import { PipelineInfo } from "../../../src/contract/pipeline/PipelineInfo";
import { PipelineError } from "../../../src/errors/PipelineError";
import { DeploymentEnvironment } from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import { BuildInfo, JobInfo } from "../../../src/models/pipeline/BuildInfo";
import { BKBuildInfo } from "../../../src/models/pipeline/Buildkite/BKBuildInfo";
import { FetchParams } from "../../../src/types/FetchParams";
import { DeployInfo } from "../../../src/models/pipeline/DeployTimes";
import axios from "axios";
import sinon from "sinon";

const buildkite = new Buildkite("testToken");
const buildkiteProto = Object.getPrototypeOf(buildkite);

const deployments: DeploymentEnvironment = {
  orgId: "",
  orgName: "test",
  id: "sme-test",
  name: "sme-test",
  step: ":test: :test: Deploy Integration App",
};
const BKJobInfo1: JobInfo = {
  name: ":rainbow-flag: uploading pipeline",
  state: "passed",
  startedAt: "2021-12-16T22:10:29.122Z",
  finishedAt: "2021-12-16T22:10:58.849Z",
};
const bkBuildInfo: BKBuildInfo = {
  jobs: [BKJobInfo1],
  commit: "18f8f5f2b89d255bb3f156e3fa13ae31fb66fb1f",
  pipelineCreateTime: "2021-12-17T02:11:55.965Z",
  number: 9400,
};
const buildInfo1 = new BuildInfo(bkBuildInfo);
const buildInfos: BuildInfo[] = [buildInfo1];

describe("verify token", () => {
  it("should return true when token has required permissions", async () => {
    mock.onGet("/access-token").reply(200, {
      scopes: ["read_builds", "read_organizations", "read_pipelines"],
    });
    const hasPermission: boolean = await buildkite.verifyToken();
    expect(hasPermission).true;
  });

  it("should return true when token does not have required permissions", async () => {
    mock.onGet("/access-token").reply(200, {
      scopes: ["read_builds", "read_organizations"],
    });
    const hasPermission: boolean = await buildkite.verifyToken();
    expect(hasPermission).false;
  });

  it("should throw exception when token is invalid", () => {
    mock.onGet("/access-token").reply(401);
    expect(async () => {
      await buildkite.verifyToken();
    }).to.throw;
  });
});

describe("fetch pipeline ", () => {
  it("should return expected pipeline info", async () => {
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

    const actual: PipelineInfo[] = await buildkite.fetchPipelineInfo(
      new Date().getTime() - 10000000,
      new Date().getTime()
    );
    const expected: PipelineInfo[] = [
      {
        id: "buildkite-test-slug",
        name: "buildkite-test1-name",
        steps: [],
        repository: "https://github.com/expample/example.git",
        orgId: "buildkite-test-slug",
        orgName: "buildkite-test-name",
      },
      {
        id: "buildkite-test-slug",
        name: "buildkite-test2-name",
        steps: [],
        repository: "https://github.com/expample/example.git",
        orgId: "buildkite-test-slug",
        orgName: "buildkite-test-name",
      },
    ];

    expect(actual).deep.equal(expected);
  });

  it("should return error when token failed", async () => {
    mock.onGet("/access-token").reply(200, {
      scopes: ["read_builds", "read_organizations"],
    });
    try {
      await buildkite.fetchPipelineInfo(
        new Date().getTime() - 10000000,
        new Date().getTime()
      );
    } catch (error) {
      if (error instanceof PipelineError) {
        expect(error.message).equals(
          new PipelineError("permission deny!").message
        );
      }
    }
  });
});

describe("fetch pipeline repository", () => {
  it("should return expected repository", async () => {
    const orgSlug = BKOrganizationInfo[0].slug;
    const pipelineSlug = BKPipelineInfo[0].slug;
    mock
      .onGet(`/organizations/${orgSlug}/pipelines/${pipelineSlug}`)
      .reply(200, BKPipelineInfo[0]);

    const repositories: Map<string, string> = await buildkite.getRepositories([
      {
        orgId: orgSlug,
        orgName: "orgName",
        id: pipelineSlug,
        name: "pipelineName",
        step: "step",
      },
    ]);
    const expectRepositories: Map<string, string> = new Map<string, string>();
    expectRepositories.set(
      pipelineSlug,
      "https://github.com/expample/example.git"
    );

    expect(repositories).deep.equal(expectRepositories);
  });
});

describe("fetch data page by page", async () => {
  it("should return data collector", async () => {
    const fetchUrl = "/organizations/mytest/pipelines";
    const fetchParams: FetchParams = new FetchParams(
      "1",
      "100",
      new Date(1590080044000),
      new Date(1590080094000)
    );
    buildkiteProto.httpClient = axios.create({
      baseURL: "https://api.buildkite.com/v2",
    });
    mock.onGet("/organizations/mytest/pipelines").reply(
      200,
      [
        {
          id: "01829062-7ad1-5673-ab92-4cdff307b6f3",
          graphql_id:
            "UGlwZWxpbmUtLS0wMcekfjvicrjNC1iMGNjLTRhMmYtOTk4ZC0yMTk4MzNjODI4NDU=",
          url: "https://api.buildkite.com/v2/organizations/mytest/pipelines/account-details-self-portal-web-performance-test",
          web_url:
            "https://buildkite.com/mytest/account-details-self-portal-web-performance-test",
          name: "account-details-self-portal-web-performance-test",
          description: "",
        },
        {
          id: "01820fa4-b0cc-4a2f-463d-219833c82845",
          graphql_id:
            "UGlwZWxpbmUtLS0wMTgycfnjvcrjvLTRhMmYtOTk4ZC0yMTk4MzNjODI4NDU=",
          url: "https://api.buildkite.com/v2/organizations/mytest/pipelines/account-details-self-portal-web-performance-test",
          web_url:
            "https://buildkite.com/mytest/account-details-self-portal-web-performance-test",
          name: "account-details-self-portal-web-performance-test",
          description: "",
        },
      ],
      {
        link: '<https://api.buildkite.com/v2/organizations/mytest/pipelines?created_to=2021-12-17T15%3A59%3A59.000Z&finished_from=2021-12-05T16%3A00%3A00.000Z&page=2&per_page=100>; rel="next", <https://api.buildkite.com/v2/organizations/mytest/pipelines?created_to=2021-12-17T15%3A59%3A59.000Z&finished_from=2021-12-05T16%3A00%3A00.000Z&page=2&per_page=100>; rel="last"',
      }
    );
    const dataCollector = await buildkiteProto.fetchDataPageByPage(
      fetchUrl,
      fetchParams
    );
    expect(dataCollector.length).to.equal(4);
  });
});

describe("count deploy times", () => {
  afterEach(() => sinon.restore());
  it("should return error", async () => {
    const deployments: DeploymentEnvironment = {
      orgId: null!,
      orgName: "test",
      id: "sme-test",
      name: "sme-test",
      step: ":test: :test: Deploy Integration App",
    };
    const buildInfos: BuildInfo[] = [];
    try {
      await buildkite.countDeployTimes(deployments, buildInfos);
    } catch (error) {
      if (error instanceof PipelineError) {
        expect(error.message).equals("miss orgId argument");
      }
    }
  });

  it("should return deploy times", async () => {
    const passed: DeployInfo = {
      pipelineCreateTime: "2021-12-17T02:11:55.965Z",
      jobStartTime: "2021-12-16T22:10:29.122Z",
      jobFinishTime: "2021-12-16T22:10:58.849Z",
      commitId: "test",
      state: "passed",
    };
    sinon.stub(buildkiteProto, "getBuildsByState").returns(passed);

    const actual = buildkite.countDeployTimes(deployments, buildInfos);

    expect((await actual).passed).to.equal(passed);
  });
});

describe("get builds by state", () => {
  it("get builds by state", () => {
    const state: string[] = ["passed", "passed"];
    const actual = buildkiteProto.getBuildsByState(
      buildInfos,
      deployments,
      state
    );
    expect(actual.length).to.equal(0);
  });
});

describe("fetch pipeline builds", async () => {
  it("should return a new jsonConvert", async () => {
    const startTime: Date = new Date(1590080044000);
    const endTime: Date = new Date(1590080094000);
    sinon.stub(buildkiteProto, "fetchDataPageByPage").returns([
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
    ]);
    const actual = buildkite.fetchPipelineBuilds(
      deployments,
      startTime,
      endTime
    );
    expect((await actual).length).to.equal(2);
  });
});
