class Home {
  get createANewProjectButton() {
    return cy.contains('Create a new project');
  }

  get importProjectFromFileButton() {
    return cy.contains('Import project from file');
  }

  get headerVersion() {
    return cy.get('span[title="Heartbeat"]').parent().next();
  }

  navigate() {
    cy.visit('/index.html');
  }

  createANewProject() {
    this.createANewProjectButton.click();
  }

  importProjectFromFile(configFixtureName) {
    this.importProjectFromFileButton.click();
    cy.fixture(configFixtureName).then((fileContent) => {
      // Add Randomly generated token
      fileContent.sourceControl.token = Cypress.env('TOKEN_GITHUB');

      cy.get<HTMLInputElement>('#importJson').then((e) => {
        const testFile = new File([JSON.stringify(fileContent)], configFixtureName, {
          type: 'application/json',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        const input = e[0];
        input.files = dataTransfer.files;
        cy.wrap(input).trigger('change', { force: true });
      });
    });
  }
}

const homePage = new Home();

export default homePage;
