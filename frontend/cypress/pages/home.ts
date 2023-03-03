class Home {
  navigate() {
    cy.visit(Cypress.env('url') + '/index.html')
  }
  createANewProject() {
    cy.contains('Create a new project').click()
    cy.url().should('include', '/Metrics')
  }
}

const homePage = new Home()

export default homePage
