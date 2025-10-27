const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/4-apiTesting-dummyio/*{js,jsx,ts,tsx,feature}"
    // specPattern: "cypress/e2e/3-register-user/*{js,jsx,ts,tsx,feature}"
    // specPattern: "cypress/e2e/2-advanced-examples/*{js,jsx,ts,tsx,feature}"
  },
});
