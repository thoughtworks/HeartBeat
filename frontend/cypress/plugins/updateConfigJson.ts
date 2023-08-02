// <reference types="cypress" />
import fs = require('fs')
import { GITHUB_TOKEN } from '../fixtures/fixtures'

function generateTestData(configJsonFilePath) {
  fs.readFile(configJsonFilePath, (err, data) => {
    if (err) throw err
    const mockedImportConfigJSON = JSON.parse(data.toString())
    mockedImportConfigJSON.sourceControl.token = GITHUB_TOKEN

    fs.writeFile(configJsonFilePath, JSON.stringify(mockedImportConfigJSON, null, 2), (e) => {
      if (e) {
        console.error(e)
      }
    })
  })
}

module.exports = (on, config) => {
  generateTestData('./cypress/fixtures/NewConfigFileForImporting.json')
  generateTestData('./cypress/fixtures/OldConfigFileForImporting.json')
  return config
}
