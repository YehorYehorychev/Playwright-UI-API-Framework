import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

/**
 * Home page test suite for mobalytics.gg
 *
 * Tag strategy:
 *  @smoke      - fast, critical checks run on every build
 *  @regression - full coverage run nightly / pre-release
 *  @ui         - all browser-driven tests in this file
 *  Section-specific tags narrow down runs to a single area.
 *
 * CLI examples:
 *  npx playwright test --grep @smoke
 *  npx playwright test --grep @navigation
 *  npx playwright test --grep-invert @visual
 */
test.describe("Mobalytics Home Page", { tag: [Tags.ui, Tags.regression] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test.describe("Header Navigation", { tag: Tags.navigation }, () => {
    test("should display all main navigation links", { tag: Tags.smoke }, async ({ homePage }) => {
      await homePage.navigation.verifyAllNavLinksVisible();
    });

    test(
      "should navigate to LoL page from header",
      { tag: [Tags.smoke, Tags.critical] },
      async ({ homePage, page }) => {
        await homePage.navigation.navigateTo(homePage.navigation.navLOL);
        await expect(page).toHaveURL(TestData.urlPatterns.lol);
      },
    );

    test(
      "should navigate to TFT page from header",
      { tag: Tags.regression },
      async ({ homePage, page }) => {
        await homePage.navigation.navigateTo(homePage.navigation.navTFT);
        await expect(page).toHaveURL(TestData.urlPatterns.tft);
      },
    );

    test(
      "should display social media links",
      { tag: [Tags.regression, Tags.social] },
      async ({ homePage }) => {
        await homePage.navigation.verifySocialMediaLinksPresent();
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Hero Section
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Hero Section", { tag: Tags.hero }, () => {
    test("should display main heading", { tag: Tags.smoke }, async ({ homePage }) => {
      await homePage.verifyElementVisible(homePage.hero.mainHeading);
    });

    test(
      "should verify download button has correct URL",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await expect(homePage.hero.downloadButton).toHaveAttribute(
          "href",
          TestData.urlPatterns.downloadOverwolf,
        );
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Game Logos Section
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Game Logos Section", { tag: Tags.gameLogos }, () => {
    test("should display LoL game logo", { tag: Tags.smoke }, async ({ homePage }) => {
      await homePage.gameCards.verifyLogoVisible(homePage.gameCards.lolGameCard);
    });

    test("should display TFT game logo", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.gameCards.verifyLogoVisible(homePage.gameCards.tftGameCard);
    });

    test("should display PoE2 game logo", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.gameCards.verifyLogoVisible(homePage.gameCards.poe2GameCard);
    });

    test("should display Diablo 4 game logo", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.gameCards.verifyLogoVisible(homePage.gameCards.diablo4GameCard);
    });

    test(
      "should navigate to Valorant page via logo",
      { tag: Tags.regression },
      async ({ homePage, page }) => {
        await homePage.gameCards.navigateViaLogo(homePage.gameCards.valorantGameCard);
        await expect(page).toHaveURL(TestData.urlPatterns.valorant);
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Features Section
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Features Section", { tag: Tags.features }, () => {
    test(
      "should display features section heading",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.features.verifySectionVisible();
      },
    );

    test(
      "should display 'Master the meta' feature",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.features.verifyFeatureVisible(homePage.features.masterMeta);
      },
    );

    test(
      "should display 'Identify weaknesses' feature",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.features.verifyFeatureVisible(homePage.features.identifyWeaknesses);
      },
    );

    test(
      "should display 'Get victories' feature",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.features.verifyFeatureVisible(homePage.features.getVictories);
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Improvement Loop Section
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Improvement Loop Section", { tag: Tags.improvementLoop }, () => {
    test(
      "should display Improvement Loop heading",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.improvementLoop.verifyHeadingVisible();
      },
    );

    test(
      "should display all improvement stages",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.improvementLoop.verifyAllStagesVisible();
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Statistics Section
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Statistics Section", { tag: Tags.statistics }, () => {
    test("should display 27% statistic", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.statistics.verifyStatisticsVisible();
    });

    test("should display research link", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.statistics.verifyResearchLinkVisible();
    });

    test(
      "should display LCS partnership message",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.statistics.verifyLCSPartnershipVisible();
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Community Section
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Community Section", { tag: Tags.community }, () => {
    test("should display community information", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.community.verifyCommunityInfoVisible();
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // Footer
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Footer", { tag: Tags.footer }, () => {
    test(
      "should display League of Legends footer section",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.footer.verifySectionVisible(homePage.footer.lol);
      },
    );

    test("should display TFT footer section", { tag: Tags.regression }, async ({ homePage }) => {
      await homePage.footer.verifySectionVisible(homePage.footer.tft);
    });

    test(
      "should display Valorant footer section",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.footer.verifySectionVisible(homePage.footer.valorant);
      },
    );

    test(
      "should display Resources footer section",
      { tag: Tags.regression },
      async ({ homePage }) => {
        await homePage.footer.verifySectionVisible(homePage.footer.resources);
      },
    );

    test(
      "should navigate to Blog from footer",
      { tag: [Tags.regression, Tags.navigation] },
      async ({ homePage, page }) => {
        await homePage.footer.navigateViaLink(homePage.footer.blogLink);
        await expect(page).toHaveURL(TestData.urlPatterns.blog);
      },
    );
  });

  // ───────────────────────────────────────────────────────────────────────
  // Visual Tests
  // ───────────────────────────────────────────────────────────────────────
  test.describe("Visual Tests", { tag: Tags.visual }, () => {
    test(
      "should take full page screenshot",
      { tag: Tags.visual },
      async ({ homePage }, testInfo) => {
        await test.step("Capture and attach full page screenshot", async () => {
          const screenshot = await homePage.takeFullPageScreenshot();
          await testInfo.attach("home-page-full", {
            body: screenshot,
            contentType: "image/png",
          });
        });
      },
    );

    test(
      "should take hero section screenshot",
      { tag: Tags.visual },
      async ({ homePage }, testInfo) => {
        await test.step("Capture and attach hero section screenshot", async () => {
          const screenshot = await homePage.takeElementScreenshot(homePage.hero.mainHeading);
          await testInfo.attach("home-page-hero", {
            body: screenshot,
            contentType: "image/png",
          });
        });
      },
    );
  });
});
