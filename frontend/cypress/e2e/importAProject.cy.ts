import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'
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

    metricsPage.checkImportCrewsSetting()
    metricsPage.checkImportCycleTimeSetting()
    metricsPage.checkImportRealDone()
    metricsPage.checkImportClassificationSetting()
    metricsPage.checkImportDeploymentFrequencySettings()
    metricsPage.checkImportLeadTimeForChanges()

    metricsPage.goReportStep()

    metricsPage.BackToMetricsStep()

    metricsPage.checkImportCrewsSetting()
    metricsPage.checkImportCycleTimeSetting()
    metricsPage.checkImportRealDone()
    metricsPage.checkImportClassificationSetting()
    metricsPage.checkImportDeploymentFrequencySettings()
    metricsPage.checkImportLeadTimeForChanges()
  })
})
