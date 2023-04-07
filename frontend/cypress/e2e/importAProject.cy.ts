import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
describe('Import project from file', () => {
  it('Should import a project manually', () => {
    homePage.navigate()

    homePage.importProjectFromFile()
    cy.url().should('include', '/metrics')
    cy.contains('Pipeline Tool').should('exist')
    cy.get('.MuiInput-input')
      .invoke('val')
      .then((value) => {
        expect(value).to.equal('mockProjectName')
      })

    configPage.verifyAndClickNextToMetrics()

    configPage.goMetricsStep()
    cy.contains('Classification Setting').should('exist')
    cy.get('.MuiSelect-select')
      .invoke('text')
      .then((text) => {
        expect(text).to.equal('Yu ZhangTo doAnalysis------------------------​Parent')
      })
  })
})
