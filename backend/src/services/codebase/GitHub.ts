/* eslint-disable */
import { Codebase } from "./Codebase";
import { DeployTimes } from "../../models/pipeline/DeployTimes";
import axios, { AxiosInstance } from "axios";
import { JsonConvert } from "json2typescript";
import GitUrlParse from "git-url-parse";
import { GitHubPull } from "../../models/codebase/GitHubPull";
import { CommitInfo } from "../../models/codebase/CommitInfo";
import { LeadTime, PipelineLeadTime } from "../../models/codebase/LeadTime";
import { GitHubRepo } from "../../models/codebase/GitHubRepo";

export class GitHub implements Codebase {
  private httpClient: AxiosInstance;

  constructor(token: string) {
    this.httpClient = axios.create({
      baseURL: `https://api.github.com`,
      headers: {
        Accept: "application/vnd.github.groot-preview+json",
        Authorization: `token ${token}`,
      },
    });
  }

  async fetchAllRepo(): Promise<string[]> {
    const response = await this.httpClient.get("user/repos");
    const gitHubRepos: GitHubRepo[] = new JsonConvert().deserializeArray(
      response.data,
      GitHubRepo
    );
    return gitHubRepos.map((repo) => repo.repoUrl);
  }

  async fetchPipelinesLeadTime(
    deployTimes: DeployTimes[],
    repositories: Map<string, string>
  ): Promise<PipelineLeadTime[]> {
    return await Promise.all(
      deployTimes
        .map((deploy) => {
          const repositoryAddress: string = repositories.get(
            deploy.pipelineId
          )!;
          const repository = GitUrlParse(repositoryAddress).full_name;
          return {
            repository: repository,
            deployInfo: deploy.passed,
            pipelineName: deploy.pipelineName,
            pipelineStep: deploy.pipelineStep,
          };
        })
        .map(async (item) => {
          const repository = item.repository;
          const leadTimes: LeadTime[] = await Promise.all(
            item.deployInfo.map(async (deployInfo) => {
              const response = await this.httpClient.get(
                `/repos/${repository}/commits/${deployInfo.commitId}/pulls`
              );
              const gitHubPulls: GitHubPull[] = new JsonConvert().deserializeArray(
                response.data,
                GitHubPull
              );
              const jobFinishTime = new Date(
                deployInfo.jobFinishTime
              ).getTime();
              const pipelineCreateTime: number = new Date(
                deployInfo.pipelineCreateTime
              ).getTime();
              const noMergeDelayTime = new LeadTime(
                deployInfo.commitId,
                pipelineCreateTime,
                jobFinishTime,
                pipelineCreateTime,
                pipelineCreateTime
              );
              if (gitHubPulls.length == 0) {
                return noMergeDelayTime;
              }
              const mergedPull: GitHubPull | undefined = gitHubPulls
                .filter((gitHubPull) => gitHubPull.mergedAt != null)
                .pop();
              if (mergedPull == undefined) {
                return noMergeDelayTime;
              }
              return LeadTime.mapFrom(mergedPull, deployInfo);
            })
          );

          return new PipelineLeadTime(
            item.pipelineName,
            item.pipelineStep,
            leadTimes
          );
        })
    );
  }

  async fetchCommitInfo(
    commitId: string,
    repositoryId: string
  ): Promise<CommitInfo> {
    const repository = GitUrlParse(repositoryId).full_name;

    const response = await this.httpClient.get(
      `/repos/${repository}/commits/${commitId}`
    );
    const commitInfo: CommitInfo = new JsonConvert().deserializeObject(
      response.data,
      CommitInfo
    );

    return commitInfo;
  }
}
