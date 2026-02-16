import { test, expect } from "../../src/fixtures/test.fixtures";

test.describe("Mobalytics Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test.describe("Header Navigation", () => {
    test("should display logo/home link", async ({ homePage }) => {
      await homePage.verifyPageLoaded();
      console.log("✅ Logo/home link is present");
    });

    test("should display all main navigation links", async ({ homePage }) => {
      await homePage.verifyAllNavLinksVisible();
      console.log("✅ All navigation links are visible");
    });

    test("should navigate to LoL page from header", async ({
      homePage,
      page,
    }) => {
      await homePage.navigateViaNav(homePage.navLOL);
      await expect(page).toHaveURL(/.*lol.*/);
      console.log("✅ Successfully navigated to LoL page");
    });

    test("should navigate to TFT page from header", async ({
      homePage,
      page,
    }) => {
      await homePage.navigateViaNav(homePage.navTFT);
      await expect(page).toHaveURL(/.*tft.*/);
      console.log("✅ Successfully navigated to TFT page");
    });

    test("should display social media links", async ({ homePage }) => {
      await homePage.verifySocialMediaLinksPresent();
      console.log("✅ Social media links are present");
    });
  });

  test.describe("Hero Section", () => {
    test("should display main heading", async ({ homePage }) => {
      await homePage.verifyElementVisible(homePage.mainHeading);
      console.log("✅ Main heading is visible");
    });

    test("should display description text", async ({ homePage }) => {
      await homePage.verifyJoinMillionGamersText();
      console.log("✅ Description text is visible");
    });

    test("should display download button", async ({ homePage }) => {
      await homePage.verifyDownloadButtonVisible();
      console.log("✅ Download button is visible");
    });

    test("should verify download button has correct URL", async ({
      homePage,
      page,
    }) => {
      await expect(homePage.downloadButton).toHaveAttribute(
        "href",
        /.*download.overwolf.com.*/,
      );
      console.log("✅ Download button has correct Overwolf URL");
    });
  });

  test.describe("Game Logos Section", () => {
    test("should display LoL game logo", async ({ homePage }) => {
      await homePage.verifyGameLogoVisible(homePage.lolGameCard);
      console.log("✅ LoL game logo is visible");
    });

    test("should display TFT game logo", async ({ homePage }) => {
      await homePage.verifyGameLogoVisible(homePage.tftGameCard);
      console.log("✅ TFT game logo is visible");
    });

    test("should display PoE2 game logo", async ({ homePage }) => {
      await homePage.verifyGameLogoVisible(homePage.poe2GameCard);
      console.log("✅ PoE2 game logo is visible");
    });

    test("should display Diablo 4 game logo", async ({ homePage }) => {
      await homePage.verifyGameLogoVisible(homePage.diablo4GameCard);
      console.log("✅ Diablo 4 game logo is visible");
    });

    test("should navigate to Valorant page via logo", async ({
      homePage,
      page,
    }) => {
      await homePage.navigateViaGameLogo(homePage.valorantGameCard);
      await expect(page).toHaveURL(/.*valorant.*/);
      console.log("✅ Successfully navigated to Valorant page");
    });
  });

  test.describe("Features Section", () => {
    test("should display features section heading", async ({ homePage }) => {
      await homePage.verifyFeaturesSectionVisible();
      console.log("✅ Features section header is visible");
    });

    test("should display 'Master the meta' feature", async ({ homePage }) => {
      await homePage.verifyFeatureVisible(homePage.masterMetaFeature);
      console.log("✅ 'Master the meta' feature is visible");
    });

    test("should display 'Identify weaknesses' feature", async ({
      homePage,
    }) => {
      await homePage.verifyFeatureVisible(homePage.identifyWeaknessesFeature);
      console.log("✅ 'Identify weaknesses' feature is visible");
    });

    test("should display 'Get victories' feature", async ({ homePage }) => {
      await homePage.verifyFeatureVisible(homePage.getVictoriesFeature);
      console.log("✅ 'Get victories' feature is visible");
    });
  });

  test.describe("Improvement Loop Section", () => {
    test("should display Improvement Loop heading", async ({ homePage }) => {
      await homePage.verifyImprovementLoopHeadingVisible();
      console.log("✅ Improvement Loop heading is visible");
    });

    test("should display all improvement stages", async ({ homePage }) => {
      await homePage.verifyAllImprovementStagesVisible();
      console.log("✅ All four improvement loop stages are visible");
    });
  });

  test.describe("Statistics Section", () => {
    test("should display 27% statistic", async ({ homePage }) => {
      await homePage.verifyStatisticsVisible();
      console.log("✅ 27% statistic is visible");
    });

    test("should display research link", async ({ homePage }) => {
      await homePage.verifyResearchLinkVisible();
      console.log("✅ Research link is visible");
    });

    test("should display LCS partnership message", async ({ homePage }) => {
      await homePage.verifyLCSPartnershipVisible();
      console.log("✅ LCS partnership message is visible");
    });
  });

  test.describe("Community Section", () => {
    test("should display community information", async ({ homePage }) => {
      await homePage.verifyCommunityInfoVisible();
      console.log("✅ Community size and countries are visible");
    });
  });

  test.describe("Footer", () => {
    test("should display League of Legends footer section", async ({
      homePage,
    }) => {
      await homePage.verifyFooterSectionVisible(homePage.footerLOL);
      console.log("✅ LoL footer section is visible");
    });

    test("should display TFT footer section", async ({ homePage }) => {
      await homePage.verifyFooterSectionVisible(homePage.footerTFT);
      console.log("✅ TFT footer section is visible");
    });

    test("should display Valorant footer section", async ({ homePage }) => {
      await homePage.verifyFooterSectionVisible(homePage.footerValorant);
      console.log("✅ Valorant footer section is visible");
    });

    test("should display Resources footer section", async ({ homePage }) => {
      await homePage.verifyFooterSectionVisible(homePage.footerResources);
      console.log("✅ Resources footer section is visible");
    });

    test("should navigate to Blog from footer", async ({ homePage, page }) => {
      await homePage.navigateViaFooterLink(homePage.footerBlogLink);
      await expect(page).toHaveURL(/.*blog.*/);
      console.log("✅ Successfully navigated to Blog page");
    });
  });

  test.describe("Visual Tests", () => {
    test("should take full page screenshot", async ({ homePage }) => {
      await homePage.takeFullPageScreenshot("home-page-full.png");
      console.log("✅ Full page screenshot captured");
    });

    test("should take hero section screenshot", async ({ homePage }) => {
      await homePage.takeElementScreenshot(
        homePage.mainHeading,
        "home-page-hero.png",
      );
      console.log("✅ Hero section screenshot captured");
    });
  });
});
