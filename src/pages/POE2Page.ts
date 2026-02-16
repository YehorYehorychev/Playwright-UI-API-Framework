import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import config from "../../config/test.config";

export class POE2Page extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly goToGuidesButton: Locator;
  readonly guidesGrid: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.pageHeading = page.getByRole("heading", { level: 1 });
    this.goToGuidesButton = page.getByRole("button", {
      name: "Go to Guides Page",
    });
    this.guidesGrid = page.locator('[class*="guide"], [class*="grid"]').first();
  }

  /**
   * Navigate to POE2 page from home
   */
  async navigateFromHome(): Promise<void> {
    const poe2Link = this.page.getByRole("link", { name: "PoE2", exact: true });
    await poe2Link.waitFor({ state: "visible", timeout: 15000 });
    await this.click(poe2Link);
    await this.waitForPageLoad();
  }

  /**
   * Verify we're on POE2 page
   */
  async verifyOnPOE2Page(): Promise<void> {
    await this.page.waitForURL(/.*poe-2.*/, { timeout: 15000 });
  }

  /**
   * Navigate to Guides page
   */
  async navigateToGuides(): Promise<void> {
    await this.click(this.goToGuidesButton);
    await this.page.waitForURL(/.*\/poe-2\/guides$/, { timeout: 15000 });
    await this.waitForPageLoad();
  }

  /**
   * Verify we're on Guides page
   */
  async verifyOnGuidesPage(): Promise<void> {
    await this.page.waitForURL(/.*\/poe-2\/guides$/, { timeout: 15000 });
  }

  /**
   * Open specific guide by partial title
   */
  async openGuideByTitle(partialTitle: string): Promise<void> {
    const guideLink = this.page.getByRole("link", {
      name: new RegExp(partialTitle, "i"),
    });
    await guideLink.waitFor({ state: "visible", timeout: 15000 });
    await this.click(guideLink);
    await this.waitForPageLoad();
  }

  /**
   * Verify guide page is opened by URL pattern
   */
  async verifyGuideOpened(urlPattern: RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout: 15000 });
  }

  /**
   * Take guide page screenshot
   */
  async takeGuideScreenshot(guideName: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/poe2-${guideName}.png`,
      fullPage: true,
    });
  }
}
