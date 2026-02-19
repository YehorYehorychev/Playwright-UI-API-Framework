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

  /* Workers: driven by config (auto-scales to CPU count by default) */
  workers: config.workers,

  /**
   * Global per-test timeout guard.
   * A single test should never take longer than 30 s — if it does, something
   * is functionally broken (infinite wait, hung navigation, etc.) and retrying
   * it would only waste more time.
   */
  timeout: parseInt(process.env.TEST_TIMEOUT || "30000", 10),

  /* Reporter to use. */
  reporter: process.env.CI
    ? [
        // CI: machine-readable formats + list for log streaming
        ["junit", { outputFile: "test-results/junit.xml" }],
        ["json", { outputFile: "test-results/results.json" }],
        [
          "allure-playwright",
          {
            outputFolder: config.allure.resultsDir,
            detail: true,
            suiteTitle: true,
          },
        ],
        ["list"],
      ]
    : [
        // Local: HTML report for easy browsing + list for real-time output
        ["html", { outputFolder: "playwright-report", open: "never" }],
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

    /**
     * Reuse an existing authenticated state across tests in the same worker.
     * For unauthenticated smoke/regression tests this has no effect; for
     * authenticated tests it eliminates repeated login round-trips entirely.
     */
    // storageState: process.env.STORAGE_STATE_PATH,  // uncomment after generating state
  },

  /**
   * Browser projects — strategy:
   *
   * • Chrome is the primary browser (highest real-world usage, fastest in CI).
   * • Firefox and WebKit run only in the dedicated cross-browser pipeline
   *   (CROSS_BROWSER=true) so the default run stays as fast as possible.
   * • Mobile Chrome viewport is included for responsive tests instead of
   *   resetting the viewport in every beforeEach.
   */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: config.headless,
      },
    },

    // Cross-browser projects — activated by CROSS_BROWSER=true
    ...(process.env.CROSS_BROWSER === "true"
      ? [
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
        ]
      : []),

    // Dedicated mobile project used by @responsive tests
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 7"],
        headless: config.headless,
      },
      grep: /@responsive/,
    },
  ],
});
