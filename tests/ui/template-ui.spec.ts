/**
 * ─────────────────────────────────────────────────────────────────────────────
 * UI TEST TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Use this file as a starting point when writing browser-based UI tests.
 *
 * Key concepts:
 *  • Import `test` and `expect` from the custom fixtures file — NEVER directly
 *    from `@playwright/test`. The fixture file extends the base `test` object
 *    with typed page-object and component fixtures (e.g. `homePage`, `navigation`).
 *  • Structure every test with `test.step()` blocks. Steps produce named entries
 *    in the Allure report and Playwright HTML report, making failures easier to
 *    localise without reading the full stack trace.
 *  • Use `Tags` constants (never raw strings) to categorise tests. Tags control
 *    which tests run under which npm script / CI stage.
 *  • Never use `page.goto` directly in a test. Use the page object's `navigate()`
 *    method — it waits for the page to be interactive before returning.
 *  • Prefer fixture-based page objects over `new PageObject(page)` in tests,
 *    so setup/teardown is handled centrally.
 *
 * Filtering by tag on the command line:
 *   npx playwright test --grep @smoke
 *   npx playwright test --grep "@regression|@navigation"
 *   npx playwright test --grep-invert @visual
 *
 * Docs & References:
 *  • Playwright test API    : https://playwright.dev/docs/api/class-test
 *  • expect assertions      : https://playwright.dev/docs/test-assertions
 *  • Fixtures               : https://playwright.dev/docs/test-fixtures
 *  • test.step()            : https://playwright.dev/docs/api/class-test#test-step
 *  • Allure Playwright      : https://allurereport.org/docs/playwright/
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Steps to adapt this template:
 *  1. Rename this file, e.g. `mobalytics-checkout.spec.ts`.
 *  2. Replace every `[REPLACE_*]` placeholder with real values.
 *  3. Change the fixture destructuring to the page/component you need.
 *  4. Add / remove test cases as required.
 *  5. Delete this banner comment block once you're done.
 */

// ── Imports ───────────────────────────────────────────────────────────────────
// Always import from the custom fixtures file, NOT from '@playwright/test' directly.
import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Suite-level tags control which runs include this file.
 * Add `Tags.smoke` for critical paths, `Tags.regression` for full coverage.
 * See src/data/tags.ts for the full tag list.
 */
test.describe(
  "[REPLACE_SUITE_NAME] — [REPLACE_SUITE_TYPE] Tests", // e.g. "Checkout Page — Smoke Tests"
  { tag: [Tags.ui, Tags.smoke] },
  () => {
    // ── beforeEach ─────────────────────────────────────────────────────────────
    //
    // Use beforeEach to navigate to the starting URL and ensure the page is
    // loaded before every test. Page objects expose a `navigate()` method that
    // handles both navigation AND waiting for interactivity.
    //
    // The fixture name in the destructuring must match a key in `MyFixtures`
    // inside src/fixtures/test.fixtures.ts.
    //
    // Example using a page-object fixture:
    //   test.beforeEach(async ({ homePage }) => { await homePage.navigate(); });
    //
    // Example using a component fixture (for focused/single-section tests):
    //   test.beforeEach(async ({ navigation, page }) => { await page.goto('/'); });

    test.beforeEach(async ({ homePage }) => {
      // [REPLACE] Call navigate() on the page object that matches your test scope.
      await homePage.navigate();
    });

    // ── Test cases ──────────────────────────────────────────────────────────────

    /**
     * Test: Verify the page loads successfully.
     *
     * Tag with `Tags.critical` for tests that MUST pass to unblock deployment.
     * These are included in the smoke gate and trigger pipeline failure on
     * any regression.
     */
    test("should load page successfully", { tag: Tags.critical }, async ({ homePage }) => {
      await test.step("Verify page is loaded", async () => {
        // Use the page object's built-in verification helper:
        await homePage.verifyPageLoaded();
      });

      await test.step("Verify page title", async () => {
        // getTitle() is inherited from BasePage:
        const title = await homePage.getTitle();
        expect(title).toContain("[REPLACE_EXPECTED_TITLE]");
      });
    });

    /**
     * Test: Verify a key element is visible.
     *
     * Use expect(locator) matchers — they produce retry-with-timeout behaviour
     * automatically (up to the `actionTimeout` set in playwright.config.ts).
     */
    test("should display [REPLACE_ELEMENT_DESCRIPTION]", async ({ homePage }) => {
      await test.step("Verify [REPLACE_ELEMENT_DESCRIPTION] is visible", async () => {
        // Access component locators via the page object:
        await expect(homePage.navigation.logo).toBeVisible();
      });
    });

    /**
     * Test: Verify navigation to another page.
     *
     * Use TestData.urlPatterns for regex-based URL assertions instead of
     * hard-coded strings — patterns tolerate minor URL changes.
     */
    test(
      "should navigate to [REPLACE_TARGET_PAGE] on click",
      { tag: Tags.navigation },
      async ({ homePage, page }) => {
        await test.step("Click navigation link", async () => {
          // [REPLACE] with the actual navigation action:
          await homePage.navigation.navigateTo(homePage.navigation.navLOL);
        });

        await test.step("Verify URL changed to [REPLACE_TARGET_PAGE]", async () => {
          // [REPLACE] with the correct URL pattern from TestData.urlPatterns:
          await expect(page).toHaveURL(TestData.urlPatterns.lol);
        });
      },
    );

    /**
     * Test: Verify user interaction — fill a field and assert an outcome.
     *
     * Use composite high-level methods from the component/page rather than
     * chaining low-level locator calls in the test body.
     */
    test("should [REPLACE_ACTION_DESCRIPTION]", async ({ homePage: _homePage }) => {
      await test.step("Perform [REPLACE_ACTION]", async () => {
        // [REPLACE] with the actual method call on the component or page:
        // await homePage.someComponent.submitForm("example value");
      });

      await test.step("Verify [REPLACE_EXPECTED_OUTCOME]", async () => {
        // [REPLACE] with an assertion against the expected post-action state:
        // await expect(homePage.someComponent.statusMessage).toBeVisible();
        // await expect(homePage.someComponent.statusMessage).toHaveText("Success");
      });
    });

    // ── Add more test cases above this line ───────────────────────────────────
  },
);
