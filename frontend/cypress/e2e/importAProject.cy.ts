import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'
import reportPage from '../pages/metrics/report'

const metricsTextList = [
  'Crews setting',
  'Yu Zhang',
  'Cycle time settings',
  'Analysis',
  'To do',
  'In Dev',
  'Block',
  'Waiting for testing',
  'Testing',
  'Review',
  'Done',
  'Real done',
  'DONE, CLOSED',
  'Classification setting',
  'Issue Type, Has Dependancies, FS R&D Classification, Parent',
  'Deployment frequency settings',
  'XXXX',
  'fs-platform-onboarding',
  ':docker: publish gradle-cache image to cloudsmith',
  'Lead time for changes',
  'XXXX',
  'fs-platform-payment-selector',
  ':docker: publish maven-cache image to cloudsmith',
]

const checkFieldsExist = (fields: string[]) => {
  fields.forEach((item) => {
    cy.contains(item).should('exist')
  })
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

    checkFieldsExist(metricsTextList)

    metricsPage.goReportStep()

    reportPage.backToMetricsStep()

    checkFieldsExist(metricsTextList)
  })
})
