class Metrics {
  checkClassification() {
    cy.contains('Distinguished By').siblings().click()

    cy.contains('All').click()
    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  checkDeploymentFrequencySettings() {
    cy.contains('Deployment frequency settings').should('exist')
    cy.get('[id="single-selection-organization"]:contains("Organization"):first').siblings().click()
    cy.get('[data-test-id="single-selection-organization"]:contains("XXXX"):first').click()
    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name"):first').siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui"):first').click()
    cy.contains('BuildKite get steps failed: 404 Not Found').should('exist')

    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name"):first').siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-payment-selector"):first').click()
    cy.get('[id="single-selection-steps"]:contains("Steps"):first').siblings().click()
    cy.get('[data-test-id="single-selection-steps"]:contains("RECORD RELEASE TO PROD"):first').click()
  }

  checkLeadTimeForChanges() {
    cy.contains('Lead time for changes').should('exist')
    cy.get('[id="single-selection-organization"]:contains("Organization"):last').siblings().click()
    cy.get('[data-test-id="single-selection-organization"]:contains("XXXX"):last').click()
    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name"):last').siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui"):last').click()
    cy.contains('BuildKite get steps failed: 404 Not Found').should('exist')

    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name"):last').siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-onboarding"):last').click()
    cy.get('[id="single-selection-steps"]:contains("Steps"):last').siblings().click()
    cy.get('[data-test-id="single-selection-steps"]:contains("RECORD RELEASE TO UAT"):last').click()
  }

  goReportStep() {
    cy.contains('Next').click()
  }
}

const metricsPage = new Metrics()
export default metricsPage
