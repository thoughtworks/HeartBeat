import { GITHUB_TOKEN, METRICS_TITLE } from '../fixtures/fixtures';
import homePage from '../pages/home';
import configPage from '../pages/metrics/config';
import metricsPage from '../pages/metrics/metrics';
import reportPage from '../pages/metrics/report';
import { TIPS } from '../../src/constants/resources';

const cycleTimeData = [
  { label: 'Average Cycle Time(Days/SP)', value: '7.64' },
  { label: 'Average Cycle Time(Days/Card)', value: '9.55' },
];

const velocityData = [
  { label: 'Velocity(Story Point)', value: '17.5' },
  { label: 'Throughput(Cards Count)', value: '14' },
];

const deploymentFrequencyData = [{ label: 'Deployment Frequency(Deployments/Day)', value: '3.91' }];

const meanTimeToRecoveryData = [{ label: 'Mean Time To Recovery(Hours)', value: '8.55' }];

const leadTimeForChangeData = [
  { label: 'PR Lead Time(Hours)', value: '0.00' },
  { label: 'Pipeline Lead Time(Hours)', value: '-15.30' },
  { label: 'Total Lead Time(Hours)', value: '-15.30' },
];

const changeFailureRateData = [{ label: 'Failure Rate', value: '42.67' }];

const metricsTextList = [
  'Board configuration',
  'Pipeline configuration',
  'Crew settings',
  'Brian Ong',
  'Harsh Singal',
  'Prashant Agarwal',
  'Sumit Narang',
  'Yu Zhang',
  'Peihang Yu',
  'Mengyang Sun',
  'HanWei Wang',
  'Aaron Camilleri',
  'Qian Zhang',
  'Gerard Ho',
  'Anthony Tse',
  'Yonghee Jeon Jeon',
  'Cycle time settings',
  'Real done',
  'Classification setting',
  'Issue Type',
  'Has Dependancies',
  'FS R&D Classification',
  'Parent',
  'Components',
  'DONE',
  'CLOSED',
  'Project',
  'Reporter',
  'Parent Link',
  'Fix versions',
  'Priority',
  'Paired Member',
  'Labels',
  'Story Points',
  'Sprint',
  'Epic Link',
  'Assignee',
  'FS Work Categorization',
  'FS Work Type',
  'Epic Name',
  'Acceptance Criteria',
  'Environment',
  'Affects versions',
  'FS Domains',
  'PIR Completed',
  'Team',
  'Incident Priority',
  'Resolution Details',
  'Time to Resolution - Hrs',
  'Time to Detect - Hrs',
  'Cause by - System',
  'Pipeline settings',
];

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
  'Classic Jira',
  'BuildKite',
  'GitHub',
];

const textInputValues = [
  { index: 0, value: 'E2E Project' },
  { index: 1, value: '09/01/2022' },
  { index: 2, value: '09/14/2022' },
  { index: 3, value: '1963' },
  { index: 4, value: 'test@test.com' },
  { index: 5, value: 'PLL' },
  { index: 6, value: 'site' },
];

const tokenInputValues = [
  { index: 0, value: 'mockToken' },
  { index: 1, value: 'mock1234'.repeat(5) },
  { index: 2, value: `${GITHUB_TOKEN}` },
];

interface MetricsDataItem {
  label: string;
  value?: string;
}

const checkMetricsCalculation = (testId: string, boardData: MetricsDataItem[]) => {
  cy.get(testId).should('exist');
  cy.get(testId)
    .children('[data-test-id="report-section"]')
    .children()
    .each((section, index) => {
      cy.wrap(section).within(() => {
        cy.contains(boardData[index].label).should('exist');
        cy.contains(boardData[index].value).should('exist');
      });
    });
};

const checkBoardShowMore = () => {
  reportPage.showMoreBoardButton.should('exist');
  reportPage.goToBoardDetailPage();
  cy.get(`[data-test-id="${METRICS_TITLE.VELOCITY}"]`).find('tbody > tr').should('have.length', 2);
  cy.get(`[data-test-id="${METRICS_TITLE.CYCLE_TIME}"]`).find('tbody > tr').should('have.length', 17);
  cy.get(`[data-test-id="${METRICS_TITLE.CLASSIFICATION}"]`).find('tbody > tr').should('have.length', 122);

  reportPage.exportBoardData();
  checkBoardCSV();

  reportPage.boardGoToReportPage();
};

const checkDoraShowMore = () => {
  reportPage.showMoreDoraButton.should('exist');
  reportPage.goToDoraDetailPage();

  cy.get(`[data-test-id="${METRICS_TITLE.DEPLOYMENT_FREQUENCY}"]`).find('tbody > tr').should('have.length', 2);
  cy.get(`[data-test-id="${METRICS_TITLE.LEAD_TIME_FOR_CHANGES}"]`).find('tbody > tr').should('have.length', 4);
  cy.get(`[data-test-id="${METRICS_TITLE.CHANGE_FAILURE_RATE}"]`).find('tbody > tr').should('have.length', 2);
  cy.get(`[data-test-id="${METRICS_TITLE.MEAN_TIME_TO_RECOVERY}"]`).find('tbody > tr').should('have.length', 2);

  reportPage.exportPipelineData();
  checkPipelineCSV();

  reportPage.doraGoToReportPage();
};

const checkCycleTimeTooltip = () => {
  metricsPage.cycleTimeTitleTooltip.trigger('mouseover');
  cy.contains(TIPS.CYCLE_TIME).should('be.visible');
};

const clearDownloadFile = () => {
  cy.task('clearDownloads');
  cy.wait(500);
};

const checkMetricCSV = () => {
  cy.wait(2000);
  cy.fixture('metric.csv').then((localFileContent) => {
    cy.task('readDir', 'cypress/downloads').then((files: string[]) => {
      expect(files).to.match(new RegExp(/metric-.*\.csv/));
      files.forEach((file: string) => {
        if (file.match(/metric-.*\.csv/)) {
          cy.readFile(`cypress/downloads/${file}`).then((fileContent) => {
            expect(fileContent).to.contains(localFileContent);
          });
        }
      });
    });
  });
};

const checkPipelineCSV = () => {
  cy.wait(2000);
  return cy.task('readDir', 'cypress/downloads').then((files) => {
    expect(files).to.match(new RegExp(/pipeline-.*\.csv/));
  });
};

const checkBoardCSV = () => {
  cy.wait(2000);
  return cy.task('readDir', 'cypress/downloads').then((files) => {
    expect(files).to.match(new RegExp(/board-.*\.csv/));
  });
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

    configPage.fillBoardInfoAndVerifyWithClassicJira('1963', 'test@test.com', 'PLL', 'site', 'mockToken');
    configPage.getVerifiedButton(configPage.boardConfigSection).should('be.disabled');
    configPage.getResetButton(configPage.boardConfigSection).should('be.enabled');

    configPage.fillPipelineToolFieldsInfoAndVerify('mock1234'.repeat(5));

    configPage.fillSourceControlFieldsInfoAndVerify(`${GITHUB_TOKEN}`);

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

    checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.VELOCITY}"]`, velocityData);

    checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.CYCLE_TIME}"]`, cycleTimeData);

    checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.DEPLOYMENT_FREQUENCY}"]`, deploymentFrequencyData);

    checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.MEAN_TIME_TO_RECOVERY}"]`, meanTimeToRecoveryData);

    checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.LEAD_TIME_FOR_CHANGES}"]`, leadTimeForChangeData);

    checkMetricsCalculation(`[data-test-id="${METRICS_TITLE.CHANGE_FAILURE_RATE}"]`, changeFailureRateData);

    clearDownloadFile();

    reportPage.exportMetricDataButton.should('be.enabled');

    reportPage.exportMetricData();

    checkMetricCSV();

    reportPage.exportPipelineDataButton.should('be.enabled');

    reportPage.exportPipelineData();

    checkPipelineCSV();

    reportPage.exportBoardDataButton.should('be.enabled');

    reportPage.exportBoardData();

    checkBoardCSV();

    reportPage.firstNotification.should('not.exist');

    checkBoardShowMore();
    checkDoraShowMore();

    // checkpoint back to metrics step
    reportPage.backToMetricsStep();

    checkFieldsExist(metricsTextList);
    checkPipelineSettingsAutoCompleteFields(pipelineSettingsAutoCompleteTextList);
    checkCycleTimeSettingsAutoCompleteFields(cycleTimeSettingsAutoCompleteTextList);

    // checkpoint back to config step
    metricsPage.BackToConfigStep();

    checkFieldsExist(configTextList);
    checkTextInputValuesExist(textInputValues);
    checkTokenInputValuesExist(tokenInputValues);
  });
});
