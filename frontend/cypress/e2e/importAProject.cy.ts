import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'
import reportPage from '../pages/metrics/report'
const checkCrewSetting = () => {
  cy.contains('Crews setting').should('exist')
  cy.contains('Yu Zhang').should('exist')
}

const checkCycleTime = () => {
  cy.contains('Cycle time settings').should('exist')
  cy.contains('Analysis').should('exist')
  cy.contains('To do').should('exist')
  cy.contains('In Dev').should('exist')
  cy.contains('Block').should('exist')
  cy.contains('Waiting for testing').should('exist')
  cy.contains('Testing').should('exist')
  cy.contains('Review').should('exist')
  cy.contains('Done').should('exist')
}

const checkRealDone = () => {
  cy.contains('Real done').should('exist')
  cy.contains('DONE, CLOSED').should('exist')
}

const checkClassification = () => {
  cy.contains('Classification setting').should('exist')
  cy.contains('Issue Type, Has Dependancies, FS R&D Classification, Parent').should('exist')
}

const checkDeploymentFrequencySetting = () => {
  cy.contains('Deployment frequency settings').should('exist')
  cy.contains('XXXX').should('exist')
  cy.contains('fs-platform-onboarding').should('exist')
  cy.contains(':docker: publish gradle-cache image to cloudsmith').should('exist')
}

const checkLeadTimeForChanges = () => {
  cy.contains('Lead time for changes').should('exist')
  cy.contains('XXXX').should('exist')
  cy.contains('fs-platform-payment-selector').should('exist')
  cy.contains(':docker: publish maven-cache image to cloudsmith').should('exist')
}

describe('Import project from file', () => {
  it('Should import a project manually', () => {
    homePage.navigate()

    homePage.importProjectFromFile()
    cy.url().should('include', '/metrics')
    cy.contains('Pipeline Tool').should('exist')
    cy.get('.MuiInput-input')
      .invoke('val')
      .then((value) => {
        expect(value).to.equal('ConfigFileForImporting')
      })

    configPage.verifyAndClickNextToMetrics()

    configPage.goMetricsStep()

    checkCrewSetting()

    checkCycleTime()

    checkRealDone()

    checkClassification()

    checkDeploymentFrequencySetting()

    checkLeadTimeForChanges()

    metricsPage.goReportStep()

    reportPage.BackToMetricsStep()

    checkCrewSetting()

    checkCycleTime()

    checkRealDone()

    checkClassification()

    checkDeploymentFrequencySetting()

    checkLeadTimeForChanges()
  })
})
