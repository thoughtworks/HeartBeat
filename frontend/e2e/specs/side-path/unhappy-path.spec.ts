import {
  importInputWrongProjectFromFile as importUnhappyPathProjectFromFile,
  importModifiedCorrectConfig as modifiedCorrectProjectFromFile,
} from '../../fixtures/importFile/unhappy-path-file';
import { BOARD_METRICS_RESULT, DORA_METRICS_RESULT } from '../../fixtures/createNew/reportResult';
import { test } from '../../fixtures/testWithExtendFixtures';
import { clearTempDir } from '../../utils/clearTempDir';
import { format } from '../../utils/dateTime';

test.beforeAll(async () => {
  await clearTempDir();
});

test('unhappy path when import file', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(modifiedCorrectProjectFromFile.dateRange.startDate),
    endDate: format(modifiedCorrectProjectFromFile.dateRange.endDate),
  };

  const hbStateData = importUnhappyPathProjectFromFile.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  const ModifiedhbStateData = modifiedCorrectProjectFromFile.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();

  await homePage.importProjectFromFile('../fixtures/input-files/unhappy-path-config-file.json');
  await configStep.checkRemindImportedDataNotMatched();
  await configStep.checkProjectName(importUnhappyPathProjectFromFile.projectName);
  await configStep.verifyAllConfig();
  await configStep.checkAllConfigInvalid();
  await configStep.validateNextButtonNotClickable();
  await configStep.typeInProjectName(modifiedCorrectProjectFromFile.projectName);
  await configStep.fillAndVerifyBoardTokenConfig(modifiedCorrectProjectFromFile.board.token);
  await configStep.fillAndVerifySourceControlForm(modifiedCorrectProjectFromFile.sourceControl);
  await configStep.fillAndVerifyPipelineToolForm(modifiedCorrectProjectFromFile.pipelineTool);

  await configStep.goToMetrics();

  await metricsStep.checkBoardNoCard();
  await metricsStep.checkPipelineFillNoStep(importUnhappyPathProjectFromFile.deployment);
  await metricsStep.goToPreviousStep();
  await configStep.typeInDateRange(dateRange);
  await configStep.goToMetrics();

  await metricsStep.checkCrews(importUnhappyPathProjectFromFile.crews);
  await metricsStep.checkNoCrewsReminder();
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.checkHeartbeatStateIsSet(hbStateData, true);
  await metricsStep.checkClassifications(importUnhappyPathProjectFromFile.classification);
  await metricsStep.checkPipelineConfigurationAreChanged(importUnhappyPathProjectFromFile.deployment);
  await metricsStep.checkBranchIsInvalid();
  await metricsStep.selectCrews(modifiedCorrectProjectFromFile.crews);
  await metricsStep.deselectBranch(modifiedCorrectProjectFromFile.deletedBranch);
  await metricsStep.addNewPipelineAndSelectSamePipeline(importUnhappyPathProjectFromFile.deployment);
  await metricsStep.RemoveFirstNewPipeline();
  await metricsStep.selectDoneHeartbeatState(ModifiedhbStateData[6]);
  await metricsStep.validateNextButtonNotClickable();
  await metricsStep.selectDoneHeartbeatState(hbStateData[6]);
  await metricsStep.selectReworkSettings(modifiedCorrectProjectFromFile.reworkTimesSettings);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetrics(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
    BOARD_METRICS_RESULT.totalReworkTimes,
    BOARD_METRICS_RESULT.totalReworkCards,
    BOARD_METRICS_RESULT.reworkCardsRatio,
    BOARD_METRICS_RESULT.throughput,
  );
  await reportStep.checkDoraMetrics(
    DORA_METRICS_RESULT.PrLeadTime,
    DORA_METRICS_RESULT.PipelineLeadTime,
    DORA_METRICS_RESULT.TotalLeadTime,
    DORA_METRICS_RESULT.DeploymentFrequency,
    DORA_METRICS_RESULT.FailureRate,
    DORA_METRICS_RESULT.DevMeanTimeToRecovery,
  );
});
