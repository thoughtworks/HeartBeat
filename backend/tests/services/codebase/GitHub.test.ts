import { expect } from "chai";
import { JsonConvert } from "json2typescript";
import "mocha";
import { CommitInfo } from "../../../src/models/codebase/CommitInfo";
import {
  LeadTime,
  PipelineLeadTime,
} from "../../../src/models/codebase/LeadTime";
import {
  DeployInfo,
  DeployTimes,
} from "../../../src/models/pipeline/DeployTimes";
import { GitHub } from "../../../src/services/codebase/GitHub/GitHub";
import Organizations from "../../fixture/GitHubAllOrganization.json";
import Repositories from "../../fixture/GitHubAllRepo.json";
import GitHubPullsOne from "../../fixture/GitHubPullsFromCommitOne.json";
import GitHubPullsTwo from "../../fixture/GitHubPullsFromCommitTwo.json";
import { mock } from "../../TestTools";

const gitHub = new GitHub("testToken");

describe("fetch all organizations", () => {
  it("should return organization list", async () => {
    mock.onGet("/user/orgs").reply(200, Organizations);
    const fetchedOrganizations = await gitHub.fetchAllOrganization();

    expect(fetchedOrganizations.length).equal(2);
    expect(fetchedOrganizations).contains("github");
    expect(fetchedOrganizations).contain("tw");
  });
});

describe("fetch all repositories", () => {
  it("should return repo list", async () => {
    const orgs = ["github", "tw"];
    const requestUrls = ["/user/repos"];

    orgs.forEach((org) => {
      requestUrls.push(`/orgs/${org}/repos`);
    });
    requestUrls.forEach((url) => {
      mock.onGet(url).reply(200, Repositories);
    });

    const fetchedRepositories = await gitHub.fetchAllRepo(orgs);

    expect(fetchedRepositories.length).equal(2);
    expect(fetchedRepositories).contains("https://github.com/owner/repo");
    expect(fetchedRepositories).contain("https://github.com/owner/repo1");
  });
});

describe("fetch pipelines lead time", () => {
  const passed: DeployInfo[] = [
    new DeployInfo(
      "2020-05-21T06:27:50.185Z",
      "2020-05-22T06:27:50.185Z",
      "2020-05-22T06:30:50.185Z",
      "id-1",
      "passed"
    ),
    new DeployInfo(
      "2020-05-21T06:27:50.185Z",
      "2020-05-21T06:30:50.185Z",
      "2020-05-22T06:33:50.185Z",
      "id-2",
      "passed"
    ),
  ];
  const deployTimes: DeployTimes[] = new Array(1).fill(
    new DeployTimes("id", "name", "step", passed, [])
  );
  const repositories: Map<string, string> = new Map<string, string>([
    ["id", "https://github.com/example/example.git"],
  ]);

  it("should return pipelines lead time given deploy times and repositories", async () => {
    mock
      .onGet(`/repos/example/example/commits/${passed[0].commitId}/pulls`)
      .reply(200, GitHubPullsOne);
    mock
      .onGet(`/repos/example/example/commits/${passed[1].commitId}/pulls`)
      .reply(200, GitHubPullsTwo);
    mock
      .onGet(`/repos/example/example/pulls/${GitHubPullsOne[0].number}/commits`)
      .reply(200, GitHubPullsOne);
    mock
      .onGet(`/repos/example/example/pulls/${GitHubPullsTwo[0].number}/commits`)
      .reply(200, GitHubPullsTwo);

    const pipelinesLeadTimes: PipelineLeadTime[] =
      await gitHub.fetchPipelinesLeadTime(deployTimes, repositories);

    const leadTimeList: LeadTime[] = [
      new LeadTime(
        passed[0].commitId,
        new Date(passed[0].pipelineCreateTime).getTime(),
        new Date(passed[0].jobFinishTime).getTime(),
        new Date(GitHubPullsOne[0].created_at).getTime(),
        new Date(GitHubPullsOne[0].merged_at).getTime()
      ),
      new LeadTime(
        passed[1].commitId,
        new Date(passed[1].pipelineCreateTime).getTime(),
        new Date(passed[1].jobFinishTime).getTime(),
        new Date(GitHubPullsTwo[0].created_at).getTime(),
        new Date(GitHubPullsTwo[0].merged_at).getTime()
      ),
    ];
    const expectPipelinesLeadTime: PipelineLeadTime[] = [
      new PipelineLeadTime(
        deployTimes[0].pipelineName,
        deployTimes[0].pipelineStep,
        leadTimeList
      ),
    ];

    expect(pipelinesLeadTimes).deep.equal(expectPipelinesLeadTime);
  });

  describe("fetchCommitInfo", () => {
    it("should return corresponding commit info when given commit id and repository id", async () => {
      const commitId: string = "commitid";
      const repositoryId: string = "repositoryid";
      const httpCommitResponse = {
        commit: {
          committer: { name: "Allen", date: "2022-05-21T06:27:50.185Z" },
        },
      };

      mock
        .onGet(`/repos/${repositoryId}/commits/${commitId}`)
        .reply(200, httpCommitResponse);

      const actual: CommitInfo = await gitHub.fetchCommitInfo(
        commitId,
        repositoryId
      );
      const expected: CommitInfo = new JsonConvert().deserializeObject(
        httpCommitResponse,
        CommitInfo
      );

      expect(actual).deep.equal(expected);
    });
  });
});
