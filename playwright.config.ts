import { defineConfig, devices } from "@playwright/test";
import config from "./config/test.config";

/**
 * Playwright Test Configuration
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: config.retryCount,

  /* Opt out of parallel tests on CI. */
  workers: config.workers,

  /* Reporter to use. */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    [
      "allure-playwright",
      {
        outputFolder: config.allure.resultsDir,
        detail: true,
        suiteTitle: true,
      },
    ],
    ["list"],
  ],

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: config.baseURL,

    /* Collect trace when retrying the failed test. */
    trace: config.trace.onFailure ? "on-first-retry" : "off",

    /* Screenshot on failure */
    screenshot: config.screenshots.onFailure ? "only-on-failure" : "off",

    /* Video on failure */
    video: config.video.onFailure ? "retain-on-failure" : "off",

    /* Timeouts */
    actionTimeout: config.timeouts.default,
    navigationTimeout: config.timeouts.navigation,

    /* Viewport */
    viewport: config.viewport,

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: config.headless,
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        headless: config.headless,
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        headless: config.headless,
      },
    },
  ],
});
