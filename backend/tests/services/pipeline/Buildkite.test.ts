import "mocha";
import { expect } from "chai";
import { mock } from "../../TestTools";
import BKOrganizationInfo from "../../fixture/BKOrganizationInfo.json";
import BKPipelineInfo from "../../fixture/BKPipelineInfo.json";
import BKBuildInfoList from "../../fixture/BKBuildInfoList.json";
import { Buildkite } from "../../../src/services/pipeline/Buildkite/Buildkite";
import { PipelineInfo } from "../../../src/contract/pipeline/PipelineInfo";

const buildkite = new Buildkite("testToken");

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

    const pipelineInfo: PipelineInfo[] = await buildkite.fetchPipelineInfo(
      new Date().getTime() - 10000000,
      new Date().getTime()
    );
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

    expect(pipelineInfo).deep.equal(expectPipelineInfo);
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
