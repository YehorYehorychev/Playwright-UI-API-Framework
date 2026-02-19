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
          await expect(homePage.navigation.logo).toBeVisible();
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
          await homePage.hero.verifyJoinMillionGamersText();
        });
      },
    );

    test(
      "should display download button",
      { tag: Tags.critical },
      async ({ homePage }) => {
        await test.step("Verify download button is visible", async () => {
          await homePage.hero.verifyDownloadButtonVisible();
        });

        await test.step("Verify download button contains correct text", async () => {
          const buttonText = await homePage.hero.getDownloadButtonText();
          expect(buttonText.toUpperCase()).toContain("DOWNLOAD");
        });

        await test.step("Verify download button href points to Overwolf", async () => {
          await expect(homePage.hero.downloadButton).toHaveAttribute(
            "href",
            TestData.urlPatterns.downloadOverwolf,
          );
        });
      },
    );

    test("should display game cards", {}, async ({ homePage }) => {
      await test.step("Verify League of Legends card is visible", async () => {
        await expect(homePage.gameCards.lolGameCard).toBeVisible();
      });

      await test.step("Verify Teamfight Tactics card is visible", async () => {
        await expect(homePage.gameCards.tftGameCard).toBeVisible();
      });
    });

    test(
      "should display navigation menu items",
      { tag: Tags.navigation },
      async ({ homePage }) => {
        await test.step("Verify LOL navigation item", async () => {
          await expect(homePage.navigation.navLOL).toBeVisible();
        });

        await test.step("Verify TFT navigation item", async () => {
          await expect(homePage.navigation.navTFT).toBeVisible();
        });

        await test.step("Verify POE2 navigation item", async () => {
          await expect(homePage.navigation.navPOE2).toBeVisible();
        });
      },
    );

    test(
      "[SANITY] all critical home-page elements are visible",
      { tag: Tags.critical },
      async ({ homePage }) => {
        await test.step("Verify all key elements are present", async () => {
          await expect(homePage.navigation.logo).toBeVisible();
          await expect(homePage.hero.joinGamersText).toBeVisible();
          await expect(homePage.hero.downloadButton).toBeVisible();

          const gameCardsVisible =
            (await homePage.gameCards.lolGameCard.isVisible()) ||
            (await homePage.gameCards.tftGameCard.isVisible());
          expect(gameCardsVisible).toBeTruthy();

          await expect(homePage.navigation.navLOL).toBeVisible();
        });
      },
    );
  },
);
