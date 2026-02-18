import { test as base, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { POE2Page } from "../pages/POE2Page";
import { NavigationComponent } from "../components/NavigationComponent";
import { FooterComponent } from "../components/FooterComponent";
import { HeroComponent } from "../components/HeroComponent";
import { GameCardsComponent } from "../components/GameCardsComponent";
import { loginViaAPI } from "../helpers/auth.helper";
import { AuthenticationError } from "../errors/test-errors";
import { createLogger } from "../utils/logger";

const log = createLogger("Fixtures");

type MyFixtures = {
  // ── Page Object fixtures ──────────────────────────────────────────────────
  homePage: HomePage;
  poe2Page: POE2Page;
  authenticatedPage: Page;
  authenticatedPoe2Page: POE2Page;

  // ── Component fixtures (inject a single component for focused tests) ───────
  navigation: NavigationComponent;
  hero: HeroComponent;
  gameCards: GameCardsComponent;
  footer: FooterComponent;

  // ── Auto fixture — not used directly in tests ─────────────────────────────
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

  // ── Component fixtures ────────────────────────────────────────────────────
  // Use these in tests that only need to interact with one section of the page,
  // avoiding the overhead of constructing the full page object.

  navigation: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },

  hero: async ({ page }, use) => {
    await use(new HeroComponent(page));
  },

  gameCards: async ({ page }, use) => {
    await use(new GameCardsComponent(page));
  },

  footer: async ({ page }, use) => {
    await use(new FooterComponent(page));
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

  // Fixture that provides a POE2Page with an authenticated session.
  // Reuses the standard `page` fixture (best practice) so that the
  // screenshotOnFailure auto-fixture, video recording, and trace all operate
  // on the same page that the test actually uses — no blank screenshots.
  authenticatedPoe2Page: async ({ page, context }, use) => {
    const apiContext = context.request;
    const authResult = await loginViaAPI(apiContext);

    if (!authResult.success) {
      throw new AuthenticationError(
        "loginViaAPI returned success=false. Check USER_EMAIL and USER_PASSWORD env vars.",
      );
    }

    log.info("Authenticated via API — providing POE2Page");
    const poe2Page = new POE2Page(page);
    await use(poe2Page);
  },
});

export { expect } from "@playwright/test";
