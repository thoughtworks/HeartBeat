class Config {
  get backButton() {
    return cy.contains('button', 'Previous');
  }

  get yesButton() {
    return cy.contains('button', 'Yes');
  }

  get cancelButton() {
    return cy.contains('button', 'Cancel');
  }

  get projectNameInput() {
    return this.basicInformationConfigSection.contains('label', 'Project name').parent();
  }

  get collectionDateFrom() {
    return this.basicInformationConfigSection.contains('label', 'From').parent();
  }

  get requiredDataSelect() {
    return this.basicInformationConfigSection.contains('label', 'Required metrics').parent();
  }

  get requiredDataAllSelectOption() {
    return cy.contains('All');
  }

  get requiredDataModelCloseElement() {
    return cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop');
  }

  get boardInfoSelectionJira() {
    return cy.contains('Jira');
  }

  get boardInfoBoardIdInput() {
    return this.boardConfigSection.contains('label', 'Board Id').parent();
  }

  get boardInfoEmailInput() {
    return this.boardConfigSection.contains('label', 'Email').parent();
  }

  get boardInfoSiteInput() {
    return this.boardConfigSection.contains('label', 'Site').parent();
  }

  get boardInfoTokenInput() {
    return this.boardConfigSection.contains('label', 'Token').parent();
  }

  get basicInformationConfigSection() {
    return cy.get('[aria-label="Basic information"]');
  }

  get boardConfigSection() {
    return cy.get('[aria-label="Board Config"]');
  }

  get pipelineToolConfigSection() {
    return cy.get('[aria-label="Pipeline Tool Config"]');
  }

  get sourceControlConfigSection() {
    return cy.get('[aria-label="Source Control Config"]');
  }

  get nextStepButton() {
    return cy.contains('button', 'Next');
  }

  get boardVerifyButton() {
    return this.getVerifyButton(this.boardConfigSection);
  }

  get pipelineToolTokenInput() {
    return this.pipelineToolConfigSection.contains('label', 'Token').parent();
  }

  get pipelineToolVerifyButton() {
    return this.getVerifyButton(this.pipelineToolConfigSection);
  }

  get sourceControlTokenInput() {
    return this.sourceControlConfigSection.contains('label', 'Token').parent();
  }

  get sourceControlVerifyButton() {
    return this.getVerifyButton(this.sourceControlConfigSection);
  }

  getVerifyButton(section: Cypress.Chainable) {
    return section.contains('button', 'Verify');
  }

  getVerifiedButton(section: Cypress.Chainable) {
    return section.contains('button', 'Verified');
  }

  getResetButton(section: Cypress.Chainable) {
    return section.contains('button', 'Reset');
  }

  navigate() {
    cy.visit(Cypress.env('url') + '/metrics');
  }

  goHomePage() {
    this.backButton.click();
    this.yesButton.click();
  }

  typeProjectName(projectName: string) {
    this.projectNameInput.type(projectName);
  }

  selectDateRange() {
    this.collectionDateFrom.type('09012022');
  }

  selectMetricsData() {
    this.requiredDataSelect.click();

    this.requiredDataAllSelectOption.click();

    this.requiredDataModelCloseElement.click({ force: true });
  }

  fillBoardInfoAndVerifyWithJira(boardId: string, email: string, site: string, token: string) {
    this.boardInfoBoardIdInput.type(boardId);
    this.boardInfoEmailInput.type(email);
    this.boardInfoSiteInput.type(site);
    this.boardInfoTokenInput.type(token);
    this.getVerifyButton(this.boardConfigSection).click();
  }

  fillPipelineToolFieldsInfoAndVerify(token: string) {
    this.pipelineToolTokenInput.type(token);

    this.pipelineToolVerifyButton.click();
  }

  fillSourceControlFieldsInfoAndVerify(token: string) {
    this.sourceControlTokenInput.type(token);

    this.sourceControlVerifyButton.click();
  }

  verifyAndClickNextToMetrics() {
    this.boardVerifyButton.click();
    this.pipelineToolVerifyButton.click();
    this.sourceControlVerifyButton.click();
  }

  CancelBackToHomePage() {
    this.backButton.click();
    this.cancelButton.click();
  }

  goMetricsStep() {
    this.nextStepButton.click();
  }
}

const configPage = new Config();
export default configPage;
