import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

/**
 * League of Legends hub page tests.
 *
 * Covers: page load, URL, title, in-page sub-navigation, and navigating
 * to the LoL page from the home-page nav bar.
 *
 * CLI:
 *   npx playwright test --grep @lol
 */
test.describe(
  "Mobalytics LoL Page",
  { tag: [Tags.ui, Tags.regression, Tags.lol] },
  () => {
    test.describe("Direct navigation", {}, () => {
      test.beforeEach(async ({ lolPage }) => {
        await lolPage.navigate();
      });

      test(
        "should load LoL page and display correct URL",
        { tag: Tags.smoke },
        async ({ lolPage, page }) => {
          await test.step("Verify URL matches LoL pattern", async () => {
            await expect(page).toHaveURL(TestData.urlPatterns.lol);
          });

          await test.step("Verify LoL page is confirmed via page object", async () => {
            await lolPage.verifyOnLolPage();
          });
        },
      );

      test("should display correct page title", {}, async ({ lolPage }) => {
        await test.step("Verify LoL page title", async () => {
          await lolPage.verifyPageTitle();
        });
      });

      test("should display the main page heading", {}, async ({ lolPage }) => {
        await test.step("Verify H1 heading is visible", async () => {
          await expect(lolPage.pageHeading).toBeVisible();
        });
      });

      test(
        "should display in-page sub-navigation links",
        {},
        async ({ lolPage }) => {
          await test.step("Verify all sub-nav links are visible", async () => {
            await lolPage.verifySubNavVisible();
          });
        },
      );
    });

    test.describe("Navigation from home page", {}, () => {
      test(
        "should navigate from home to LoL page via top nav",
        { tag: [Tags.smoke, Tags.navigation] },
        async ({ homePage, lolPage, page }) => {
          await test.step("Load home page", async () => {
            await homePage.navigate();
          });

          await test.step("Click LoL link in header", async () => {
            await lolPage.navigateFromHome();
          });

          await test.step("Verify correct LoL URL", async () => {
            await expect(page).toHaveURL(TestData.urlPatterns.lol);
          });
        },
      );
    });
  },
);
