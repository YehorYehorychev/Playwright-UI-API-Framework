import { type Page, type Locator } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * "How Mobalytics helps you win more" features section.
 */
export class FeaturesComponent extends BaseComponent {
  readonly section: Locator;
  readonly masterMeta: Locator;
  readonly identifyWeaknesses: Locator;
  readonly getVictories: Locator;

  constructor(page: Page) {
    super(page);

    this.section = page.locator("text=How Mobalytics helps you win more");
    this.masterMeta = page.locator("text=Master the meta every patch");
    this.identifyWeaknesses = page.locator("text=Identify and fix your weaknesses");
    this.getVictories = page.locator("text=Get more victories and climb");
  }

  /** Assert the section heading is visible. */
  async verifySectionVisible(): Promise<void> {
    await this.verifyElementVisible(this.section);
  }

  /** Assert a specific feature item is visible. */
  async verifyFeatureVisible(featureLocator: Locator): Promise<void> {
    await this.verifyElementVisible(featureLocator);
  }
}
