import { Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * "The Mobalytics Improvement Loop" section.
 */
export class ImprovementLoopComponent extends BaseComponent {
  readonly heading;
  readonly beforeStage;
  readonly duringStage;
  readonly afterStage;
  readonly betweenStage;

  constructor(page: Page) {
    super(page);

    this.heading = page.locator("text=The Mobalytics Improvement Loop");
    this.beforeStage = page.locator("text=Before").first();
    this.duringStage = page.locator("text=During").first();
    this.afterStage = page.locator("text=After").first();
    this.betweenStage = page.locator("text=Between").first();
  }

  /** Assert the section heading is visible. */
  async verifyHeadingVisible(): Promise<void> {
    await this.verifyElementVisible(this.heading);
  }

  /** Assert all four stage labels are visible. */
  async verifyAllStagesVisible(): Promise<void> {
    await this.verifyElementVisible(this.beforeStage);
    await this.verifyElementVisible(this.duringStage);
    await this.verifyElementVisible(this.afterStage);
    await this.verifyElementVisible(this.betweenStage);
  }
}
