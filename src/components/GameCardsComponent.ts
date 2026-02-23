import { type Page, type Locator } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Game cards section — the row of game logos on the home page.
 */
export class GameCardsComponent extends BaseComponent {
  readonly section: Locator;
  readonly lolGameCard: Locator;
  readonly tftGameCard: Locator;
  readonly poe2GameCard: Locator;
  readonly diablo4GameCard: Locator;
  readonly valorantGameCard: Locator;

  constructor(page: Page) {
    super(page);

    this.section = page.locator('[class*="games"], [class*="game-list"]').first();
    this.lolGameCard = page.getByRole("link", { name: /logo-lol/i }).first();
    this.tftGameCard = page.getByRole("link", { name: /logo-tft/i }).first();
    this.poe2GameCard = page.getByRole("link", { name: /mobalytics.atlassian/i }).first();
    this.diablo4GameCard = page.getByRole("link", { name: /logo-diablo-4/i }).first();
    this.valorantGameCard = page.getByRole("link", { name: /logo-valorant/i }).first();
  }

  /** Assert a specific game logo card is visible. */
  async verifyLogoVisible(logoLocator: Locator): Promise<void> {
    await this.verifyElementVisible(logoLocator);
  }

  /** Click a game logo and wait for navigation. */
  async navigateViaLogo(logoLocator: Locator): Promise<void> {
    await this.click(logoLocator);
    await this.waitForNavigation();
  }
}
