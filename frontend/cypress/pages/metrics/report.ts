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
    const cycleTimeData = [
      { label: 'Name', value: 'Value' },
      { label: 'Average cycle time', value: '6.71(days/SP)' },
      { label: '8.39(days/card)' },
      { label: 'Total development time / Total cycle time', value: '0.64' },
      { label: 'Total waiting for testing time / Total cycle time', value: '0.02' },
      { label: 'Total block time / Total cycle time', value: '0.28' },
      { label: 'Total review time / Total cycle time', value: '0.04' },
      { label: 'Total testing time / Total cycle time', value: '0.01' },
      { label: 'Average development time', value: '4.32(days/SP)' },
      { label: '5.4(days/card)' },
      { label: 'Average waiting for testing time', value: '0.16(days/SP)' },
      { label: '0.2(days/card)' },
      { label: 'Average block time', value: '1.88(days/SP)' },
      { label: '2.35(days/card)' },
      { label: 'Average review time', value: '0.26(days/SP)' },
      { label: '0.32(days/card)' },
      { label: 'Average testing time', value: '0.1(days/SP)' },
      { label: '0.12(days/card)' },
    ]
    cy.get('[data-test-id="Cycle time"]')
      .find('tr')
      .each((row, index) => {
        cy.wrap(row).within(() => {
          cy.contains(cycleTimeData[index].label).should('exist')
          if (cycleTimeData[index].value) {
            cy.contains(cycleTimeData[index].value).should('exist')
          }
        })
      })
  }
}

const reportPage = new Report()
export default reportPage
