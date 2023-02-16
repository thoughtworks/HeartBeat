describe('Create a new project', () => {
  it('Visits the Heartbeat home page', () => {
    cy.visit(Cypress.env('url') + '/index.html')

    cy.contains('Create a new project').click()

    cy.url().should('include', '/metrics')

    cy.contains('Project Name').siblings().type('E2E Project')

    cy.contains('From').parent().find('button').click()
    cy.get('.MuiPickersPopper-root').find('button').contains('16').click()

    cy.contains('To').parent().find('button').click()
    cy.get('.MuiPickersPopper-root').find('button').contains('20').click()

    cy.contains('Required Data').siblings().click()
    // cy.get('.MuiPaper-root ul').click()

    cy.contains('Velocity').click()
    cy.contains('Cycle time').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  })
})
