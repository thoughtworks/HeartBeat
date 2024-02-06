import { GITHUB_TOKEN, PIPELINE_TOKEN } from '../fixtures/fixtures';
import { TIPS } from '../../src/constants/resources';
import metricsPage from '../pages/metrics/metrics';
import configPage from '../pages/metrics/config';
import reportPage from '../pages/metrics/report';
import homePage from '../pages/home';

const pipelineSettingsAutoCompleteTextList = [
  { name: 'Organization', value: 'XXXX' },
  { name: 'Step', value: 'RECORD RELEASE TO PROD' },
];

const cycleTimeSettingsAutoCompleteTextList = [
  { name: 'In Analysis', value: 'Analysis' },
  { name: 'Ready For Dev', value: 'To do' },
  { name: 'In Dev', value: 'In Dev' },
  { name: 'Blocked', value: 'Block' },
  { name: 'Ready For Test', value: 'Waiting for testing' },
  { name: 'In Test', value: 'Testing' },
  { name: 'Ready to Deploy', value: 'Review' },
  { name: 'Done', value: 'Done' },
];

const configTextList = [
  'Project name *',
  'Velocity, Cycle time, Classification, Lead time for changes, Deployment frequency, Change failure rate, Mean time to recovery',
  'Jira',
  'BuildKite',
  'GitHub',
];

const textInputValues = [
  { index: 0, value: 'E2E Project' },
  { index: 1, value: '09/01/2022' },
  { index: 2, value: '09/14/2022' },
  { index: 3, value: '1963' },
  { index: 4, value: 'test@test.com' },
  { index: 5, value: 'site' },
];

const tokenInputValues = [
  { index: 0, value: 'mockToken' },
  { index: 1, value: PIPELINE_TOKEN },
  { index: 2, value: GITHUB_TOKEN },
];

const checkCycleTimeTooltip = () => {
  metricsPage.cycleTimeTitleTooltip.trigger('mouseover');
  cy.contains(TIPS.CYCLE_TIME).should('be.visible');
};

const clearDownloadFile = () => {
  cy.task('clearDownloads');
  cy.wait(500);
};

const checkFieldsExist = (fields: string[]) => {
  fields.forEach((item) => {
    cy.contains(item).should('exist');
  });
};

const checkPipelineSettingsAutoCompleteFields = (fields: { name: string; value: string }[]) => {
  fields.forEach((item) => {
    metricsPage.getPipelineSettingsAutoCompleteField(item.name).find('input').should('have.value', item.value);
  });
};

const checkCycleTimeSettingsAutoCompleteFields = (fields: { name: string; value: string }[]) => {
  fields.forEach((item) => {
    metricsPage.getCycleTimeSettingsAutoCompleteField(item.name).find('input').should('have.value', item.value);
  });
};

const checkTextInputValuesExist = (fields: { index: number; value: string }[]) => {
  fields.forEach(({ index, value }) => {
    cy.get('.MuiInputBase-root input[type="text"]').eq(index).should('have.value', value);
  });
};

const checkTokenInputValuesExist = (fields: { index: number; value: string }[]) => {
  fields.forEach(({ index, value }) => {
    cy.get('[type="password"]').eq(index).should('have.value', value);
  });
};

describe('Create a new project', () => {
  beforeEach(() => {
    cy.waitForNetworkIdlePrepare({
      method: '*',
      pattern: '/api/**',
      alias: 'api',
    });
  });

  it('Should create a new project manually', () => {
    cy.log(Cypress.env('ENV_VAR_TEST'));

    homePage.navigate();

    homePage.headerVersion.should('exist');

    homePage.createANewProject();
    cy.url().should('include', '/metrics');

    configPage.typeProjectName('E2E Project');

    configPage.goHomePage();
    cy.url().should('include', '/');

    homePage.createANewProject();
    cy.contains('Project name *').should('have.value', '');

    configPage.typeProjectName('E2E Project');

    configPage.selectDateRange();

    configPage.nextStepButton.should('be.disabled');

    configPage.selectMetricsData();

    configPage.fillBoardInfoAndVerifyWithJira('1963', 'test@test.com', 'site', Cypress.env('TOKEN_JIRA'));
    configPage.getVerifiedButton(configPage.boardConfigSection).should('be.disabled');
    configPage.getResetButton(configPage.boardConfigSection).should('be.enabled');

    configPage.fillPipelineToolFieldsInfoAndVerify(Cypress.env('TOKEN_BUILD_KITE'));

    configPage.fillSourceControlFieldsInfoAndVerify(Cypress.env('TOKEN_GITHUB'));

    configPage.nextStepButton.should('be.enabled');

    configPage.CancelBackToHomePage();

    configPage.goMetricsStep();

    metricsPage.checkDateRange();

    configPage.nextStepButton.should('be.disabled');

    checkCycleTimeTooltip();

    metricsPage.checkCycleTime();

    cy.contains('Real done').should('exist');

    metricsPage.clickRealDone();

    metricsPage.clickClassification();

    metricsPage.pipelineSettingTitle.should('be.exist');

    metricsPage.addOneCorrectPipelineConfig(0);
    metricsPage.selectBranchOption();

    metricsPage.addOnePipelineButton.click();
    metricsPage.addOneErrorPipelineConfig(1);
    metricsPage.buildKiteStepNotFoundTips.should('exist');
    metricsPage.pipelineRemoveButton.click();

    metricsPage.addOnePipelineButton.click();
    metricsPage.addOneCorrectPipelineConfig(1);
    cy.contains('This pipeline is the same as another one!').should('exist');
    metricsPage.pipelineRemoveButton.click();

    configPage.nextStepButton.should('be.enabled');

    metricsPage.goReportStep();

    reportPage.pageIndicator.should('be.visible');

    reportPage.firstNotification.should('exist');

    reportPage.checkDateRange();
    // Comment out these test cases before refactoring E2E

    // checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.VELOCITY}"]`, velocityData);
    //
    // checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.CYCLE_TIME}"]`, cycleTimeData);
    //
    // checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.DEPLOYMENT_FREQUENCY}"]`, deploymentFrequencyData);
    //
    // checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.MEAN_TIME_TO_RECOVERY}"]`, meanTimeToRecoveryData);
    //
    // checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.LEAD_TIME_FOR_CHANGES}"]`, leadTimeForChangeData);
    //
    // checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.CHANGE_FAILURE_RATE}"]`, changeFailureRateData);
    //
    clearDownloadFile();

    reportPage.exportMetricDataButton.should('be.enabled');

    reportPage.exportMetricData();

    // checkMetricCSV();

    reportPage.exportPipelineDataButton.should('be.enabled');

    reportPage.exportPipelineData();

    // checkPipelineCSV();

    reportPage.exportBoardDataButton.should('be.enabled');

    reportPage.exportBoardData();

    // checkBoardCSV();

    reportPage.firstNotification.should('not.exist');

    // checkBoardShowMore();
    // checkDoraShowMore();

    // checkpoint back to metrics step
    reportPage.backToMetricsStep();

    // checkFieldsExist(metricsTextList);
    checkPipelineSettingsAutoCompleteFields(pipelineSettingsAutoCompleteTextList);
    checkCycleTimeSettingsAutoCompleteFields(cycleTimeSettingsAutoCompleteTextList);

    // checkpoint back to config step
    metricsPage.BackToConfigStep();

    checkFieldsExist(configTextList);
    checkTextInputValuesExist(textInputValues);
    checkTokenInputValuesExist(tokenInputValues);
  });
});
