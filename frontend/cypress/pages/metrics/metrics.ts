export class Metrics {
  static CYCLE_TIME_LABEL = {
    analysisLabel: 'In Analysis',
    todoLabel: 'Ready For Dev',
    inDevLabel: 'In Dev',
    blockLabel: 'Blocked',
    waitingLabel: 'Ready For Test',
    testingLabel: 'In Test',
    reviewLabel: 'Ready to Deploy',
    doneLabel: 'Done',
  };
  static CYCLE_TIME_VALUE = {
    analysisValue: 'Analysis',
    todoValue: 'To do',
    inDevValue: 'In Dev',
    blockValue: 'Block',
    waitingValue: 'Waiting for testing',
    testingValue: 'Testing',
    reviewValue: 'Review',
    doneValue: 'Done',
    noneValue: '----',
  };

  get realDoneSelect() {
    return cy.contains('label', 'Consider as Done').parent();
  }

  get RealDoneSelectAllOption() {
    return cy.contains('All');
  }

  get closeModelElement() {
    return cy.get(
      '.Mui-expanded > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiAutocomplete-popupIndicator > [data-testid="ArrowDropDownIcon"] > path',
    );
  }

  get classificationSelect() {
    return cy.contains('label', 'Distinguished By').parent();
  }

  get classificationSelectAllOption() {
    return cy.contains('All');
  }

  get pipelineSettingTitle() {
    return cy.contains('Pipeline settings');
  }

  get pipelineOfOrgXXXX() {
    return cy.get('li[role="option"]').contains('XXXX');
  }

  get pipelineSelectOneOption() {
    return cy.get('li[role="option"]').contains('fs-platform-payment-selector');
  }

  get stepSelectSomeOption() {
    return cy.get('li[role="option"]').contains('RECORD RELEASE TO PROD');
  }

  get addOnePipelineButton() {
    return cy.get('[data-testid="AddIcon"]:first');
  }

  get classificationClear() {
    return this.classificationSelect.find('[aria-label="Clear"]');
  }

  get pipelineSelectOnboardingOption() {
    return cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-onboarding")');
  }

  get pipelineSelectUIOption() {
    return cy.get('li[role="option"]').contains('payment-selector-ui');
  }

  get buildKiteStepNotFoundTips() {
    return cy.contains('Failed to get BuildKite steps: Not found');
  }

  get pipelineRemoveButton() {
    return cy.get('[data-test-id="remove-button"]').eq(1);
  }

  get branchSelect() {
    return cy.contains('Branches').eq(0).siblings();
  }

  get branchSelectSomeOption() {
    return cy.contains('All');
  }

  get pipelineStepSelectXXOption() {
    return cy.get('[data-test-id="single-selection-step"]:contains("RECORD RELEASE TO UAT"):last');
  }

  get pipelineStepXXOption() {
    return cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui")');
  }

  get leadTimeForChangeAddOneButton() {
    return cy.get('[data-testid="AddIcon"]:last');
  }

  get headerBar() {
    return cy.get('[data-test-id="Header"]');
  }

  get nextButton() {
    return cy.contains('Next');
  }

  get backButton() {
    return cy.contains('Previous');
  }

  get cycleTimeTitleTooltip() {
    return cy.get('[data-test-id="tooltip');
  }

  get dateRange() {
    return cy.get('[data-test-id="date-range"]');
  }

  chooseDropdownOption = (label: string, value: string) => {
    this.getCycleTimeSettingsAutoCompleteField(label).click();
    cy.get('li[role="option"]').contains(value).click();
  };

  getStepOfSomePipelineSelect = (i: number) => cy.get('[data-test-id="single-selection-step"]').eq(i);

  getOrganizationSelect = (i: number) => cy.get('[data-test-id="single-selection-organization"]').eq(i);

  getPipelineSelect = (i: number) => cy.get('[data-test-id="single-selection-pipeline-name"]').eq(i);
  getCycleTimeSettingsAutoCompleteField = (name: string) => cy.get(`[aria-label="Cycle time select for ${name}"]`);
  getPipelineSettingsAutoCompleteField = (name: string) => cy.contains(name).siblings().eq(0);

  checkCycleTime() {
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.analysisLabel, Metrics.CYCLE_TIME_VALUE.analysisValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.todoLabel, Metrics.CYCLE_TIME_VALUE.todoValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.inDevLabel, Metrics.CYCLE_TIME_VALUE.inDevValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.blockLabel, Metrics.CYCLE_TIME_VALUE.blockValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.waitingLabel, Metrics.CYCLE_TIME_VALUE.waitingValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.testingLabel, Metrics.CYCLE_TIME_VALUE.testingValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.reviewLabel, Metrics.CYCLE_TIME_VALUE.reviewValue);
    this.chooseDropdownOption(Metrics.CYCLE_TIME_LABEL.doneLabel, Metrics.CYCLE_TIME_VALUE.doneValue);
  }

  clickRealDone() {
    this.realDoneSelect.click();

    this.RealDoneSelectAllOption.click();
    this.closeModelElement.click({ force: true });
  }

  clickClassification() {
    this.classificationSelect.click();

    this.classificationSelectAllOption.click();
    this.closeModelElement.click({ force: true });
  }

  addOneCorrectPipelineConfig(position = 0) {
    this.getOrganizationSelect(position).click();
    this.pipelineOfOrgXXXX.click();
    this.getPipelineSelect(position).click();
    cy.waitForNetworkIdle('@api', 2000);
    this.pipelineSelectOneOption.click();
    this.getStepOfSomePipelineSelect(position).click();
    this.stepSelectSomeOption.click();
  }

  selectBranchOption() {
    this.branchSelect.click();
    this.branchSelectSomeOption.click();
    this.closeOptions();
  }

  addOneErrorPipelineConfig(position = 0) {
    this.getOrganizationSelect(position).click();
    this.pipelineOfOrgXXXX.click();
    this.getPipelineSelect(position).click();
    cy.waitForNetworkIdle('@api', 2000);
    this.pipelineSelectUIOption.click();
  }

  closeOptions() {
    this.headerBar.click();
  }

  goReportStep() {
    this.nextButton.click();
  }

  BackToConfigStep() {
    this.backButton.click();
  }

  checkDateRange = () => {
    this.dateRange.contains('2022/09/01');
    this.dateRange.contains('2022/09/14');
  };
}

const metricsPage = new Metrics();
export default metricsPage;
