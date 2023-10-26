class Metrics {
  private readonly cycleTimeSettingAnalysis = () => {
    cy.contains('In Analysis').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('Analysis').click()
  }

  private readonly cycleTimeSettingTodo = () => {
    cy.contains('Ready For Dev').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('To do').click()
  }

  private readonly cycleTimeSettingInDev = () => {
    cy.contains('In Dev').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('In Dev').click()
  }

  private readonly cycleTimeSettingBlock = () => {
    cy.contains('Blocked').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('Block').click()
  }

  private readonly cycleTimeSettingWaitTest = () => {
    cy.contains('Ready For Test').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('Waiting for testing').click()
  }

  private readonly cycleTimeSettingTesting = () => {
    cy.contains('In Test').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('Testing').click()
  }

  private readonly cycleTimeSettingReview = () => {
    cy.contains('Ready to Deploy').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('Review').click()
  }

  private readonly cycleTimeSettingDone = () => {
    cy.contains('Done').siblings().eq(0).click()
    cy.get('li[role="option"]').contains('Done').click()
  }

  private readonly realDoneSelect = () => cy.contains('Consider as Done').siblings().eq(0)

  private readonly RealDoneSelectAllOption = () => cy.contains('All')

  private readonly closeModelElement = () =>
    cy.get(
      '.Mui-expanded > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiAutocomplete-popupIndicator > [data-testid="ArrowDropDownIcon"] > path'
    )

  private readonly classificationSelect = () => cy.contains('Distinguished By').siblings()

  private readonly classificationSelectAllOption = () => cy.contains('All')

  private readonly deploymentFrequencySettingTitle = () => cy.contains('Pipeline settings')

  private readonly organizationSelect = () => cy.get('[data-test-id="single-selection-organization"]')

  private readonly pipelineOfOrgXXXX = () => cy.get('li[role="option"]').contains('XXXX')

  private readonly pipelineSelect = (i: number) => cy.get('[data-test-id="single-selection-pipeline-name"]').eq(i)

  private readonly pipelineSelectOneOption = () => cy.get('li[role="option"]').contains('fs-platform-payment-selector')

  private readonly stepOfSomePipelineSelect = (i: number) => cy.get('[data-test-id="single-selection-step"]').eq(i)

  private readonly stepSelectSomeOption = () => cy.get('li[role="option"]').contains('RECORD RELEASE TO PROD')

  private readonly addOnePipelineButton = () => cy.get('[data-testid="AddIcon"]:first')

  private readonly organizationSecondSelect = (i: number) =>
    cy.get('[data-test-id="single-selection-organization"]').eq(i)

  private readonly pipelineSelectOnboardingOption = () =>
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-onboarding")')

  private readonly pipelineSelectUIOption = () => cy.get('li[role="option"]').contains('payment-selector-ui')

  private readonly buildKiteStepNotFoundTips = () => cy.contains('BuildKite get steps failed: 404 Not Found')

  private readonly pipelineRemoveButton = () => cy.get('[data-test-id="remove-button"]').eq(1)

  private readonly checkDuplicatedMessage = () =>
    cy.contains('This pipeline is the same as another one!').should('exist')

  private readonly branchSelect = () => cy.contains('Branches').eq(0).siblings()

  private readonly branchSelectSomeOption = () => cy.contains('All')

  private readonly pipelineStepSelectXXOption = () =>
    cy.get('[data-test-id="single-selection-step"]:contains("RECORD RELEASE TO UAT"):last')

  private readonly pipelineStepXXOption = () =>
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui")')

  private readonly leadTimeForChangeAddOneButton = () => cy.get('[data-testid="AddIcon"]:last')

  private readonly nextButton = () => cy.contains('Next')
  private readonly backButton = () => cy.contains('Back')

  checkCycleTime() {
    this.cycleTimeSettingAnalysis()
    this.cycleTimeSettingTodo()
    this.cycleTimeSettingInDev()
    this.cycleTimeSettingBlock()
    this.cycleTimeSettingWaitTest()
    this.cycleTimeSettingTesting()
    this.cycleTimeSettingReview()
    this.cycleTimeSettingDone()
  }

  checkRealDone() {
    this.realDoneSelect().click()

    this.RealDoneSelectAllOption().click()
    this.closeModelElement().click({ force: true })
  }

  checkClassification() {
    this.classificationSelect().click()

    this.classificationSelectAllOption().click()
    this.closeModelElement().click({ force: true })
  }

  checkDeploymentFrequencySettings() {
    this.deploymentFrequencySettingTitle().should('exist')
    this.organizationSelect().click()
    this.pipelineOfOrgXXXX().click()
    this.pipelineSelect(0).click()
    this.pipelineSelectOneOption().click()
    this.stepOfSomePipelineSelect(0).click()
    this.stepSelectSomeOption().click()
    this.branchSelect().click()
    this.branchSelectSomeOption().click()

    this.addOnePipelineButton().click()
    this.organizationSecondSelect(1).click()
    this.pipelineOfOrgXXXX().click()
    this.pipelineSelect(1).click()
    this.pipelineSelectUIOption().click()
    this.buildKiteStepNotFoundTips().should('exist')
    this.pipelineRemoveButton().click()

    this.addOnePipelineButton().click()
    this.organizationSecondSelect(1).click()
    this.pipelineOfOrgXXXX().click()
    this.pipelineSelect(1).click()
    this.pipelineSelectOneOption().click()
    this.stepOfSomePipelineSelect(1).click()
    this.stepSelectSomeOption().click()
    this.checkDuplicatedMessage()
    this.pipelineRemoveButton().click()
  }

  goReportStep() {
    this.nextButton().click()
  }

  BackToConfigStep() {
    this.backButton().click()
  }
}

const metricsPage = new Metrics()
export default metricsPage
