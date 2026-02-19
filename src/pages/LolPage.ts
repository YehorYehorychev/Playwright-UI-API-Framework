import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { NavigationComponent } from "../components/NavigationComponent";
import { TestData } from "../data/test-data";

/**
 * LoL (League of Legends) game hub page — composes NavigationComponent so
 * the shared nav bar locators are never duplicated between page objects.
 */
export class LolPage extends BasePage {
  // ── Shared component ───────────────────────────────────────────────────────
  readonly navigation: NavigationComponent;

  // ── LoL-specific locators ──────────────────────────────────────────────────
  readonly pageHeading: Locator;
  readonly subNavLinks: Locator;

  constructor(page: Page) {
    super(page);

    this.navigation = new NavigationComponent(page);

    this.pageHeading = page.getByRole("heading", { level: 1 });
    // The LoL in-page sub-navigation bar (Tier List, Champions, GPI …)
    this.subNavLinks = page.getByRole("navigation").last().getByRole("link");
  }

  /**
   * Navigate directly to the LoL hub by URL.
   */
  async navigate(): Promise<void> {
    await this.goto(TestData.urls.lol);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to the LoL hub from the home-page nav bar.
   */
  async navigateFromHome(): Promise<void> {
    await this.navigation.navigateTo(this.navigation.navLOL);
    await this.waitForPageLoad();
  }

  /**
   * Assert the current URL matches the LoL page pattern.
   */
  async verifyOnLolPage(): Promise<void> {
    await this.page.waitForURL(TestData.urlPatterns.lol, { timeout: 15000 });
  }

  /**
   * Assert the page <title> matches the expected LoL title pattern.
   */
  async verifyPageTitle(): Promise<void> {
    await this.verifyPageTitle_internal(TestData.ui.lol.pageTitle);
  }

  /**
   * Assert the LoL in-page sub-navigation links are visible.
   *
   * Uses `exact: true` + `.first()` to avoid strict-mode violations caused
   * by the same label appearing in the page body and the footer.
   */
  async verifySubNavVisible(): Promise<void> {
    for (const label of TestData.ui.lol.subNavLinks) {
      const link = this.page
        .getByRole("link", { name: label, exact: true })
        .first();
      await expect(link).toBeVisible();
    }
  }

  // ── private helper ─────────────────────────────────────────────────────────

  private async verifyPageTitle_internal(pattern: RegExp): Promise<void> {
    const title = await this.page.title();
    if (!pattern.test(title)) {
      throw new Error(
        `Page title "${title}" did not match expected pattern ${pattern}`,
      );
    }
  }
}
