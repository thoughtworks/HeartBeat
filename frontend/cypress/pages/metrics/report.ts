interface BoardDataItem {
  label: string
  value?: string
}

class Report {
  private readonly velocityTitle = () => {
    cy.contains('Velocity').should('exist')
  }
  private readonly cycleTimeTitle = () => {
    cy.contains('Cycle time').should('exist')
  }
  private readonly checkBoardCalculation = (testId: string, boardData: BoardDataItem[]) => {
    cy.get(testId)
      .find('tr')
      .each((row, index) => {
        cy.wrap(row).within(() => {
          cy.contains(boardData[index].label).should('exist')
          if (boardData[index].value) {
            cy.contains(boardData[index].value).should('exist')
          }
        })
      })
  }

  checkVelocity(testId: string, velocityData: BoardDataItem[]) {
    this.velocityTitle()
    this.checkBoardCalculation(testId, velocityData)
  }

  checkCycleTime(testId: string, cycleTimeData: BoardDataItem[]) {
    this.cycleTimeTitle()
    this.checkBoardCalculation(testId, cycleTimeData)
  }

  BackToMetricsStep() {
    cy.contains('Back').click()
  }
}

const reportPage = new Report()
export default reportPage
