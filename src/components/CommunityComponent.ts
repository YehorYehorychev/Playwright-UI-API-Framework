import { type Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Community section — player count and country stats.
 */
export class CommunityComponent extends BaseComponent {
  readonly millionPlayersText;
  readonly countriesText;

  constructor(page: Page) {
    super(page);

    this.millionPlayersText = page.locator(
      "text=10,000,000+ players around the world love Mobalytics",
    );
    this.countriesText = page.locator("text=182 countries");
  }

  async verifyCommunityInfoVisible(): Promise<void> {
    await this.verifyElementVisible(this.millionPlayersText);
    await this.verifyElementVisible(this.countriesText);
  }
}
