import { defineConfig } from 'cypress'

export default defineConfig({
  videoCompression: 15,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.url = process.env.APP_ORIGIN || 'http://localhost:4321'

      return config
    },
  },
})
