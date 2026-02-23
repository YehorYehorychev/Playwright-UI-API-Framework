import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";

/**
 * Responsive / mobile viewport tests for mobalytics.gg.
 *
 * Each test overrides the viewport to simulate a mobile device.
 * We use iPhone 14 dimensions (390 × 844) as the reference.
 *
 * CLI:
 *   npx playwright test --grep @responsive
 */

// ── Shared viewport constant ────────────────────────────────────────────────
const IPHONE_14 = { width: 390, height: 844 };

test.describe(
  "Mobalytics Home Page — Responsive / Mobile",
  { tag: [Tags.ui, Tags.regression, Tags.responsive] },
  () => {
    test.beforeEach(async ({ page, homePage }) => {
      await page.setViewportSize(IPHONE_14);
      await homePage.navigate();
    });

    test(
      "should load home page successfully on mobile viewport",
      { tag: Tags.smoke },
      async ({ page }) => {
        await test.step("Verify page URL on mobile", async () => {
          await expect(page).toHaveURL(/mobalytics\.gg/);
        });
      },
    );

    test("should display main H1 heading on mobile", {}, async ({ homePage }) => {
      await test.step("Verify main heading is visible", async () => {
        await expect(homePage.hero.mainHeading).toBeVisible();
      });
    });

    test("should display download button on mobile", {}, async ({ homePage }) => {
      await test.step("Verify download button is visible", async () => {
        await homePage.hero.verifyDownloadButtonVisible();
      });
    });

    test("should display brand logo on mobile", {}, async ({ homePage }) => {
      await test.step("Verify logo is visible in the nav", async () => {
        await expect(homePage.navigation.logo).toBeVisible();
      });
    });

    test(
      "should capture full-page screenshot on mobile",
      { tag: Tags.visual },
      async ({ homePage }, testInfo) => {
        await test.step("Capture and attach mobile screenshot", async () => {
          const screenshot = await homePage.takeFullPageScreenshot();
          await testInfo.attach("home-mobile-iphone14", {
            body: screenshot,
            contentType: "image/png",
          });
        });
      },
    );
  },
);
