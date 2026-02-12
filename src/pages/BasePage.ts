import { Page, Locator, expect } from "@playwright/test";
import config from "../../config/test.config";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: config.timeouts.navigation,
    });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: "visible",
      timeout: timeout || config.timeouts.default,
    });
  }

  /**
   * Click on element with wait
   */
  async click(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.fill(text);
  }

  /**
   * Get text from element
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || "";
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page
      .waitForLoadState("networkidle", { timeout: 10000 })
      .catch(() => {
        console.log("Network idle timeout - continuing anyway");
      });
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `./test-results/screenshots/${name}_${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for specific time
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Accept cookies/dialog if present
   */
  async acceptCookiesIfPresent(): Promise<void> {
    try {
      const acceptButton = this.page.locator(
        'button:has-text("Accept"), button:has-text("Принять")',
      );
      if (await this.isVisible(acceptButton)) {
        await this.click(acceptButton);
      }
    } catch (error) {
      console.log("No cookies dialog found or already accepted");
    }
  }

  /**
   * Verify element text contains expected text
   */
  async verifyTextContains(
    locator: Locator,
    expectedText: string,
  ): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Verify element is visible
   */
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Verify page title
   */
  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}
