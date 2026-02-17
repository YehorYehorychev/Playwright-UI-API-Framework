import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import config from "../../config/test.config";

/**
 * POE2 navigation and guides tests for mobalytics.gg.
 *
 * CLI:
 *   npx playwright test --grep @poe2
 *   npx playwright test --grep "(?=.*@poe2)(?=.*@smoke)"
 */
test.describe(
  "POE2 Navigation Tests",
  { tag: [Tags.ui, Tags.regression, Tags.poe2] },
  () => {
    test(
      "should navigate from home to POE2 page",
      { tag: [Tags.smoke, Tags.navigation] },
      async ({ homePage, poe2Page }) => {
        await test.step("Navigate to home page", async () => {
          await homePage.navigate();
        });

        await test.step("Click POE2 link from home navigation", async () => {
          await poe2Page.navigateFromHome();
        });

        await test.step("Verify POE2 page loaded", async () => {
          await poe2Page.verifyOnPOE2Page();
          await expect(poe2Page.page).toHaveURL(TestData.urlPatterns.poe2);
        });
      },
    );

    test(
      "should navigate to POE2 guides page",
      { tag: [Tags.navigation, Tags.authenticated] },
      async ({ authenticatedPoe2Page: poe2Page }) => {
        await test.step("Navigate directly to POE2 page", async () => {
          await poe2Page.goto(`${config.baseURL}${TestData.urls.poe2}`);
          await poe2Page.waitForPageLoad();
        });

        await test.step("Click guides navigation button", async () => {
          await poe2Page.navigateToGuides();
        });

        await test.step("Verify guides page loaded", async () => {
          await poe2Page.verifyOnGuidesPage();
          await expect(poe2Page.page).toHaveURL(
            TestData.urlPatterns.poe2Guides,
          );
        });
      },
    );

    test(
      "should open specific guide from guides page",
      { tag: [Tags.regression, Tags.authenticated] },
      async ({ authenticatedPoe2Page: poe2Page }) => {
        const guideTitle = "The Last of the Druids";
        const guideUrlPattern =
          /.*0-4-the-last-of-the-druids-content-livestream-summary$/;

        await test.step("Navigate directly to guides page", async () => {
          await poe2Page.goto(`${config.baseURL}${TestData.urls.poe2Guides}`);
          await poe2Page.waitForPageLoad();
        });

        await test.step(`Open guide: "${guideTitle}"`, async () => {
          await poe2Page.openGuideByTitle(guideTitle);
        });

        await test.step("Verify correct guide page loaded", async () => {
          await poe2Page.verifyGuideOpened(guideUrlPattern);
        });
      },
    );
  },
);
