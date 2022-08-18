import { DeployTimes } from "../../models/pipeline/DeployTimes";
import { PipelineLeadTime } from "../../models/codebase/LeadTime";
import { GitHub } from "./GitHub/GitHub";
import { CommitInfo } from "../../models/codebase/CommitInfo";
import { PlatformTypeError } from "../../errors/PlatformTypeError";

enum CodebaseType {
  GITHUB = "github",
}

export interface Codebase {
  fetchAllRepo(gitOrganizations: string[]): Promise<string[]>;
  fetchPipelinesLeadTime(
    deployTimes: DeployTimes[],
    repositories: Map<string, string>
  ): Promise<PipelineLeadTime[]>;
  fetchCommitInfo(commitId: string, repositoryId: string): Promise<CommitInfo>;
}

export class CodebaseFactory {
  static getInstance(type: string, token: string): Codebase {
    switch (type.toLowerCase()) {
      case CodebaseType.GITHUB:
        return new GitHub(token);
      default:
        throw new PlatformTypeError(type);
    }
  }
}
