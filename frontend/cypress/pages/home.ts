class Home {
  private readonly createANewProjectButton = () => cy.contains('Create a new project')

  private readonly importProjectFromFileButton = () => cy.contains('Import project from file')

  navigate() {
    cy.visit('/index.html')
  }

  createANewProject() {
    this.createANewProjectButton().click()
  }

  importProjectFromFile(configFixtureName) {
    this.importProjectFromFileButton().click()
    cy.fixture(configFixtureName).then((fileContent) => {
      cy.get<HTMLInputElement>('#importJson').then((e) => {
        const testFile = new File([JSON.stringify(fileContent)], configFixtureName, {
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
