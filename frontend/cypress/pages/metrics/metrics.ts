class Metrics {
  checkClassification() {
    cy.contains('Distinguished By').siblings().click()

    cy.contains('All').click()
    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }
}

const metricsPage = new Metrics()
export default metricsPage
