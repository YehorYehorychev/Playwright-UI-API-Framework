import { test as base, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { POE2Page } from "../pages/POE2Page";
import { loginViaAPI } from "../helpers/auth.helper";
import { AuthenticationError } from "../errors/test-errors";
import { createLogger } from "../utils/logger";

const log = createLogger("Fixtures");

type MyFixtures = {
  homePage: HomePage;
  poe2Page: POE2Page;
  authenticatedPage: Page; // Page with authenticated session
  authenticatedPoe2Page: POE2Page; // POE2Page with authenticated session
  // auto fixture — not used directly in tests
  screenshotOnFailure: void;
};

export const test = base.extend<MyFixtures>({
  /**
   * Auto-fixture: captures a full-page screenshot after every FAILED test and
   * attaches it via testInfo.attach() so that allure-playwright always includes
   * it in the Allure report (Playwright's built-in screenshot mechanism writes
   * the file too late for allure-playwright to pick up automatically).
   */
  screenshotOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page
          .screenshot({ fullPage: true })
          .catch(() => null);
        if (screenshot) {
          await testInfo.attach("screenshot on failure", {
            body: screenshot,
            contentType: "image/png",
          });
          log.info(`Screenshot attached for failed test: ${testInfo.title}`);
        }
      }
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  poe2Page: async ({ page }, use) => {
    const poe2Page = new POE2Page(page);
    await use(poe2Page);
  },

  // Fixture that provides an authenticated page
  authenticatedPage: async ({ page, context }, use) => {
    // Create API request context from the browser context
    const apiContext = context.request;

    // Perform API login
    const authResult = await loginViaAPI(apiContext);

    if (authResult.success) {
      log.info("Authenticated via API — proceeding with test");
      // Cookies are already set in the context, page will use them
      await use(page);
    } else {
      throw new AuthenticationError(
        "loginViaAPI returned success=false. Check USER_EMAIL and USER_PASSWORD env vars.",
      );
    }
  },

  // Fixture that provides a POE2Page with an authenticated session
  authenticatedPoe2Page: async ({ context }, use) => {
    const apiContext = context.request;
    const authResult = await loginViaAPI(apiContext);

    if (!authResult.success) {
      throw new AuthenticationError(
        "loginViaAPI returned success=false. Check USER_EMAIL and USER_PASSWORD env vars.",
      );
    }

    log.info("Authenticated via API — providing POE2Page");
    const page = await context.newPage();
    const poe2Page = new POE2Page(page);
    await use(poe2Page);
    await page.close();
  },
});

export { expect } from "@playwright/test";
