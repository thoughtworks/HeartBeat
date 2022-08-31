import { expect } from "chai";
import { CommitInfo } from "../../../src/models/codebase/CommitInfo";
import { LeadTime, LeadTimeInfo } from "../../../src/models/codebase/LeadTime";
import { BuildInfo } from "../../../src/models/pipeline/BuildInfo";
import {
  BKBuildInfo,
  BKJobInfo,
} from "../../../src/models/pipeline/Buildkite/BKBuildInfo";
import { DeployInfo } from "../../../src/models/pipeline/DeployTimes";
import { PipelineCsvInfo } from "../../../src/models/pipeline/PipelineCsvInfo";

describe("PipelineCsvInfo", () => {
  it("should create an instance when given arguments", () => {
    const pipeLineName: string = "testname";
    const stepName: string = "Deploy";
    const pipielineStep = "Deploy Integration App";
    const bkJobInfo: BKJobInfo = {
      name: "Deploy Integration App",
      state: "passed",
      startedAt: "2021-12-16T22:10:29.122Z",
      finishedAt: "2021-12-16T22:10:58.849Z",
    };
    const bkBuildInfo: BKBuildInfo = {
      jobs: [bkJobInfo],
      commit: "12",
      pipelineCreateTime: "2021-12-17T02:11:55.965Z",
      number: 9400,
    };
    const buildInfo = new BuildInfo(bkBuildInfo);
    const deployInfo = new DeployInfo(
      "2021-12-17T02:11:55.965Z",
      "2021-12-16T22:10:29.122Z",
      "2021-12-16T22:10:58.849Z",
      "12",
      "passed"
    );
    const commitInfo: CommitInfo = {
      commit: {
        committer: {
          name: "commit-name",
          date: "2021-12-15T22:10:29.122Z",
        },
      },
    };
    const leadTime = new LeadTime(
      "12",
      1639692629122,
      1639692629132,
      1639692729122,
      1639692658849,
      1639707115965
    );

    const leadTimeInfo = new LeadTimeInfo(leadTime);

    const pipelineCsvInfo = new PipelineCsvInfo(
      pipeLineName,
      stepName,
      buildInfo,
      deployInfo,
      commitInfo,
      leadTimeInfo
    );
    expect(pipelineCsvInfo.stepName).equal("Deploy");
  });
});
