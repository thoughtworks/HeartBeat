class Metrics {
  checkClassification() {
    cy.contains('Distinguished By').siblings().click()

    cy.contains('All').click()
    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  checkDeploymentFrequencySettings() {
    cy.contains('Deployment Frequency Settings').should('exist')
    cy.contains('Organization').siblings().click()
    cy.contains('XXXX').click()
    cy.contains('Pipeline Name').siblings().click()
    cy.contains('payment-selector-ui').click()
    cy.contains('BuildKite Get steps failed: 404 Not Found').should('exist')

    cy.contains('Pipeline Name').siblings().click()
    cy.contains('fs-platform-payment-selector').click()
    cy.contains('Steps').siblings().click()
    cy.contains('RECORD RELEASE TO PROD').click()
  }
}

const metricsPage = new Metrics()
export default metricsPage
