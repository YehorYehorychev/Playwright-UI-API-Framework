import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import { CookieBannerComponent } from "../../src/components/CookieBannerComponent";
import config from "../../config/test.config";

/**
 * Cookie-consent banner tests — mobalytics.gg
 *
 * NOTE: These tests bypass the `homePage.navigate()` helper intentionally.
 * `BasePage.navigate()` already calls `acceptCookiesIfPresent()`, which
 * would dismiss the banner before the test can interact with it.
 * Instead we use a raw `page.goto()` so the banner remains visible.
 *
 * CLI:
 *   npx playwright test --grep @cookie
 */
test.describe(
  "Mobalytics — Cookie Consent Banner",
  { tag: [Tags.ui, Tags.regression, Tags.cookie] },
  () => {
    test(
      "should display cookie consent banner on first visit",
      {},
      async ({ page }) => {
        const cookieBanner = new CookieBannerComponent(page);

        await test.step("Navigate to home page without accepting cookies", async () => {
          await page.goto(config.baseURL);
          await page.waitForLoadState("domcontentloaded");
        });

        await test.step("Verify cookie banner is visible", async () => {
          await cookieBanner.verifyBannerVisible();
        });
      },
    );

    test(
      "should dismiss cookie banner after accepting",
      {},
      async ({ page }) => {
        const cookieBanner = new CookieBannerComponent(page);

        await test.step("Navigate to home page without accepting cookies", async () => {
          await page.goto(config.baseURL);
          await page.waitForLoadState("domcontentloaded");
        });

        await test.step("Accept cookies", async () => {
          await cookieBanner.acceptCookies();
        });

        await test.step("Verify banner is no longer visible", async () => {
          await cookieBanner.verifyBannerDismissed();
        });
      },
    );

    test(
      "should navigate to Cookie Policy page via 'Read More' link",
      {},
      async ({ page, context }) => {
        const cookieBanner = new CookieBannerComponent(page);

        await test.step("Navigate to home page without accepting cookies", async () => {
          await page.goto(config.baseURL);
          await page.waitForLoadState("domcontentloaded");
        });

        // The 'Read More' link has target="_blank" — it opens in a new tab.
        await test.step("Click 'Read More' and verify Cookie Policy opens in new tab", async () => {
          const [newTab] = await Promise.all([
            context.waitForEvent("page"),
            cookieBanner.readMoreLink.click(),
          ]);
          await newTab.waitForLoadState("domcontentloaded");
          expect(newTab.url()).toMatch(TestData.urlPatterns.cookie);
          await newTab.close();
        });
      },
    );
  },
);
