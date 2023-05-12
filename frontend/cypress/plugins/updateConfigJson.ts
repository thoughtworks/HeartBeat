// <reference types="cypress" />
import fs = require('fs')

module.exports = (on, config) => {
  generateTestData()
  return config
}

function generateTestData() {
  const configJsonFilePath = './cypress/fixtures/ConfigFileForImporting.json'
  fs.readFile(configJsonFilePath, (err, data) => {
    if (err) throw err
    const mockedImportConfigJSON = JSON.parse(data.toString())
    mockedImportConfigJSON.sourceControl.token = `ghp_${'Abc123'.repeat(6)}`

    fs.writeFile(configJsonFilePath, JSON.stringify(mockedImportConfigJSON, null, 2), (e) => {
      console.error(e)
    })
  })
}

module.exports = generateTestData
