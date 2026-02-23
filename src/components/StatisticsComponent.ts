import { type Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Statistics section — "27% win rate improvement" and related content.
 */
export class StatisticsComponent extends BaseComponent {
  readonly percentStatistic;
  readonly readResearchLink;
  readonly lcsPartnershipText;

  constructor(page: Page) {
    super(page);

    this.percentStatistic = page.locator('text="27"');
    this.readResearchLink = page.getByRole("link", {
      name: /Read the research/i,
    });
    this.lcsPartnershipText = page.locator(
      "text=The official data partner of the LCS Amateur Scene",
    );
  }

  async verifyStatisticsVisible(): Promise<void> {
    await this.verifyElementVisible(this.percentStatistic);
  }

  async verifyResearchLinkVisible(): Promise<void> {
    await this.verifyElementVisible(this.readResearchLink);
  }

  async verifyLCSPartnershipVisible(): Promise<void> {
    await this.verifyElementVisible(this.lcsPartnershipText);
  }
}
