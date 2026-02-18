import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

/**
 * Smoke suite for mobalytics.gg home page.
 * These tests cover the most critical user-facing paths and must pass on every build.
 *
 * CLI: npx playwright test --grep @smoke
 */
test.describe(
  "Mobalytics Home Page — Smoke Tests",
  { tag: [Tags.ui, Tags.smoke] },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
    });

    test(
      "should load home page successfully",
      { tag: Tags.critical },
      async ({ homePage }) => {
        await test.step("Verify page is loaded", async () => {
          await homePage.verifyPageLoaded();
        });

        await test.step("Verify logo is visible", async () => {
          await expect(homePage.logo).toBeVisible();
        });
      },
    );

    test(
      "should display correct page title",
      { tag: Tags.critical },
      async ({ homePage }) => {
        await test.step("Verify page title contains Mobalytics", async () => {
          await homePage.verifyPageTitle("Mobalytics");
        });
      },
    );

    test(
      "should display main heading with million gamers text",
      {},
      async ({ homePage }) => {
        await test.step(`Verify "${TestData.ui.homepage.gamersCount}" text is visible`, async () => {
          await homePage.verifyJoinMillionGamersText();
        });
      },
    );

    test(
      "should display download button",
      { tag: Tags.critical },
      async ({ homePage }) => {
        await test.step("Verify download button is visible", async () => {
          await homePage.verifyDownloadButtonVisible();
        });

        await test.step("Verify download button contains correct text", async () => {
          const buttonText = await homePage.getDownloadButtonText();
          expect(buttonText.toUpperCase()).toContain("DOWNLOAD");
        });
      },
    );

    test("should display game cards", {}, async ({ homePage }) => {
      await test.step("Verify League of Legends card is visible", async () => {
        await expect(homePage.lolGameCard).toBeVisible();
      });

      await test.step("Verify Teamfight Tactics card is visible", async () => {
        await expect(homePage.tftGameCard).toBeVisible();
      });
    });

    test(
      "should display navigation menu items",
      { tag: Tags.navigation },
      async ({ homePage }) => {
        await test.step("Verify LOL navigation item", async () => {
          await expect(homePage.navLOL).toBeVisible();
        });

        await test.step("Verify TFT navigation item", async () => {
          await expect(homePage.navTFT).toBeVisible();
        });

        await test.step("Verify POE2 navigation item", async () => {
          await expect(homePage.navPOE2).toBeVisible();
        });
      },
    );

    test(
      "should have all main elements visible",
      { tag: Tags.critical },
      async ({ homePage }, testInfo) => {
        await test.step("Capture and attach full page screenshot", async () => {
          const screenshot = await homePage.takeFullPageScreenshot();
          await testInfo.attach("home-page-smoke", {
            body: screenshot,
            contentType: "image/png",
          });
        });

        await test.step("Verify all key elements are present", async () => {
          await expect(homePage.logo).toBeVisible();
          await expect(homePage.joinGamersText).toBeVisible();
          await expect(homePage.downloadButton).toBeVisible();

          const gameCardsVisible =
            (await homePage.lolGameCard.isVisible()) ||
            (await homePage.tftGameCard.isVisible());
          expect(gameCardsVisible).toBeTruthy();

          await expect(homePage.navLOL).toBeVisible();
        });
      },
    );
  },
);
