import { Page, Locator, expect } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Cookie-consent banner that appears on the first page visit.
 *
 * The banner is dismissed automatically when pages are loaded via the
 * `BasePage.navigate()` helper.  Use this component in tests that need
 * to interact with the banner directly (i.e. raw `page.goto()` calls
 * without the Page Object helper).
 */
export class CookieBannerComponent extends BaseComponent {
  /** The outer wrapper / text body of the consent banner. */
  readonly banner: Locator;

  /** "Accept" / "Accept Cookies" CTA inside the banner. */
  readonly acceptButton: Locator;

  /** "Read More" link that navigates to the cookie-policy page. */
  readonly readMoreLink: Locator;

  constructor(page: Page) {
    super(page);

    // The banner is identified by its primary text node
    this.banner = page.locator(
      '[class*="cookie"], [id*="cookie"], [aria-label*="cookie" i]',
    );

    // Accept button – most consent libraries use a button role
    this.acceptButton = page.getByRole("button", { name: /accept/i });

    // "Read more" / "More info" link
    this.readMoreLink = page.getByRole("link", { name: /read more/i });
  }

  /**
   * Assert the cookie console banner is visible on the page.
   * Waits up to the default timeout for it to appear.
   */
  async verifyBannerVisible(): Promise<void> {
    this.log.info("Verifying cookie banner is visible");
    await this.verifyElementVisible(this.acceptButton);
  }

  /**
   * Click the Accept button and wait for the banner to disappear.
   */
  async acceptCookies(): Promise<void> {
    this.log.info("Accepting cookies");
    await this.click(this.acceptButton);
    await this.verifyBannerDismissed();
  }

  /**
   * Assert the Accept button is no longer visible (banner dismissed).
   */
  async verifyBannerDismissed(): Promise<void> {
    this.log.info("Verifying cookie banner dismissed");
    await expect(this.acceptButton).not.toBeVisible();
  }

  /**
   * Click the "Read More" link.
   * Caller is responsible for asserting the resulting navigation.
   */
  async clickReadMore(): Promise<void> {
    this.log.info("Clicking Read More link in cookie banner");
    await this.click(this.readMoreLink);
    await this.waitForNavigation();
  }
}
