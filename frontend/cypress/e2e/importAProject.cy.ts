import { GITHUB_TOKEN } from '../fixtures/fixtures';
import metricsPage from '../pages/metrics/metrics';
import { Metrics } from '../pages/metrics/metrics';
import configPage from '../pages/metrics/config';
import reportPage from '../pages/metrics/report';
import homePage from '../pages/home';

const metricsTextList = [
  'Board configuration',
  'Pipeline configuration',
  'Crew settings',
  'Yu Zhang',
  'Cycle time settings',
  'Real done',
  'DONE',
  'CLOSED',
  'Classification setting',
  'Issue',
  'Type',
  'Parent',
  'Pipeline settings',
];

const pipelineSettingsAutoCompleteTextList = [
  { name: 'Organization', value: 'XXXX' },
  { name: 'Step', value: 'publish gradle-cache image to cloudsmith' },
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
  'Velocity, Cycle time, Classification, Lead time for changes, Deployment frequency',
  'Jira',
  'BuildKite',
  'GitHub',
];

const textInputValues = [
  { index: 0, value: 'ConfigFileForImporting' },
  { index: 1, value: '09/01/2022' },
  { index: 2, value: '09/14/2022' },
  { index: 3, value: '1963' },
  { index: 4, value: 'test@test.com' },
  { index: 5, value: 'mockSite' },
];

const tokenInputValues = [
  { index: 0, value: 'mockToken' },
  { index: 1, value: 'mockToken' },
  { index: 2, value: `${GITHUB_TOKEN}` },
];

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

const checkMeanTimeToRecovery = () => {
  reportPage.meanTimeToRecoveryTitle.should('exist');
};

const checkPipelineToolExist = () => {
  cy.contains('Pipeline Tool').should('exist');
};

const checkInputValue = (selector, expectedValue) => {
  cy.get(selector)
    .invoke('val')
    .then((value) => {
      expect(value).to.equal(expectedValue);
    });
};

const checkRequiredFields = () => {
  metricsPage.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.doneLabel, Metrics.CYCLE_TIME_VALUE.noneValue);
  metricsPage.nextButton.should('be.disabled');
  metricsPage.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.doneLabel, Metrics.CYCLE_TIME_VALUE.doneValue);
  metricsPage.clickRealDone();
  metricsPage.nextButton.should('be.enabled');

  metricsPage.classificationClear.click({ force: true });
  metricsPage.nextButton.should('be.disabled');
  metricsPage.clickClassification();
  metricsPage.nextButton.should('be.enabled');
};

const checkProjectConfig = () => {
  cy.wait(2000);
  cy.fixture('config.json').then((localFileContent) => {
    cy.readFile('cypress/downloads/config.json').then((fileContent) => {
      expect(fileContent.sourceControl.token).to.eq(GITHUB_TOKEN);
      for (const key in localFileContent) {
        expect(fileContent[key]).to.deep.eq(localFileContent[key]);
      }
    });
  });
};

describe('Import project from file', () => {
  beforeEach(() => {
    cy.waitForNetworkIdlePrepare({
      method: '*',
      pattern: '/api/**',
      alias: 'api',
    });
  });

  it('Should import a new config project manually', () => {
    homePage.navigate();

    homePage.importProjectFromFile('NewConfigFileForImporting.json');
    cy.url().should('include', '/metrics');
    checkPipelineToolExist();
    checkInputValue('.MuiInput-input', 'ConfigFileForImporting');

    cy.waitForNetworkIdle('@api', 2000);
    configPage.verifyAndClickNextToMetrics();

    configPage.goMetricsStep();

    checkFieldsExist(metricsTextList);
    checkPipelineSettingsAutoCompleteFields(pipelineSettingsAutoCompleteTextList);
    checkCycleTimeSettingsAutoCompleteFields(cycleTimeSettingsAutoCompleteTextList);

    checkRequiredFields();

    metricsPage.goReportStep();

    reportPage.pageIndicator.should('exist');

    checkMeanTimeToRecovery();

    reportPage.exportProjectConfig();

    // checkProjectConfig();

    reportPage.backToMetricsStep();

    checkFieldsExist(metricsTextList);
    checkPipelineSettingsAutoCompleteFields(pipelineSettingsAutoCompleteTextList);
    checkCycleTimeSettingsAutoCompleteFields(cycleTimeSettingsAutoCompleteTextList);

    metricsPage.BackToConfigStep();

    checkFieldsExist(configTextList);

    checkTextInputValuesExist(textInputValues);

    checkTokenInputValuesExist(tokenInputValues);
  });

  it('Should import a old config project manually', () => {
    homePage.navigate();

    homePage.importProjectFromFile('OldConfigFileForImporting.json');
    cy.url().should('include', '/metrics');
    checkPipelineToolExist();
    checkInputValue('.MuiInput-input', 'ConfigFileForImporting');

    cy.waitForNetworkIdle('@api', 2000);
    configPage.verifyAndClickNextToMetrics();

    configPage.goMetricsStep();

    checkFieldsExist(metricsTextList);
    checkPipelineSettingsAutoCompleteFields(pipelineSettingsAutoCompleteTextList);
    checkCycleTimeSettingsAutoCompleteFields(cycleTimeSettingsAutoCompleteTextList);

    metricsPage.goReportStep();

    reportPage.pageIndicator.should('exist');

    checkMeanTimeToRecovery();

    reportPage.backToMetricsStep();

    checkFieldsExist(metricsTextList);
    checkPipelineSettingsAutoCompleteFields(pipelineSettingsAutoCompleteTextList);
    checkCycleTimeSettingsAutoCompleteFields(cycleTimeSettingsAutoCompleteTextList);

    metricsPage.BackToConfigStep();

    checkFieldsExist(configTextList);

    checkTextInputValuesExist(textInputValues);

    checkTokenInputValuesExist(tokenInputValues);
  });
});
