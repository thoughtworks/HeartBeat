import { config as metricsStepData } from '../../fixtures/create-new/metrics-step';
import { config as configStepData } from '../../fixtures/create-new/config-step';
import { test } from '../../fixtures/test-with-extend-fixtures';
import { clearTempDir } from '../../utils/clear-temp-dir';
import { format } from '../../utils/date-time';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Only select velocity metrics on config page', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectVelocityRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormInvisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationInvisible();
  await metricsStep.checkClassificationSettingInvisible();
  await metricsStep.selectCrews(metricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData, true);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkExportMetricDataButtonClickable();
  await reportStep.checkExportBoardDataButtonClickable();
  await reportStep.clickShowMoreLink();
  await reportStep.checkOnlyVelocityPartVisible();
});

test('Only select cycle time metrics on config page', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectCycleTimeRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormInvisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationInvisible();
  await metricsStep.checkClassificationSettingInvisible();
  await metricsStep.selectCrews(metricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData, true);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkExportMetricDataButtonClickable();
  await reportStep.checkExportBoardDataButtonClickable();
  await reportStep.clickShowMoreLink();
  await reportStep.checkOnlyCycleTimePartVisible();
});

test('Only select classification metrics on config page', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectClassificationRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormInvisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationInvisible();
  await metricsStep.checkClassificationSettingVisible();
  await metricsStep.selectCrews(metricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData, true);
  await metricsStep.selectClassifications(metricsStepData.classification);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkExportBoardDataButtonClickable();
  await reportStep.checkOnlyClassificationPartVisible();
});

test('Only select rework times metrics on config page', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectReworkTimesRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormInvisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationInvisible();
  await metricsStep.checkClassificationSettingInvisible();
  await metricsStep.selectCrews(metricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData, true);
  await metricsStep.selectReworkSettings(metricsStepData.reworkTimesSettings);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkExportBoardDataButtonClickable();
  await reportStep.clickShowMoreLink();
  await reportStep.checkOnlyReworkTimesPartVisible();
});

test('Only select lead time for changes metrics on config page', async ({
  homePage,
  configStep,
  metricsStep,
  reportStep,
}) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectLeadTimeForChangesMetrics();
  await configStep.checkBoardFormInvisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormVisible();
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.fillAndVerifySourceControlForm(configStepData.sourceControl);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationInvisible();
  await metricsStep.checkPipelineConfigurationVisible();
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.goToReportPage();

  await reportStep.checkOnlyLeadTimeForChangesPartVisible();
  await reportStep.checkExportMetricDataButtonClickable();
  await reportStep.checkExportPipelineDataButtonClickable();
});

test('Only select deployment frequency metrics on config page', async ({
  homePage,
  configStep,
  metricsStep,
  reportStep,
}) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectDeploymentFrequencyMetrics();
  await configStep.checkBoardFormInvisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationInvisible();
  await metricsStep.checkPipelineConfigurationVisible();
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.goToReportPage();

  await reportStep.checkOnlyDeploymentFrequencyPartVisible();
  await reportStep.checkExportMetricDataButtonClickable();
  await reportStep.checkExportPipelineDataButtonClickable();
});

test('Only select change failure rate metrics on config page', async ({
  homePage,
  configStep,
  metricsStep,
  reportStep,
}) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectChangeFailureRateMetrics();
  await configStep.checkBoardFormInvisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationInvisible();
  await metricsStep.checkPipelineConfigurationVisible();
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.goToReportPage();

  await reportStep.checkOnlyChangeFailureRatePartVisible();
  await reportStep.checkExportMetricDataButtonClickable();
  await reportStep.checkExportPipelineDataButtonClickable();
});

test('Only select mean time to recovery metrics on config page', async ({
  homePage,
  configStep,
  metricsStep,
  reportStep,
}) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectMeanTimeToRecoveryMetrics();
  await configStep.checkBoardFormInvisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationInvisible();
  await metricsStep.checkPipelineConfigurationVisible();
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.goToReportPage();

  await reportStep.checkOnlyMeanTimeToRecoveryPartVisible();
  await reportStep.checkExportMetricDataButtonClickable();
  await reportStep.checkExportPipelineDataButtonClickable();
});
