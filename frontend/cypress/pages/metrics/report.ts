class Report {
  checkVelocity() {
    cy.contains('Velocity').should('exist')
    cy.contains('Cycle time').should('exist')
    cy.get('[data-test-id="Velocity"]')
      .find('tr')
      .first()
      .within(() => {
        cy.contains('Name').should('exist')
        cy.contains('Value').should('exist')
      })
    cy.get('[data-test-id="Velocity"]')
      .find('tr')
      .eq(1)
      .within(() => {
        cy.contains('Velocity(Story Point)').should('exist')
        cy.contains('20').should('exist')
      })
    cy.get('[data-test-id="Velocity"]')
      .find('tr')
      .eq(2)
      .within(() => {
        cy.contains('Throughput(Cards Count)').should('exist')
        cy.contains('16').should('exist')
      })
  }
}

const reportPage = new Report()
export default reportPage
