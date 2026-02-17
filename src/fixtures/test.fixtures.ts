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
};

export const test = base.extend<MyFixtures>({
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
