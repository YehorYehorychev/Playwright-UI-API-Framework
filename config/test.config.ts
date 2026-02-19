import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config();

export interface TestConfig {
  baseURL: string;
  apiBaseURL: string;
  browser: "chromium" | "firefox" | "webkit";
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeouts: {
    default: number;
    navigation: number;
    api: number;
  };
  retryCount: number;
  workers: number;
  allure: {
    resultsDir: string;
    reportDir: string;
  };
  screenshots: {
    onFailure: boolean;
  };
  video: {
    onFailure: boolean;
  };
  trace: {
    onFailure: boolean;
  };
}

export const config: TestConfig = {
  baseURL: process.env.BASE_URL || "https://mobalytics.gg",
  apiBaseURL: process.env.API_BASE_URL || "https://api.mobalytics.gg",
  browser:
    (process.env.BROWSER as "chromium" | "firefox" | "webkit") || "chromium",
  headless: process.env.HEADLESS !== "false",
  viewport: {
    width: parseInt(process.env.VIEWPORT_WIDTH || "1920", 10),
    height: parseInt(process.env.VIEWPORT_HEIGHT || "1080", 10),
  },
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT || "15000", 10),
    navigation: parseInt(process.env.NAVIGATION_TIMEOUT || "30000", 10),
    api: parseInt(process.env.API_TIMEOUT || "10000", 10),
  },
  // 1 retry locally, 2 on CI to balance between stability and feedback loop time
  retryCount: parseInt(
    process.env.RETRY_COUNT || (process.env.CI ? "2" : "1"),
    10,
  ),
  // Scale workers to available CPUs; 50% of logical cores is a safe default
  // Override with PARALLEL_WORKERS env var in CI to match the runner's core count
  workers: parseInt(
    process.env.PARALLEL_WORKERS ||
      String(Math.max(4, Math.floor(require("os").cpus().length / 2))),
    10,
  ),
  allure: {
    resultsDir: process.env.ALLURE_RESULTS_DIR || "allure-results",
    reportDir: process.env.ALLURE_REPORT_DIR || "allure-report",
  },
  screenshots: {
    // Default true so Playwright saves screenshots; explicit attachment is handled
    // by the screenshotOnFailure auto-fixture which forwards them to Allure.
    onFailure: process.env.SCREENSHOT_ON_FAILURE !== "false",
  },
  video: {
    onFailure: process.env.VIDEO_ON_FAILURE === "true",
  },
  trace: {
    onFailure: process.env.TRACE_ON_FAILURE === "true",
  },
};

export default config;
