import { type Page, type Locator, expect } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPONENT TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Use this file as a starting point when adding a new UI component.
 *
 * A "component" represents a single, self-contained section of the page
 * (e.g. navigation bar, hero section, footer, a modal dialog).
 *
 * Rules to follow:
 *  1. Extend `BaseComponent` — never extend `BasePage` from a component.
 *  2. Own your locators here — do NOT reach into another component's locators.
 *  3. Expose public `readonly` Locator properties so tests can use them with
 *     `expect(component.someLocator).toBeVisible()`.
 *  4. Keep interaction/verification methods focused on this one section.
 *  5. Never import test-infra (testInfo, attach, etc.) inside a component.
 *
 * Docs & References:
 *  • Playwright Locators      : https://playwright.dev/docs/locators
 *  • Playwright expect API    : https://playwright.dev/docs/test-assertions
 *  • Page Object Models (POM) : https://playwright.dev/docs/pom
 *  • Playwright best practices: https://playwright.dev/docs/best-practices
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Steps to adapt this template:
 *  1. Rename the class to match the section, e.g. `CheckoutFormComponent`.
 *  2. Replace every `[REPLACE_*]` placeholder with real values.
 *  3. Add / remove locators to match the actual DOM.
 *  4. Add interaction and assertion methods as needed.
 *  5. Delete this banner comment block once you're done.
 */
export class TemplateComponent extends BaseComponent {
  // ── Locators ──────────────────────────────────────────────────────────────
  //
  // Prefer semantic/role-based selectors in this order:
  //   1. getByRole()     — most resilient; matches accessibility tree
  //   2. getByLabel()    — great for form fields
  //   3. getByText()     — for visible text content
  //   4. getByTestId()   — for elements with data-testid attributes
  //   5. locator('css')  — fallback; use specific, stable selectors only
  //
  // Mark every locator as `readonly` so they cannot be reassigned after construction.
  //
  // [REPLACE_SECTION_HEADING] — e.g. "Submit button in the checkout form"
  readonly primaryButton: Locator;
  // [REPLACE_SECTION_HEADING] — e.g. "Text input for the search query"
  readonly inputField: Locator;
  // [REPLACE_SECTION_HEADING] — e.g. "Success / error message banner"
  readonly statusMessage: Locator;

  constructor(page: Page) {
    super(page); // Always call super(page) first

    // ── Initialise each locator in the constructor ───────────────────────────
    // Keep one locator per line for readability and easy diffing.

    // Role-based example (preferred):
    this.primaryButton = page.getByRole("button", { name: "[REPLACE_BUTTON_TEXT]" });

    // Label-based example (ideal for form inputs):
    this.inputField = page.getByLabel("[REPLACE_LABEL_TEXT]");

    // Role/text combination example:
    this.statusMessage = page.getByRole("alert").filter({ hasText: "[REPLACE_STATUS_TEXT]" });

    // CSS selector fallback (avoid if a semantic alternative exists):
    // this.someElement = page.locator('[data-testid="some-element"]');
  }

  // ── Interaction methods ───────────────────────────────────────────────────
  //
  // Use the inherited `this.click()` and `this.waitForElement()` helpers from
  // BaseComponent instead of calling `locator.click()` directly — they add
  // automatic visibility waiting and debug logging.

  /**
   * Click the primary action button.
   * Waits for the button to be visible before clicking.
   */
  async clickPrimaryButton(): Promise<void> {
    this.log.step("Clicking primary button");
    await this.click(this.primaryButton);
  }

  /**
   * Fill the input field with the provided value.
   * Clears any existing text before typing.
   *
   * @param value - The string to type into the field.
   */
  async fillInputField(value: string): Promise<void> {
    this.log.step(`Filling input field with: "${value}"`);
    await this.waitForElement(this.inputField);
    await this.inputField.fill(value);
  }

  // ── Verification / assertion methods ─────────────────────────────────────
  //
  // Keep assertions inside components so tests stay declarative and readable.
  // Use Playwright's `expect` assertions; they produce meaningful failure messages.

  /**
   * Assert the primary button is visible on the page.
   */
  async verifyPrimaryButtonVisible(): Promise<void> {
    await this.verifyElementVisible(this.primaryButton);
  }

  /**
   * Assert that a specific status message appears after an action.
   *
   * @param expectedText - The text the status message must contain.
   */
  async verifyStatusMessage(expectedText: string): Promise<void> {
    await expect(this.page.getByRole("alert").filter({ hasText: expectedText })).toBeVisible();
  }

  /**
   * Assert all key elements in this component are visible.
   * Use this as a lightweight "component is loaded" check in beforeEach hooks.
   */
  async verifyComponentVisible(): Promise<void> {
    await this.verifyElementVisible(this.primaryButton);
    await this.verifyElementVisible(this.inputField);
  }

  // ── Composite / multi-step actions ────────────────────────────────────────
  //
  // Group sequences of low-level steps that always go together into a named
  // high-level method. This keeps test bodies short and intent-revealing.

  /**
   * Fill the input field and submit the form in one step.
   *
   * @param value - The value to submit.
   */
  async submitForm(value: string): Promise<void> {
    this.log.step(`Submitting form with value: "${value}"`);
    await this.fillInputField(value);
    await this.clickPrimaryButton();
    // Wait for navigation or the success-message to appear after submission:
    await this.waitForNavigation();
  }
}
