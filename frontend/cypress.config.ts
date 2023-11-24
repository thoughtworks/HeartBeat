import { defineConfig } from 'cypress'

export default defineConfig({
  videoCompression: 15,
  e2e: {
    baseUrl: process.env.APP_ORIGIN || 'http://localhost:4321',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./cypress/plugins/updateConfigJson.ts')(on, config)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./cypress/plugins/readDir.ts')(on, config)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./cypress/plugins/clearDownloadFile.ts')(on, config)
      return config
    },
  },
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
})
