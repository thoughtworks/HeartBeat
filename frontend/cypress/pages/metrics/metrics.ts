class Metrics {
  checkClassification() {
    cy.contains('Distinguished by').siblings().click()

    cy.contains('All').click()
    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  checkDeploymentFrequencySettings() {
    cy.contains('Deployment frequency settings').should('exist')
    cy.get('[id="single-selection-organization"]:contains("Organization")').eq(0).siblings().click()
    cy.get('[data-test-id="single-selection-organization"]:contains("XXXX")').click()
    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name")').eq(0).siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-payment-selector")').click()
    cy.get('[id="single-selection-steps"]:contains("Steps")').eq(0).siblings().click()
    cy.get('[data-test-id="single-selection-steps"]:contains("RECORD RELEASE TO PROD")').click()

    cy.get('[data-testid="AddIcon"]:first').click()
    cy.get('[id="single-selection-organization"]:contains("Organization")').eq(1).siblings().click()
    cy.get('[data-test-id="single-selection-organization"]:contains("XXXX")').click()
    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name")').eq(1).siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui")').click()
    cy.contains('BuildKite get steps failed: 404 Not Found').should('exist')
    cy.get('[data-test-id="remove-button"]').eq(1).click()
  }

  checkLeadTimeForChanges() {
    cy.contains('Lead time for changes').should('exist')
    cy.get('[id="single-selection-organization"]:contains("Organization")').eq(1).siblings().click()
    cy.get('[data-test-id="single-selection-organization"]:contains("XXXX")').click()
    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name")').eq(1).siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-onboarding")').click()
    cy.get('[id="single-selection-steps"]:contains("Steps")').eq(1).siblings().click()
    cy.get('[data-test-id="single-selection-steps"]:contains("RECORD RELEASE TO UAT"):last').click()

    cy.get('[data-testid="AddIcon"]:last').click()
    cy.get('[id="single-selection-organization"]:contains("Organization")').eq(2).siblings().click()
    cy.get('[data-test-id="single-selection-organization"]:contains("XXXX")').click()
    cy.get('[id="single-selection-pipeline-name"]:contains("Pipeline Name")').eq(2).siblings().click()
    cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui")').click()
    cy.contains('BuildKite get steps failed: 404 Not Found').should('exist')
    cy.get('[data-test-id="remove-button"]').eq(1).click()
  }

  goReportStep() {
    cy.contains('Next').click()
  }
}

const metricsPage = new Metrics()
export default metricsPage
