import { config as configStepData } from '../fixtures/configStep';
import { test } from '../fixtures/testWithExtendFixtures';
import { CONFIG_STEP_SAVING_FILENAME } from '../fixtures';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';

const clearTempDir = async () => {
  try {
    const configStepSavePath = path.resolve(__dirname, '..', './temp/', `./${CONFIG_STEP_SAVING_FILENAME}`);
    const isExist = fs.existsSync(configStepSavePath);
    if (isExist) {
      fs.rmSync(configStepSavePath);
    }
  } finally {
    console.log('e2e/temp/ dir cleared, going to start testing suite.');
  }
};

test.beforeAll(async () => {
  await clearTempDir();
});

test('Create a new project', async ({ homePage, configStep, metricsStep }) => {
  const dateRange = {
    startDate: dayjs(configStepData.dateRange.startDate).format('MM/DD/YYYY'),
    endDate: dayjs(configStepData.dateRange.endDate).format('MM/DD/YYYY'),
  };

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.clickPreviousButtonThenGoHome();
  await homePage.createANewProject();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.typeInDateRange(dateRange);
  await configStep.validateNextButtonNotClickable();
  await configStep.selectAllRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormVisible();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.resetBoardConfig();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.fillAndVerifySourceControlForm(configStepData.sourceControl);
  await configStep.saveConfigStepAsJSONThenVerifyDownloadFile(configStepData);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.waitForShown();
  await metricsStep.validateNextButtonNotClickable();
  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationVisible();
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeConsiderCheckboxChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();
});
