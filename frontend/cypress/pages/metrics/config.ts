class Config {
  navigate() {
    cy.visit(Cypress.env('url') + '/metrics')
  }

  goHomePage() {
    cy.contains('Back').click()
    cy.contains('Yes').click()

    cy.url().should('include', '/home')
  }

  typeProjectName(projectName: string) {
    cy.contains('Project Name *').siblings().first().type(projectName)
  }

  selectDateRange() {
    cy.contains('From').parent().type('03162023')
  }

  selectMetricsData() {
    cy.contains('Required Data').siblings().click()

    cy.contains('Velocity').click()
    cy.contains('Lead time for changes').click()
    cy.contains('Deployment frequency').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillBoardInfoAndVerifyWithClassicJira(
    boardId: string,
    email: string,
    projectKey: string,
    site: string,
    token: string
  ) {
    cy.contains('Jira').click()
    cy.contains('Classic Jira').click()

    cy.contains('Board Id').siblings().first().type(boardId)
    cy.contains('Email').siblings().first().type(email)
    cy.contains('Project Key').siblings().first().type(projectKey)
    cy.contains('Site').siblings().first().type(site)
    cy.contains('Token').siblings().first().type(token)

    cy.contains('Verify').click()
    cy.contains('Verified').should('exist')
    cy.contains('Reset').should('exist')
  }

  fillPipelineToolFieldsInfoAndVerify(token: string) {
    cy.contains("[data-testid='pipelineToolTextField']", 'Token').type(token)

    cy.get('[data-test-id="pipelineVerifyButton"]').click()
  }

  fillSourceControlFieldsInfoAndVerify(token: string) {
    cy.contains("[data-testid='sourceControlTextField']", 'Token').type(token)

    cy.get('[data-test-id="sourceControlVerifyButton"]').click()
  }

  verifyAndClickNextToMetrics() {
    cy.contains('Verify').click()
    cy.get('[data-test-id="pipelineVerifyButton"]').click()
    cy.get('[data-test-id="sourceControlVerifyButton"]').click()
  }

  CancelBackToHomePage() {
    cy.contains('Back').click()
    cy.contains('Cancel').click()
  }

  goMetricsStep() {
    cy.contains('Next').click()
  }
}

const configPage = new Config()
export default configPage
