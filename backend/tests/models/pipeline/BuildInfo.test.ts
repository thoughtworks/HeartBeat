import { expect } from "chai";
import { BuildInfo, JobInfo } from "../../../src/models/pipeline/BuildInfo";
import {
  BKBuildInfo,
  BKJobInfo,
} from "../../../src/models/pipeline/Buildkite/BKBuildInfo";
import { DeployInfo } from "../../../src/models/pipeline/DeployTimes";

describe("BuildInfo", () => {
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

  describe("mapToDeployInfo", () => {
    const blankDeployInfo = new DeployInfo("", "", "", "", "");

    it("should return a corresponding deployInfo when having a job matching step and states", () => {
      const result = buildInfo.mapToDeployInfo(
        pipielineStep,
        "passed",
        "failed"
      );
      const expected = new DeployInfo(
        "2021-12-17T02:11:55.965Z",
        "2021-12-16T22:10:29.122Z",
        "2021-12-16T22:10:58.849Z",
        "12",
        "passed"
      );
      expect(result).deep.equal(expected);
    });

    it("should return a blank deployInfo when not having pipeline create time", () => {
      const bkBuildInfoWithoutPipelineCreateTime: BKBuildInfo = {
        ...bkBuildInfo,
        pipelineCreateTime: undefined,
      };
      const buildInfo = new BuildInfo(bkBuildInfoWithoutPipelineCreateTime);
      const result = buildInfo.mapToDeployInfo(
        pipielineStep,
        "passed",
        "failed"
      );
      expect(result).deep.equal(blankDeployInfo);
    });

    it("should return a blank deployInfo when having no job matching step", () => {
      const pipielineStepNotMatched = "deploy production App";
      const result = buildInfo.mapToDeployInfo(
        pipielineStepNotMatched,
        "passed",
        "failed"
      );
      expect(result).deep.equal(blankDeployInfo);
    });

    it("should return a blank deployInfo when having job matching step but without states", () => {
      const pipielineStepNotMatched = "deploy production App";
      const result = buildInfo.mapToDeployInfo(
        pipielineStepNotMatched,
        "running",
        "failed"
      );
      expect(result).deep.equal(blankDeployInfo);
    });

    it("should return a blank deployInfo when matched job without start time", () => {
      const bkJobInfoWithoutStartTime: BKJobInfo = {
        name: "Deploy Integration App",
        state: "passed",
        finishedAt: "2021-12-16T22:10:58.849Z",
      };
      const bkBuildInfo: BKBuildInfo = {
        jobs: [bkJobInfoWithoutStartTime],
        commit: "12",
        pipelineCreateTime: "2021-12-17T02:11:55.965Z",
        number: 9400,
      };
      const buildInfo = new BuildInfo(bkBuildInfo);

      const result = buildInfo.mapToDeployInfo(
        pipielineStep,
        "passed",
        "failed"
      );
      expect(result).deep.equal(blankDeployInfo);
    });

    it("should return a blank deployInfo when matched job without finish time", () => {
      const bkJobInfoWithoutFinishTime: BKJobInfo = {
        name: "Deploy Integration App",
        state: "passed",
        finishedAt: "2021-12-16T22:10:58.849Z",
      };
      const bkBuildInfo: BKBuildInfo = {
        jobs: [bkJobInfoWithoutFinishTime],
        commit: "12",
        pipelineCreateTime: "2021-12-17T02:11:55.965Z",
        number: 9400,
      };
      const buildInfo = new BuildInfo(bkBuildInfo);

      const result = buildInfo.mapToDeployInfo(
        pipielineStep,
        "passed",
        "failed"
      );

      expect(result).deep.equal(blankDeployInfo);
    });
  });

  describe("JobInfo", () => {
    it("should assign default values to properties", () => {
      const jobInfo = new JobInfo();
      expect(jobInfo).deep.equal({
        name: undefined,
        state: "",
        startedAt: undefined,
        finishedAt: undefined,
      });
    });
  });
});
