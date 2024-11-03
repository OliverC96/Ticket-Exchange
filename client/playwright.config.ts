import { defineConfig } from "@playwright/test";

require('dotenv').config({ path: ".env.local" });

export default defineConfig({
    testDir: "playwright/tests",
    outputDir: "playwright/results",
    fullyParallel: true,
    reporter: [
        ['list', { printSteps: true }]
    ],
    use: {
        ignoreHTTPSErrors: true,
        baseURL: "https://www.ticket-exchange.ca"
    }
});