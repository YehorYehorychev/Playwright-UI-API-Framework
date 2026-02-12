import { test, expect } from "../../src/fixtures/test.fixtures";

test.describe("Mobalytics Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test("should load home page successfully", async ({ homePage }) => {
    await test.step("Verify page is loaded", async () => {
      await homePage.verifyPageLoaded();
    });

    await test.step("Verify logo is visible", async () => {
      await expect(homePage.logo).toBeVisible();
    });
  });

  test("should display correct page title", async ({ homePage }) => {
    await test.step("Verify page title contains Mobalytics", async () => {
      await homePage.verifyPageTitle("Mobalytics");
    });
  });

  test("should display main heading with million gamers text", async ({
    homePage,
    page,
  }) => {
    await test.step('Verify "10 MILLION GAMERS" text is visible', async () => {
      await homePage.verifyJoinMillionGamersText();
    });
  });

  test("should display download button", async ({ homePage }) => {
    await test.step("Verify download button is visible", async () => {
      await homePage.verifyDownloadButtonVisible();
    });

    await test.step("Verify download button contains correct text", async () => {
      const buttonText = await homePage.getDownloadButtonText();
      expect(buttonText.toUpperCase()).toContain("DOWNLOAD");
    });
  });

  test("should display game cards", async ({ homePage }) => {
    await test.step("Verify League of Legends card is visible", async () => {
      await expect(homePage.lolGameCard).toBeVisible();
    });

    await test.step("Verify Teamfight Tactics card is visible", async () => {
      await expect(homePage.tftGameCard).toBeVisible();
    });
  });

  test("should display navigation menu items", async ({ homePage }) => {
    await test.step("Verify LOL navigation item", async () => {
      await expect(homePage.navLOL).toBeVisible();
    });

    await test.step("Verify TFT navigation item", async () => {
      await expect(homePage.navTFT).toBeVisible();
    });

    await test.step("Verify POE2 navigation item", async () => {
      await expect(homePage.navPOE2).toBeVisible();
    });
  });

  test("should have all main elements visible", async ({ homePage, page }) => {
    await test.step("Take full page screenshot", async () => {
      await page.screenshot({
        path: "test-results/screenshots/home-page.png",
        fullPage: true,
      });
    });

    await test.step("Verify all key elements are present", async () => {
      // Logo
      await expect(homePage.logo).toBeVisible();

      // Main heading/banner
      await expect(homePage.joinGamersText).toBeVisible();

      // Download button
      await expect(homePage.downloadButton).toBeVisible();

      // At least one game card
      const gameCardsVisible =
        (await homePage.lolGameCard.isVisible()) ||
        (await homePage.tftGameCard.isVisible());
      expect(gameCardsVisible).toBeTruthy();

      // Navigation menu
      await expect(homePage.navLOL).toBeVisible();
    });
  });
});
