import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

/**
 * Home-page header navigation tests — each game link and social link.
 *
 * Separated from the main regression run so nav-only failures are
 * immediately obvious without scanning a 300-line spec file.
 *
 * CLI:
 *   npx playwright test --grep @navigation
 */
test.describe(
  "Mobalytics Home Page — Header Navigation",
  { tag: [Tags.ui, Tags.regression, Tags.navigation] },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
    });

    // ── Game links ──────────────────────────────────────────────────────────

    test(
      "should navigate to Diablo 4 page via header",
      {},
      async ({ homePage, page }) => {
        await test.step("Click Diablo 4 nav link", async () => {
          await homePage.navigation.navigateTo(homePage.navigation.navDiablo4);
        });

        await test.step("Verify Diablo 4 URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.diablo4);
        });
      },
    );

    test(
      "should navigate to Path of Exile 2 page via header",
      {},
      async ({ homePage, page }) => {
        await test.step("Click PoE2 nav link", async () => {
          await homePage.navigation.navigateTo(homePage.navigation.navPOE2);
        });

        await test.step("Verify PoE2 URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.poe2);
        });
      },
    );

    test(
      "should navigate to Borderlands 4 page via header",
      {},
      async ({ homePage, page }) => {
        await test.step("Click Borderlands 4 nav link", async () => {
          await homePage.navigation.navigateTo(
            homePage.navigation.navBorderlands4,
          );
        });

        await test.step("Verify Borderlands 4 URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.borderlands4);
        });
      },
    );

    test(
      "should navigate to Nightreign page via header",
      {},
      async ({ homePage, page }) => {
        await test.step("Click Nightreign nav link", async () => {
          await homePage.navigation.navigateTo(
            homePage.navigation.navNightreign,
          );
        });

        await test.step("Verify Nightreign URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.nightreign);
        });
      },
    );

    test(
      "should navigate to Deadlock page via header",
      {},
      async ({ homePage, page }) => {
        await test.step("Click Deadlock nav link", async () => {
          await homePage.navigation.navigateTo(homePage.navigation.navDeadlock);
        });

        await test.step("Verify Deadlock URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.deadlock);
        });
      },
    );

    test(
      "should navigate to Monster Hunter Wilds page via header",
      {},
      async ({ homePage, page }) => {
        await test.step("Click MH Wilds nav link", async () => {
          await homePage.navigation.navigateTo(homePage.navigation.navMHWilds);
        });

        await test.step("Verify MH Wilds URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.mhWilds);
        });
      },
    );

    // ── Social links ────────────────────────────────────────────────────────

    test(
      "should have social media links with correct hrefs",
      { tag: Tags.social },
      async ({ homePage }) => {
        await test.step("Verify Twitter/X link href", async () => {
          await homePage.navigation.verifySocialMediaLinkHrefs();
        });
      },
    );

    test(
      "should display all social media link elements",
      { tag: Tags.social },
      async ({ homePage }) => {
        await test.step("Verify all social links are present in DOM", async () => {
          await homePage.navigation.verifySocialMediaLinksPresent();
        });
      },
    );
  },
);
