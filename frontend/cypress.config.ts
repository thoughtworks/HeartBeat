import { defineConfig } from 'cypress'

export default defineConfig({
  video: true,
  videoCompression: 15,
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: process.env.APP_ORIGIN || 'http://localhost:4321',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./cypress/plugins/updateConfigJson.ts')(on, config)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./cypress/plugins/readDir.ts')(on, config)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./cypress/plugins/clearDownloadFile.ts')(on, config)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },
  },
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
})
