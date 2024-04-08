import {
  config as metricsStepData,
  modifiedConfig as modifiedMetricsStepData,
} from '../../fixtures/createNew/metricsStep';
import { config as configStepData } from '../../fixtures/createNew/configStep';
import { test } from '../../fixtures/testWithExtendFixtures';
import { clearTempDir } from '../../utils/clearTempDir';
import { format } from '../../utils/dateTime';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Page jump for import', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const modifiedHbStateData = modifiedMetricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.importProjectFromFile('../fixtures/input-files/hb-e2e-for-importing-file.json');
  await configStep.goToPreviousStep();
  await configStep.cancelGoToPreviousStep();
  await configStep.waitForShown();

  await configStep.verifyAllConfig();
  await configStep.goToMetrics();
  await metricsStep.selectHistoricalAssigneeCrewFilter();
  await metricsStep.selectCrews(modifiedMetricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(modifiedMetricsStepData.cycleTime.type);
  await metricsStep.selectModifiedHeartbeatState(modifiedHbStateData);
  await metricsStep.selectCycleTimeConsiderAsBlockCheckbox();
  await metricsStep.selectClassifications(modifiedMetricsStepData.classification);
  await metricsStep.selectReworkSettings(metricsStepData.reworkTimesSettings);
  await metricsStep.goToReportPage();
  await reportStep.goToPreviousStep();
  await metricsStep.waitForShown();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.checkCrews(modifiedMetricsStepData.crews);
  await metricsStep.checkBoardByStatusRadioBoxChecked();
  await metricsStep.checkModifiedHeartbeatState(modifiedHbStateData);
  await metricsStep.checkCycleTimeConsiderAsBlockUnchecked();
  await metricsStep.checkClassifications(modifiedMetricsStepData.classification);
  await metricsStep.checkReworkSettings(metricsStepData.reworkTimesSettings);

  await metricsStep.selectDefaultGivenPipelineSetting(modifiedMetricsStepData.deployment, false);
  await metricsStep.selectGivenPipelineCrews(modifiedMetricsStepData.pipelineCrews);
  await metricsStep.goToPreviousStep();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.checkPipelineSetting(modifiedMetricsStepData.deployment);
  await metricsStep.checkBranch(modifiedMetricsStepData.deployment[0].branches);
  await metricsStep.checkPipelineCrews(modifiedMetricsStepData.pipelineCrews);

  await metricsStep.goToPreviousStep();
  await configStep.goToPreviousStep();
  await configStep.confirmGoToPreviousStep();
  await homePage.waitForShown();
});

test('Page jump for create', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );
  const modifiedHbStateData = modifiedMetricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectAllRequiredMetrics();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.fillAndVerifySourceControlForm(configStepData.sourceControl);
  await configStep.goToMetrics();

  await metricsStep.waitForShown();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.selectCrews(metricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData, true);
  await metricsStep.selectClassifications(metricsStepData.classification);
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.selectGivenPipelineCrews(metricsStepData.pipelineCrews);
  await metricsStep.selectReworkSettings(metricsStepData.reworkTimesSettings);
  await metricsStep.selectExcludeReworkSettings(metricsStepData.reworkTimesSettings);

  await metricsStep.goToPreviousStep();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();

  await metricsStep.checkCrews(metricsStepData.crews);
  await metricsStep.checkBoardByColumnRadioBoxChecked();
  await metricsStep.checkClassifications(metricsStepData.classification);
  await metricsStep.checkReworkSettings(metricsStepData.reworkTimesSettings);

  await metricsStep.selectCrews(modifiedMetricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(modifiedMetricsStepData.cycleTime.type);
  await metricsStep.selectModifiedHeartbeatState(modifiedHbStateData);
  await metricsStep.selectClassifications(modifiedMetricsStepData.classification);
  await metricsStep.selectReworkSettings(modifiedMetricsStepData.reworkTimesSettings);
  await metricsStep.selectExcludeReworkSettings(modifiedMetricsStepData.reworkTimesSettings);
  await metricsStep.goToReportPage();
  await reportStep.goToPreviousStep();
  await metricsStep.checkCrews(modifiedMetricsStepData.crews);
  await metricsStep.checkBoardByStatusRadioBoxChecked();
  await metricsStep.checkClassifications(modifiedMetricsStepData.classification);
  await metricsStep.checkReworkSettings(modifiedMetricsStepData.reworkTimesSettings);

  await metricsStep.selectDefaultGivenPipelineSetting(modifiedMetricsStepData.deployment, false);
  await metricsStep.selectGivenPipelineCrews(modifiedMetricsStepData.pipelineCrews);
  await metricsStep.goToPreviousStep();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.checkBranch(modifiedMetricsStepData.deployment[0].branches);
  await metricsStep.checkPipelineCrews(modifiedMetricsStepData.pipelineCrews);

  await metricsStep.goToPreviousStep();
  await configStep.clickPreviousButtonThenGoHome();
});
