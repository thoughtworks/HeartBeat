class Home {
  navigate() {
    cy.visit(Cypress.env('url') + '/index.html')
  }

  createANewProject() {
    cy.contains('Create a new project').click()
  }

  importProjectFromFile() {
    cy.contains('Import project from file').click()
    cy.fixture('testFile.json').then((fileContent) => {
      cy.get<HTMLInputElement>('#importJson').then((e) => {
        const testFile = new File([JSON.stringify(fileContent)], 'testFile.json', {
          type: 'application/json',
        })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(testFile)
        const input = e[0]
        input.files = dataTransfer.files
        cy.wrap(input).trigger('change', { force: true })
      })
    })
  }
}

const homePage = new Home()

export default homePage
