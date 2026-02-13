import { test as base, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { loginViaAPI } from "../helpers/auth.helper";

type MyFixtures = {
  homePage: HomePage;
  authenticatedPage: Page; // Page with authenticated session
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // Fixture that provides an authenticated page
  authenticatedPage: async ({ page, context }, use) => {
    // Create API request context from the browser context
    const apiContext = context.request;

    // Perform API login
    const authResult = await loginViaAPI(apiContext);

    if (authResult.success) {
      console.log("✅ Authenticated via API");
      // Cookies are already set in the context, page will use them
      await use(page);
    } else {
      throw new Error("Failed to authenticate via API");
    }
  },
});

export { expect } from "@playwright/test";
