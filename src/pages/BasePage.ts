import { Page, Locator, expect } from "@playwright/test";
import config from "../../config/test.config";
import { createLogger } from "../utils/logger";
import {
  ElementNotFoundError,
  NavigationError,
  PageLoadError,
} from "../errors/test-errors";

export class BasePage {
  protected readonly log = createLogger(this.constructor.name);
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    this.log.step(`Navigating to: ${url}`);
    try {
      await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: config.timeouts.navigation,
      });
    } catch (err) {
      throw new PageLoadError(url, config.timeouts.navigation);
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    const ms = timeout ?? config.timeouts.default;
    try {
      await locator.waitFor({ state: "visible", timeout: ms });
    } catch {
      const description = await locator
        .evaluate((el) => el.outerHTML.slice(0, 120))
        .catch(() => locator.toString());
      throw new ElementNotFoundError(description, ms);
    }
  }

  /**
   * Click on element with wait
   */
  async click(locator: Locator): Promise<void> {
    this.log.debug("Clicking element", { locator: locator.toString() });
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fill(locator: Locator, text: string): Promise<void> {
    this.log.debug("Filling input", { locator: locator.toString() });
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
        this.log.warn("Network idle timed out — continuing anyway");
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
        'button:has-text("Accept"), button:has-text("Accept All"), button:has-text("I Agree")',
      );
      if (await this.isVisible(acceptButton)) {
        this.log.info("Accepting cookies dialog");
        await this.click(acceptButton);
      } else {
        this.log.debug("No cookies dialog found — skipping");
      }
    } catch (error) {
      this.log.warn("Could not interact with cookies dialog", error);
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

  /**
   * Assert that clicking a locator navigates to a URL matching the expected pattern.
   * Throws NavigationError for a more descriptive failure message.
   */
  async assertNavigatesTo(
    locator: Locator,
    expectedPattern: string | RegExp,
  ): Promise<void> {
    await this.click(locator);
    await this.page.waitForLoadState("domcontentloaded");
    const actual = this.page.url();
    const matches =
      typeof expectedPattern === "string"
        ? actual.includes(expectedPattern)
        : expectedPattern.test(actual);
    if (!matches) {
      throw new NavigationError(actual, expectedPattern);
    }
    this.log.info(`Navigation confirmed: ${actual}`);
  }
}
