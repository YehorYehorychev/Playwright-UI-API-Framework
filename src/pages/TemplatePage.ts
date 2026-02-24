import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TemplateComponent } from "../components/TemplateComponent";
// import { AnotherComponent } from "../components/AnotherComponent";
import config from "../../config/test.config";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PAGE TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Use this file as a starting point when adding a new Page Object.
 *
 * A "page" represents a full application route (e.g. /checkout, /profile).
 * It is composed from focused components — each component owns one visual
 * section of the page. The page object itself handles only:
 *   • Routing (`navigate()`)
 *   • Waiting for the page to be interactive after load
 *   • Page-level locators that don't belong to a single component
 *   • Screenshot helpers
 *
 * Rules to follow:
 *  1. Extend `BasePage`.
 *  2. Compose components; do NOT duplicate their locators here.
 *  3. Pass `page` to every component — never share state across pages.
 *  4. Provide a `navigate()` method that goes to the route AND waits for it
 *     to be interactive before returning.
 *
 * Docs & References:
 *  • Playwright Page Object Model : https://playwright.dev/docs/pom
 *  • Playwright Navigation        : https://playwright.dev/docs/navigations
 *  • Playwright Fixtures          : https://playwright.dev/docs/test-fixtures
 *  • TypeScript Handbook          : https://www.typescriptlang.org/docs/
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Steps to adapt this template:
 *  1. Rename the class, e.g. `CheckoutPage`.
 *  2. Replace every `[REPLACE_*]` placeholder with real values.
 *  3. Import and compose the real components for this route.
 *  4. Update `navigate()` to use the correct URL path from `TestData.urls`.
 *  5. Delete this banner comment block once you're done.
 */
export class TemplatePage extends BasePage {
  // ── Components ────────────────────────────────────────────────────────────
  //
  // Declare one property per component. Initialise them in the constructor.
  // Tests access component locators via these properties:
  //   await expect(templatePage.templateComponent.primaryButton).toBeVisible()

  /** [REPLACE_SECTION] — e.g. "Form section in the middle of the page" */
  readonly templateComponent: TemplateComponent;

  // ── Page-level locators ───────────────────────────────────────────────────
  //
  // Only add locators HERE that belong to the page frame itself and are NOT
  // owned by any component (e.g. a full-page overlay, a cookie banner).

  /** [REPLACE_DESCRIPTION] — e.g. "Cookie consent banner accept button" */
  readonly pageOverlay: Locator;

  constructor(page: Page) {
    super(page); // Always call super(page) first

    // Initialise components — pass `page` to each one:
    this.templateComponent = new TemplateComponent(page);
    // this.anotherComponent = new AnotherComponent(page);

    // Initialise page-level locators:
    this.pageOverlay = page.getByRole("button", { name: /[REPLACE_OVERLAY_TEXT]/i });
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigate to this page and wait until it is interactive.
   *
   * Always await this in `test.beforeEach` so every test starts from a
   * known, fully-loaded state.
   *
   * Replace the path with the real route, e.g.:
   *   await this.goto(`${config.baseURL}${TestData.urls.checkout}`);
   */
  async navigate(): Promise<void> {
    await this.goto(`${config.baseURL}/[REPLACE_PATH]`);

    // Wait for a key element that signals the page is interactive.
    // Prefer a locator that is only present once the data has loaded:
    await this.templateComponent.primaryButton.waitFor({
      state: "visible",
      timeout: 15000,
    });

    // Dismiss any overlay (cookie banner, modal) that would block interactions:
    await this.dismissOverlayIfPresent();
  }

  // ── Page-level actions ────────────────────────────────────────────────────

  /**
   * Assert this page is loaded (use in smoke tests / sanity checks).
   */
  async verifyPageLoaded(): Promise<void> {
    await this.templateComponent.verifyComponentVisible();
  }

  /**
   * Dismiss the page-level overlay if it is visible.
   * Silently succeeds if the overlay is not present.
   */
  async dismissOverlayIfPresent(): Promise<void> {
    const isVisible = await this.isVisible(this.pageOverlay);
    if (isVisible) {
      this.log.info("Overlay detected — dismissing");
      await this.click(this.pageOverlay);
    }
  }

  // ── Screenshot helpers ────────────────────────────────────────────────────
  //
  // Return the raw Buffer from these helpers and attach it via
  // `testInfo.attach()` in the test to make it visible in the Allure report.

  /**
   * Capture a full-page screenshot.
   *
   * @example
   *   const buf = await templatePage.takeFullPageScreenshot();
   *   await testInfo.attach("full-page", { body: buf, contentType: "image/png" });
   */
  async takeFullPageScreenshot(): Promise<Buffer> {
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Capture a screenshot of a specific element.
   *
   * @param locator - The element to screenshot.
   */
  async takeElementScreenshot(locator: Locator): Promise<Buffer> {
    return await locator.screenshot();
  }
}
