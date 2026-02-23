import { type Page, type Locator, expect } from "@playwright/test";
import { createLogger } from "../utils/logger";
import { type Logger } from "../utils/logger";
import { ElementNotFoundError } from "../errors/test-errors";
import config from "../../config/test.config";

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

  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
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
