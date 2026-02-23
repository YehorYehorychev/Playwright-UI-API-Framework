import { type Locator } from "@playwright/test";
import config from "../../config/test.config";
import { ElementNotFoundError } from "../errors/test-errors";

/**
 * Wait for a locator to become visible within the given timeout.
 *
 * Shared implementation used by both BasePage and BaseComponent to avoid
 * code duplication. Throws a typed ElementNotFoundError with a descriptive
 * snippet of the element's outer HTML for easier debugging.
 *
 * @param locator  - The Playwright Locator to wait for.
 * @param timeout  - Optional override; falls back to config.timeouts.default.
 */
export async function waitForElement(locator: Locator, timeout?: number): Promise<void> {
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
