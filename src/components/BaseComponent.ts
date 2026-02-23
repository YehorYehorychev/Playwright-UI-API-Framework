import { type Page, type Locator, expect } from "@playwright/test";
import { createLogger, type Logger } from "../utils/logger";
import { waitForElement } from "../utils/element-wait.utils";

/**
 * Base class for all UI components.
 *
 * Components encapsulate locators and interaction methods for a single
 * section of the UI. They are composed inside Page Objects and can also
 * be injected directly as fixtures into tests that only need one section.
 *
 * Rules:
 *  - Components depend only on `Page` — never on other page objects
 *  - Components own their locators and verification methods
 *  - No test-infra coupling (no testInfo / attach calls here)
 */
export abstract class BaseComponent {
  protected readonly log: Logger;

  constructor(protected readonly page: Page) {
    this.log = createLogger(this.constructor.name);
  }

  /**
   * Wait for element to be visible.
   * Delegates to the shared waitForElement utility to avoid duplication
   * between BasePage and BaseComponent.
   */
  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await waitForElement(locator, timeout);
  }

  protected async click(locator: Locator): Promise<void> {
    this.log.debug("Clicking element", { locator: locator.toString() });
    await this.waitForElement(locator);
    await locator.click();
  }

  protected async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  protected async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
