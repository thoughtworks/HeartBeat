/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  GenerateReportRequest,
  RequestKanbanSetting,
  CodebaseSetting,
} from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import {
  AvgDeploymentFrequency,
  AvgLeadTimeForChanges,
  DeploymentFrequency,
  DeploymentFrequencyOfPipeline,
  GenerateReporterResponse,
  LeadTimeForChanges,
  LeadTimeForChangesOfPipeline,
} from "../../contract/GenerateReporter/GenerateReporterResponse";
import { Kanban, KanbanFactory } from "../kanban/Kanban";
import { StoryPointsAndCycleTimeRequest } from "../../contract/kanban/KanbanStoryPointParameterVerify";
import { CalculateCycleTime } from "../kanban/CalculateCycleTime";
import { DeployTimes, DeployInfo } from "../../models/pipeline/DeployTimes";
import { Pipeline, PipelineFactory } from "../pipeline/Pipeline";
import { calculateDeploymentFrequency } from "../common/DeploymentFrequency";
import { calculateChangeFailureRate } from "../common/ChangeFailureRate";
import { RequireDataEnum } from "../../models/RequireDataEnum";
import {
  ConvertBoardDataToCsv,
  GetDataFromCsv,
  ConvertPipelineDataToCsv,
} from "../common/GeneraterCsvFile";
import { Cards } from "../../models/kanban/RequestKanbanResults";
import { Pair } from "../../types/Pair";
import { getClassificationOfSelectedFields } from "../kanban/Classification";
import {
  PipelineLeadTime,
  LeadTime,
  LeadTimeInfo,
} from "../../models/codebase/LeadTime";
import { calculateAvgLeadTime } from "../common/LeadTimeForChanges";
import { Codebase, CodebaseFactory } from "../codebase/Codebase";
import { SettingMissingError } from "../../types/SettingMissingError";
import { LackRequiredDataError } from "../../types/LackRequiredDataError";
import { changeConsiderHolidayMode } from "../common/WorkDayCalculate";
import { BuildInfo } from "../../models/pipeline/BuildInfo";
import { PipelineCsvInfo } from "../../models/pipeline/PipelineCsvInfo";
import { CommitInfo } from "../../models/codebase/CommitInfo";
import { JiraColumnResponse } from "../../contract/kanban/KanbanTokenVerifyResponse";
import fs from "fs";

export class GenerateReportService {
  private readonly kanbanMetrics = [
    RequireDataEnum.VELOCITY,
    RequireDataEnum.CYCLE_TIME,
    RequireDataEnum.CLASSIFICATION,
  ].map((metric) => metric.toLowerCase());
  private readonly pipeLineMetrics = [
    RequireDataEnum.CHANGE_FAILURE_RATE,
    RequireDataEnum.DEPLOYMENT_FREQUENCY,
  ].map((metric) => metric.toLowerCase());
  private readonly codebaseMetrics = [
    RequireDataEnum.LEAD_TIME_OF_CHANGES,
  ].map((metric) => metric.toLowerCase());
  private cards?: Cards;
  private nonDonecards?: Cards;
  private jiraColumns?: JiraColumnResponse[];
  // noinspection JSMismatchedCollectionQueryUpdate
  private deployTimesListFromDeploySetting: DeployTimes[] = [];
  private deployTimesListFromLeadTimeSetting: DeployTimes[] = [];
  private leadTimes: PipelineLeadTime[] = [];
  private BuildInfos: Pair<string, BuildInfo[]>[] = [];
  private BuildInfosOfLeadtimes: Pair<string, BuildInfo[]>[] = [];

  async generateReporter(
    request: GenerateReportRequest
  ): Promise<GenerateReporterResponse> {

    if (Object.keys(request).length === 0) {
      throw new LackRequiredDataError();
    }

    if (this.requestIsEmptyButValid(request)) {
      return new GenerateReporterResponse();
    }

    await changeConsiderHolidayMode(request.considerHoliday);
    await this.fetchOriginalData(request);
    await this.generateCsvForPipeline(request);
    const reporterResponse: GenerateReporterResponse = new GenerateReporterResponse();
    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);
    const kanbanSetting = request.kanbanSetting;

    request.metrics.forEach((metric) => {
      switch (metric.toLowerCase()) {
        case RequireDataEnum.VELOCITY:
          reporterResponse.velocity = {
            velocityForSP: this.cards?.storyPointSum.toString(),
            velocityForCards: this.cards?.cardsNumber.toString(),
          };
          break;
        case RequireDataEnum.CYCLE_TIME:
          reporterResponse.cycleTime = CalculateCycleTime(
            this.cards!,
            kanbanSetting.boardColumns
          );
          break;
        case RequireDataEnum.DEPLOYMENT_FREQUENCY:
          const deploymentFrequency = calculateDeploymentFrequency(
            this.deployTimesListFromDeploySetting!,
            startTime.getTime(),
            endTime.getTime()
          );
          const avgDeploymentFrequency: AvgDeploymentFrequency =
            deploymentFrequency.value;
          const deploymentFrequencyOfPipeline: DeploymentFrequencyOfPipeline[] =
            deploymentFrequency.key;
          reporterResponse.deploymentFrequency = new DeploymentFrequency(
            avgDeploymentFrequency,
            deploymentFrequencyOfPipeline
          );
          break;
        case RequireDataEnum.CHANGE_FAILURE_RATE:
          reporterResponse.changeFailureRate = calculateChangeFailureRate(
            this.deployTimesListFromDeploySetting!
          );
          break;
        case RequireDataEnum.CLASSIFICATION:
          reporterResponse.classification = getClassificationOfSelectedFields(
            this.cards!,
            kanbanSetting.targetFields
          );
          break;
        case RequireDataEnum.LEAD_TIME_OF_CHANGES:
          const avgLeadTimeOfAllPipelines: Pair<
            LeadTimeForChangesOfPipeline[],
            AvgLeadTimeForChanges
          > = calculateAvgLeadTime(this.leadTimes);
          reporterResponse.leadTimeForChanges = new LeadTimeForChanges(
            avgLeadTimeOfAllPipelines.key,
            avgLeadTimeOfAllPipelines.value
          );
          break;
        default:
          throw new Error(`can not match this metric: ${metric}`);
      }
    });
    return reporterResponse;
  }

  protected requestIsEmptyButValid(request: GenerateReportRequest): boolean {
    return Object.keys(request).length === 8 && request.metrics.length === 0;
  }

  async fetchCsvData(dataType: string, csvTimeStamp: number): Promise<string> {
    this.deleteOldCsv();
    return await GetDataFromCsv(dataType, csvTimeStamp);
  }

  private async fetchOriginalData(
    request: GenerateReportRequest
  ): Promise<void> {
    const lowMetrics: string[] = request.metrics.map((item) =>
      item.toLowerCase()
    );
    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);

    if (lowMetrics.some((metric) => this.kanbanMetrics.includes(metric))) {
      if (request.kanbanSetting == null)
        throw new SettingMissingError("kanban setting");
      await this.fetchDataFromKanban(request);
    }

    if (lowMetrics.some((metric) => this.pipeLineMetrics.includes(metric))) {
      if (request.pipeline == null)
        throw new SettingMissingError("pipeline setting");
      await this.fetchDataFromPipeline(request, startTime, endTime);
    }

    if (lowMetrics.some((metric) => this.codebaseMetrics.includes(metric))) {
      if (request.codebaseSetting == null || request.pipeline == null)
        throw new SettingMissingError("codebase setting or pipeline setting");
      await this.fetchDataFromCodebase(request, startTime, endTime);
    }
  }

  private async fetchDataFromCodebase(
    request: GenerateReportRequest,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    const pipelineSetting = request.pipeline;
    const codebaseSetting = request.codebaseSetting;
    const pipeline: Pipeline = PipelineFactory.getInstance(
      pipelineSetting.type,
      pipelineSetting.token
    );
    const codebase: Codebase = CodebaseFactory.getInstance(
      codebaseSetting.type,
      codebaseSetting.token
    );
    for (const deploymentEnvironment of codebaseSetting.leadTime) {
      const buildInfos: BuildInfo[] = await pipeline.fetchPipelineBuilds(
        deploymentEnvironment,
        startTime,
        endTime
      );
      const deployTimes: DeployTimes = await pipeline.countDeployTimes(
        deploymentEnvironment,
        buildInfos
      );
      this.deployTimesListFromLeadTimeSetting.push(deployTimes);
      this.BuildInfosOfLeadtimes.push(
        new Pair(deploymentEnvironment.id, buildInfos)
      );
    }
    const repoMap = GenerateReportService.getRepoMap(codebaseSetting);
    this.leadTimes = await codebase.fetchPipelinesLeadTime(
      this.deployTimesListFromLeadTimeSetting,
      repoMap
    );
  }

  private static getRepoMap(
    codebaseSetting: CodebaseSetting
  ): Map<string, string> {
    return codebaseSetting.leadTime.reduce(
      (accumulator: Map<string, string>, currentValue) => {
        return accumulator.set(currentValue.id, currentValue.repository);
      },
      new Map<string, string>()
    );
  }

  private async fetchDataFromPipeline(
    request: GenerateReportRequest,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    const pipeline: Pipeline = PipelineFactory.getInstance(
      request.pipeline.type,
      request.pipeline.token
    );
    for (const deploymentEnvironment of request.pipeline.deployment) {
      const buildInfos: BuildInfo[] = await pipeline.fetchPipelineBuilds(
        deploymentEnvironment,
        startTime,
        endTime
      );
      const deployTimes: DeployTimes = await pipeline.countDeployTimes(
        deploymentEnvironment,
        buildInfos
      );
      this.deployTimesListFromDeploySetting.push(deployTimes);
      this.BuildInfos.push(new Pair(deploymentEnvironment.id, buildInfos));
    }
  }

  private async fetchDataFromKanban(
    request: GenerateReportRequest
  ): Promise<void> {
    const kanbanSetting: RequestKanbanSetting = request.kanbanSetting;
    const kanban: Kanban = KanbanFactory.getKanbanInstantiateObject(
      kanbanSetting.type,
      kanbanSetting.token,
      kanbanSetting.site
    );
    this.cards = await kanban.getStoryPointsAndCycleTime(
      new StoryPointsAndCycleTimeRequest(
        kanbanSetting.token,
        kanbanSetting.type,
        kanbanSetting.site,
        kanbanSetting.projectKey,
        kanbanSetting.boardId,
        kanbanSetting.doneColumn,
        request.startTime,
        request.endTime,
        kanbanSetting.targetFields,
        kanbanSetting.treatFlagCardAsBlock
      ),
      kanbanSetting.boardColumns,
      kanbanSetting.users
    );
    this.nonDonecards = await kanban.getStoryPointsAndCycleTimeForNonDoneCards(
      new StoryPointsAndCycleTimeRequest(
        kanbanSetting.token,
        kanbanSetting.type,
        kanbanSetting.site,
        kanbanSetting.projectKey,
        kanbanSetting.boardId,
        kanbanSetting.doneColumn,
        request.startTime,
        request.endTime,
        kanbanSetting.targetFields,
        kanbanSetting.treatFlagCardAsBlock
      ),
      kanbanSetting.boardColumns,
      kanbanSetting.users
    );
    this.jiraColumns = await kanban.getJiraColumns(
      new StoryPointsAndCycleTimeRequest(
        kanbanSetting.token,
        kanbanSetting.type,
        kanbanSetting.site,
        kanbanSetting.projectKey,
        kanbanSetting.boardId,
        kanbanSetting.doneColumn,
        request.startTime,
        request.endTime,
        kanbanSetting.targetFields,
        kanbanSetting.treatFlagCardAsBlock
      )
    );
    await ConvertBoardDataToCsv(
      this.cards.matchedCards,
      this.nonDonecards.matchedCards,
      this.jiraColumns,
      kanbanSetting.targetFields,
      request.csvTimeStamp
    );
  }

  private async generateCsvForPipeline(
    request: GenerateReportRequest
  ): Promise<void> {
    if (request.pipeline == undefined) return;

    const leadTimeData = await this.generateCsvForPipelineWithCodebase(
      request.codebaseSetting
    );

    const pipelineData = await this.generateCsvForPipelineWithoutCodebase(
      request.pipeline.deployment
    );

    await ConvertPipelineDataToCsv(
      leadTimeData.concat(pipelineData),
      request.csvTimeStamp
    );
  }

  private async generateCsvForPipelineWithCodebase(
    codebaseSetting: CodebaseSetting
  ): Promise<PipelineCsvInfo[]> {
    const csvData: PipelineCsvInfo[] = [];

    if (codebaseSetting == undefined) return csvData;

    const codebase = CodebaseFactory.getInstance(
      codebaseSetting.type,
      codebaseSetting.token
    );

    for (const deploymentEnvironment of codebaseSetting.leadTime) {
      const repoId = GenerateReportService.getRepoMap(codebaseSetting).get(
        deploymentEnvironment.id
      )!;

      const builds = this.BuildInfosOfLeadtimes.find(
        (b) => b.key == deploymentEnvironment.id
      )?.value!;
      const dataInfos: PipelineCsvInfo[] = await Promise.all(
        builds
          .filter((buildInfo) => {
            const deployInfo: DeployInfo = buildInfo.mapToDeployInfo(
              deploymentEnvironment.step,
              "passed",
              "failed"
            );
            return deployInfo.commitId != "";
          })
          .map(async (buildInfo) => {
            const deployInfo: DeployInfo = buildInfo.mapToDeployInfo(
              deploymentEnvironment.step,
              "passed",
              "failed"
            );

            const commitInfo: CommitInfo = await codebase.fetchCommitInfo(
              deployInfo.commitId,
              repoId
            );
            const leadTimeInfo: LeadTime = this.leadTimes
              .find(
                (leadTime) =>
                  leadTime.pipelineName == deploymentEnvironment.name
              )
              ?.leadTimes.find(
                (leadTime) => leadTime.commitId == deployInfo.commitId
              )!;

            return new PipelineCsvInfo(
              deploymentEnvironment.name,
              deploymentEnvironment.step,
              buildInfo,
              deployInfo,
              commitInfo,
              new LeadTimeInfo(leadTimeInfo)
            );
          })
      );

      csvData.push(...dataInfos);
    }

    return csvData;
  }

  private async generateCsvForPipelineWithoutCodebase(
    deployment: any[]
  ): Promise<PipelineCsvInfo[]> {
    const csvData: PipelineCsvInfo[] = [];
    for (const deploymentEnvironment of deployment) {
      const builds = this.BuildInfos.find(
        (b) => b.key == deploymentEnvironment.id
      )?.value!;
      const dataInfos: PipelineCsvInfo[] = await Promise.all(
        builds
          .filter((buildInfo) => {
            const deployInfo: DeployInfo = buildInfo.mapToDeployInfo(
              deploymentEnvironment.step,
              "passed",
              "failed"
            );
            return deployInfo.commitId != "";
          })
          .map(async (buildInfo) => {
            const deployInfo: DeployInfo = buildInfo.mapToDeployInfo(
              deploymentEnvironment.step,
              "passed",
              "failed"
            );

            const jobFinishTime = new Date(deployInfo.jobFinishTime).getTime();
            const pipelineStartTime: number = new Date(deployInfo.pipelineCreateTime).getTime();
            
            const noMergeDelayTime = new LeadTime(
              deployInfo.commitId,
              pipelineStartTime,
              jobFinishTime
            );

            return new PipelineCsvInfo(
              deploymentEnvironment.name,
              deploymentEnvironment.step,
              buildInfo,
              deployInfo,
              new CommitInfo(),
              new LeadTimeInfo(noMergeDelayTime)
            );
          })
      );
      csvData.push(...dataInfos);
    }

    return csvData;
  }

  private deleteOldCsv(): void {
    const files = fs.readdirSync("./csv/");
    const currentTimeStamp = new Date().getTime();
    files.forEach((file) => {
      const splitResult = file.split(/\s*\-|\.\s*/g);
      const timeStamp = splitResult[1];
      //remove csv which created 10h ago
      if (+timeStamp < currentTimeStamp - 36000000) {
        try {
          fs.unlinkSync(`./csv/${file}`);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
}
