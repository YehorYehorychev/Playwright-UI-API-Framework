import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Header navigation bar — present on every page of mobalytics.gg.
 * Used by both HomePage and POE2Page so it lives as a standalone component.
 */
export class NavigationComponent extends BaseComponent {
  // Brand / home
  readonly logo: Locator;
  readonly homeLink: Locator;

  // Game links
  readonly navLOL: Locator;
  readonly navTFT: Locator;
  readonly navPOE2: Locator;
  readonly navDiablo4: Locator;
  readonly navBorderlands4: Locator;
  readonly navNightreign: Locator;
  readonly navDeadlock: Locator;
  readonly navMHWilds: Locator;

  // Social media (in footer / header socials area)
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly instagramLink: Locator;

  constructor(page: Page) {
    super(page);

    this.logo = page.getByRole("link", { name: "logo" }).first();
    this.homeLink = page.locator('a[href="https://mobalytics.gg"]').first();

    this.navLOL = page.getByRole("link", { name: "LoL", exact: true }).first();
    this.navTFT = page.getByRole("link", { name: "TFT", exact: true }).first();
    this.navPOE2 = page
      .getByRole("link", { name: "PoE2", exact: true })
      .first();
    this.navDiablo4 = page
      .getByRole("link", { name: "Diablo 4", exact: true })
      .first();
    this.navBorderlands4 = page.getByRole("link", {
      name: "Borderlands 4",
      exact: true,
    });
    this.navNightreign = page.getByRole("link", {
      name: "Nightreign",
      exact: true,
    });
    this.navDeadlock = page.getByRole("link", {
      name: "Deadlock",
      exact: true,
    });
    this.navMHWilds = page.getByRole("link", {
      name: "MH Wilds",
      exact: true,
    });

    this.twitterLink = page.locator('[href*="twitter"]').first();
    this.facebookLink = page.locator('[href*="facebook"]').first();
    this.instagramLink = page.locator('[href*="instagram"]').first();
  }

  /** Assert every main nav link is visible. */
  async verifyAllNavLinksVisible(): Promise<void> {
    const items = [
      this.navLOL,
      this.navTFT,
      this.navPOE2,
      this.navDiablo4,
      this.navBorderlands4,
      this.navNightreign,
      this.navDeadlock,
      this.navMHWilds,
    ];
    for (const item of items) {
      await this.verifyElementVisible(item);
    }
  }

  /** Click a nav link and wait for domcontentloaded. */
  async navigateTo(link: Locator): Promise<void> {
    await this.click(link);
    await this.waitForNavigation();
  }

  /** Assert social media links are attached to the DOM. */
  async verifySocialMediaLinksPresent(): Promise<void> {
    await this.twitterLink.waitFor({ state: "attached", timeout: 10000 });
    await this.facebookLink.waitFor({ state: "attached", timeout: 10000 });
    await this.instagramLink.waitFor({ state: "attached", timeout: 10000 });
  }
}
