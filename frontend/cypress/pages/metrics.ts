class Metrics {
  navigate() {
    cy.visit(Cypress.env('url') + '/metrics')
  }
  typeProjectName(projectName: string) {
    cy.contains('Project Name').siblings().type(projectName)
  }

  selectDateRange(from: string, to: string) {
    cy.contains('From').parent().find('button').click()
    cy.get('.MuiPickersPopper-root').find('button').contains(from).click()

    cy.contains('To').parent().find('button').click()
    cy.get('.MuiPickersPopper-root').find('button').contains(to).click()
  }

  selectVelocityAndCycleTime() {
    cy.contains('Required Data').siblings().click()

    cy.contains('Velocity').click()
    cy.contains('Cycle time').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillBoardFieldsInfo(boardId: string, email: string, projectKey: string, site: string, token: string) {
    cy.get('button:contains("Verify")').should('be.disabled')

    cy.contains('boardId').siblings().type(boardId)
    cy.contains('email').siblings().type(email)
    cy.contains('projectKey').siblings().type(projectKey)
    cy.contains('site').siblings().type(site)
    cy.contains('token').siblings().type(token)

    cy.get('button:contains("Verify")').should('be.enabled')

    cy.contains('Verify').click()

    cy.get('button:contains("Verified")')
    cy.get('button:contains("Reset")')
  }

  resetBoardInfo() {
    cy.contains('Reset').click()

    cy.contains('boardId').invoke('val', '')
    cy.contains('email').invoke('val', '')
    cy.contains('projectKey').invoke('val', '')
    cy.contains('site').invoke('val', '')
    cy.contains('token').invoke('val', '')
    cy.get('button:contains("Verify")').should('be.disabled')
  }

  selectLeadTimeForChangesAndDeploymentFrequency() {
    cy.contains('Required Data').siblings().click()
    cy.get("[type='checkbox']").uncheck()

    cy.contains('Lead time for changes').click()
    cy.contains('Deployment frequency').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillPipelineToolFieldsInfo(token: string) {
    cy.get('button:contains("Verify")').should('be.disabled')

    cy.contains('token').siblings().type(token)
    cy.get('button:contains("Verify")').should('be.enabled')

    cy.contains('Verify').click()

    cy.get('button:contains("Verified")')
    cy.get('button:contains("Reset")')
  }

  resetPipelineToolFieldsInfo() {
    cy.contains('Reset').click()

    cy.contains('token').invoke('val', '')
    cy.get('button:contains("Verify")').should('be.disabled')
  }
}

const metricsPage = new Metrics()
export default metricsPage
