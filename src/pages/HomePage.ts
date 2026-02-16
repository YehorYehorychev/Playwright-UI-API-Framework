import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import config from "../../config/test.config";

export class HomePage extends BasePage {
  // Locators
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly pageTitle: Locator;
  readonly mainHeading: Locator;
  readonly joinGamersText: Locator;
  readonly downloadButton: Locator;
  readonly gamesSection: Locator;
  readonly lolGameCard: Locator;
  readonly tftGameCard: Locator;
  readonly poe2GameCard: Locator;
  readonly diablo4GameCard: Locator;
  readonly valorantGameCard: Locator;
  readonly cookieAcceptButton: Locator;

  // Navigation menu items
  readonly navLOL: Locator;
  readonly navTFT: Locator;
  readonly navPOE2: Locator;
  readonly navDiablo4: Locator;
  readonly navBorderlands4: Locator;
  readonly navNightreign: Locator;
  readonly navDeadlock: Locator;
  readonly navMHWilds: Locator;

  // Social media links
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly instagramLink: Locator;

  // Features section
  readonly featuresSection: Locator;
  readonly masterMetaFeature: Locator;
  readonly identifyWeaknessesFeature: Locator;
  readonly getVictoriesFeature: Locator;

  // Improvement Loop section
  readonly improvementLoopHeading: Locator;
  readonly beforeStage: Locator;
  readonly duringStage: Locator;
  readonly afterStage: Locator;
  readonly betweenStage: Locator;

  // Statistics section
  readonly percentStatistic: Locator;
  readonly readResearchLink: Locator;
  readonly lcsPartnershipText: Locator;

  // Community section
  readonly millionPlayersText: Locator;
  readonly countriesText: Locator;

  // Footer
  readonly footerLOL: Locator;
  readonly footerTFT: Locator;
  readonly footerValorant: Locator;
  readonly footerResources: Locator;
  readonly footerBlogLink: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize primary locators
    this.logo = page.getByRole("link", { name: "logo" }).first();
    this.homeLink = page.locator('a[href="https://mobalytics.gg"]').first();
    this.pageTitle = page.locator("title");
    this.mainHeading = page.getByRole("heading", { level: 1 });
    this.joinGamersText = page.getByText(/JOIN OVER.*MILLION GAMERS/i);
    this.downloadButton = page
      .getByRole("link", { name: /Download desktop app/i })
      .first();
    this.gamesSection = page
      .locator('[class*="games"], [class*="game-list"]')
      .first();

    // Game cards
    this.lolGameCard = page.getByRole("link", { name: /logo-lol/i }).first();
    this.tftGameCard = page.getByRole("link", { name: /logo-tft/i }).first();
    this.poe2GameCard = page
      .getByRole("link", { name: /mobalytics.atlassian/i })
      .first();
    this.diablo4GameCard = page
      .getByRole("link", { name: /logo-diablo-4/i })
      .first();
    this.valorantGameCard = page
      .getByRole("link", { name: /logo-valorant/i })
      .first();

    // Cookie button
    this.cookieAcceptButton = page.getByRole("button", { name: /Accept/i });

    // Navigation menu
    this.navLOL = page.getByRole("link", { name: "LoL", exact: true }).first();
    this.navTFT = page.getByRole("link", { name: "TFT", exact: true }).first();
    this.navPOE2 = page
      .getByRole("link", { name: "PoE2", exact: true })
      .first();
    this.navDiablo4 = page
      .getByRole("link", { name: "Diablo 4", exact: true })
      .first();
    this.navBorderlands4 = page.getByRole("link", {
      name: "Borderlands 4",
      exact: true,
    });
    this.navNightreign = page.getByRole("link", {
      name: "Nightreign",
      exact: true,
    });
    this.navDeadlock = page.getByRole("link", {
      name: "Deadlock",
      exact: true,
    });
    this.navMHWilds = page.getByRole("link", { name: "MH Wilds", exact: true });

    // Social media
    this.twitterLink = page.locator('[href*="twitter"]').first();
    this.facebookLink = page.locator('[href*="facebook"]').first();
    this.instagramLink = page.locator('[href*="instagram"]').first();

    // Features section
    this.featuresSection = page.locator(
      "text=How Mobalytics helps you win more",
    );
    this.masterMetaFeature = page.locator("text=Master the meta every patch");
    this.identifyWeaknessesFeature = page.locator(
      "text=Identify and fix your weaknesses",
    );
    this.getVictoriesFeature = page.locator(
      "text=Get more victories and climb",
    );

    // Improvement Loop section
    this.improvementLoopHeading = page.locator(
      "text=The Mobalytics Improvement Loop",
    );
    this.beforeStage = page.locator("text=Before").first();
    this.duringStage = page.locator("text=During").first();
    this.afterStage = page.locator("text=After").first();
    this.betweenStage = page.locator("text=Between").first();

    // Statistics section
    this.percentStatistic = page.locator('text="27"');
    this.readResearchLink = page.getByRole("link", {
      name: /Read the research/i,
    });
    this.lcsPartnershipText = page.locator(
      "text=The official data partner of the LCS Amateur Scene",
    );

    // Community section
    this.millionPlayersText = page.locator(
      "text=10,000,000+ players around the world love Mobalytics",
    );
    this.countriesText = page.locator("text=182 countries");

    // Footer
    this.footerLOL = page
      .getByRole("link", { name: "League of Legends" })
      .first();
    this.footerTFT = page
      .getByRole("link", { name: "Teamfight Tactics" })
      .first();
    this.footerValorant = page.getByRole("link", { name: "Valorant" }).first();
    this.footerResources = page
      .getByRole("link", { name: "Resources" })
      .first();
    this.footerBlogLink = page.getByRole("link", { name: "Blog" });
  }

  /**
   * Navigate to Mobalytics home page
   */
  async navigate(): Promise<void> {
    await this.goto(config.baseURL);
    // Wait for main heading to load
    await this.mainHeading.waitFor({ state: "visible", timeout: 15000 });
    await this.acceptCookiesIfPresent();
  }

  /**
   * Verify home page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.homeLink.waitFor({ state: "attached", timeout: 10000 });
  }

  /**
   * Get page title
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    const title = await this.getTitle();
    if (!title.includes(expectedTitle)) {
      throw new Error(
        `Expected title to contain "${expectedTitle}", but got "${title}"`,
      );
    }
  }

  /**
   * Verify main heading contains text
   */
  async verifyMainHeadingContains(text: string): Promise<void> {
    await this.verifyTextContains(this.joinGamersText, text);
  }

  /**
   * Verify download button is visible
   */
  async verifyDownloadButtonVisible(): Promise<void> {
    await this.verifyElementVisible(this.downloadButton);
  }

  /**
   * Click download button
   */
  async clickDownloadButton(): Promise<void> {
    await this.click(this.downloadButton);
  }

  /**
   * Verify game cards are visible
   */
  async verifyGameCardsVisible(): Promise<void> {
    await this.verifyElementVisible(this.lolGameCard);
    await this.verifyElementVisible(this.tftGameCard);
  }

  /**
   * Click on LOL game card
   */
  async clickLOLGameCard(): Promise<void> {
    await this.click(this.lolGameCard);
  }

  /**
   * Click on TFT game card
   */
  async clickTFTGameCard(): Promise<void> {
    await this.click(this.tftGameCard);
  }

  /**
   * Verify navigation menu items are visible
   */
  async verifyNavigationMenuVisible(): Promise<void> {
    const navItems = [this.navLOL, this.navTFT, this.navPOE2];

    for (const item of navItems) {
      await this.verifyElementVisible(item);
    }
  }

  /**
   * Navigate to specific game via navigation menu
   */
  async navigateToGame(gameName: string): Promise<void> {
    const navMap: Record<string, Locator> = {
      lol: this.navLOL,
      tft: this.navTFT,
      poe2: this.navPOE2,
      diablo4: this.navDiablo4,
    };

    const navItem = navMap[gameName.toLowerCase()];
    if (!navItem) {
      throw new Error(`Navigation item for game "${gameName}" not found`);
    }

    await this.click(navItem);
    await this.waitForPageLoad();
  }

  /**
   * Get download button text
   */
  async getDownloadButtonText(): Promise<string> {
    return await this.getText(this.downloadButton);
  }

  /**
   * Verify "10 MILLION GAMERS" text is present
   */
  async verifyJoinMillionGamersText(): Promise<void> {
    await this.verifyElementVisible(this.joinGamersText);
  }

  // ===== Navigation Methods =====

  /**
   * Verify all navigation links are visible
   */
  async verifyAllNavLinksVisible(): Promise<void> {
    const navItems = [
      this.navLOL,
      this.navTFT,
      this.navPOE2,
      this.navDiablo4,
      this.navBorderlands4,
      this.navNightreign,
      this.navDeadlock,
      this.navMHWilds,
    ];

    for (const item of navItems) {
      await this.verifyElementVisible(item);
    }
  }

  /**
   * Navigate to specific page via navigation
   */
  async navigateViaNav(linkLocator: Locator): Promise<void> {
    await this.click(linkLocator);
    await this.page.waitForLoadState("domcontentloaded");
  }

  // ===== Social Media Methods =====

  /**
   * Verify social media links are present
   */
  async verifySocialMediaLinksPresent(): Promise<void> {
    await this.twitterLink.waitFor({ state: "attached", timeout: 10000 });
    await this.facebookLink.waitFor({ state: "attached", timeout: 10000 });
    await this.instagramLink.waitFor({ state: "attached", timeout: 10000 });
  }

  // ===== Game Cards Methods =====

  /**
   * Verify game logo is visible
   */
  async verifyGameLogoVisible(logoLocator: Locator): Promise<void> {
    await this.verifyElementVisible(logoLocator);
  }

  /**
   * Navigate to game page via logo
   */
  async navigateViaGameLogo(logoLocator: Locator): Promise<void> {
    await this.click(logoLocator);
    await this.page.waitForLoadState("domcontentloaded");
  }

  // ===== Features Section Methods =====

  /**
   * Verify features section is visible
   */
  async verifyFeaturesSectionVisible(): Promise<void> {
    await this.verifyElementVisible(this.featuresSection);
  }

  /**
   * Verify specific feature is visible
   */
  async verifyFeatureVisible(featureLocator: Locator): Promise<void> {
    await this.verifyElementVisible(featureLocator);
  }

  // ===== Improvement Loop Methods =====

  /**
   * Verify Improvement Loop heading is visible
   */
  async verifyImprovementLoopHeadingVisible(): Promise<void> {
    await this.verifyElementVisible(this.improvementLoopHeading);
  }

  /**
   * Verify all improvement stages are visible
   */
  async verifyAllImprovementStagesVisible(): Promise<void> {
    await this.verifyElementVisible(this.beforeStage);
    await this.verifyElementVisible(this.duringStage);
    await this.verifyElementVisible(this.afterStage);
    await this.verifyElementVisible(this.betweenStage);
  }

  // ===== Statistics Section Methods =====

  /**
   * Verify statistics are visible
   */
  async verifyStatisticsVisible(): Promise<void> {
    await this.verifyElementVisible(this.percentStatistic);
  }

  /**
   * Verify research link is visible
   */
  async verifyResearchLinkVisible(): Promise<void> {
    await this.verifyElementVisible(this.readResearchLink);
  }

  /**
   * Verify LCS partnership text is visible
   */
  async verifyLCSPartnershipVisible(): Promise<void> {
    await this.verifyElementVisible(this.lcsPartnershipText);
  }

  // ===== Community Section Methods =====

  /**
   * Verify community section is visible
   */
  async verifyCommunityInfoVisible(): Promise<void> {
    await this.verifyElementVisible(this.millionPlayersText);
    await this.verifyElementVisible(this.countriesText);
  }

  // ===== Footer Methods =====

  /**
   * Verify footer section is visible
   */
  async verifyFooterSectionVisible(sectionLocator: Locator): Promise<void> {
    await this.verifyElementVisible(sectionLocator);
  }

  /**
   * Navigate via footer link
   */
  async navigateViaFooterLink(linkLocator: Locator): Promise<void> {
    await this.click(linkLocator);
    await this.page.waitForLoadState("domcontentloaded");
  }

  // ===== Screenshot Methods =====

  /**
   * Take full page screenshot
   */
  async takeFullPageScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/${filename}`,
      fullPage: true,
    });
  }

  /**
   * Take element screenshot
   */
  async takeElementScreenshot(
    locator: Locator,
    filename: string,
  ): Promise<void> {
    await locator.screenshot({
      path: `test-results/${filename}`,
    });
  }
}
