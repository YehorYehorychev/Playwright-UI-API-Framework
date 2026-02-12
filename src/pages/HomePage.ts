import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import config from "../../config/test.config";

export class HomePage extends BasePage {
  // Locators
  readonly logo: Locator;
  readonly pageTitle: Locator;
  readonly mainHeading: Locator;
  readonly joinGamersText: Locator;
  readonly downloadButton: Locator;
  readonly gamesSection: Locator;
  readonly lolGameCard: Locator;
  readonly tftGameCard: Locator;
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

  constructor(page: Page) {
    super(page);

    // Initialize locators - use getByRole and getByText for better accessibility
    this.logo = page.getByRole("link", { name: "logo" }).first();
    this.pageTitle = page.locator("title");
    this.mainHeading = page.getByRole("heading", { level: 1 });
    this.joinGamersText = page.getByText(/JOIN OVER.*MILLION GAMERS/i);
    this.downloadButton = page
      .getByRole("link", { name: /Download desktop app/i })
      .first();
    this.gamesSection = page
      .locator('[class*="games"], [class*="game-list"]')
      .first();

    // Game cards - use links with images
    this.lolGameCard = page.getByRole("link", { name: /logo-lol/i }).first();
    this.tftGameCard = page.getByRole("link", { name: /logo-tft/i }).first();

    // Cookie button
    this.cookieAcceptButton = page.getByRole("button", { name: /Accept/i });

    // Navigation menu - exact text matches from page snapshot
    this.navLOL = page.getByRole("link", { name: "LoL", exact: true });
    this.navTFT = page.getByRole("link", { name: "TFT", exact: true });
    this.navPOE2 = page.getByRole("link", { name: "PoE2", exact: true });
    this.navDiablo4 = page.getByRole("link", { name: "Diablo 4", exact: true });
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
  }

  /**
   * Navigate to Mobalytics home page
   */
  async navigate(): Promise<void> {
    await this.goto(config.baseURL);
    await this.waitForPageLoad();
    await this.acceptCookiesIfPresent();
  }

  /**
   * Verify home page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement(this.logo);
    await this.verifyElementVisible(this.logo);
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
}
