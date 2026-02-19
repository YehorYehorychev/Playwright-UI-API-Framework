import { Page, Locator, expect } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Page footer — game section links, resources, blog, legal, and social
 * navigation.
 */
export class FooterComponent extends BaseComponent {
  // ── game / section heading links ─────────────────────────────────────────
  readonly lol: Locator;
  readonly tft: Locator;
  readonly valorant: Locator;
  readonly diablo4: Locator;
  readonly poe2: Locator;
  readonly resources: Locator;

  // ── content links ─────────────────────────────────────────────────────────
  readonly blogLink: Locator;

  // ── legal / utility links ─────────────────────────────────────────────────
  readonly discordLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly cookiePolicyLink: Locator;
  readonly mobalyticsPlusLink: Locator;

  // ── copyright text ────────────────────────────────────────────────────────
  readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);

    const footer = page.locator("footer");

    this.lol = footer.getByRole("link", { name: "League of Legends" }).first();
    this.tft = footer.getByRole("link", { name: "Teamfight Tactics" }).first();
    this.valorant = footer.getByRole("link", { name: "Valorant" }).first();
    this.diablo4 = footer.getByRole("link", { name: "Diablo 4" }).first();
    this.poe2 = footer.getByRole("link", { name: /path of exile 2/i }).first();
    this.resources = footer.getByRole("link", { name: "Resources" }).first();
    this.blogLink = footer.getByRole("link", { name: "Blog" });
    this.discordLink = footer.getByRole("link", { name: /discord/i });
    this.termsLink = footer.getByRole("link", { name: /terms/i });
    this.privacyLink = footer.getByRole("link", { name: /privacy policy/i });
    this.cookiePolicyLink = footer.getByRole("link", {
      name: /cookie policy/i,
    });
    this.mobalyticsPlusLink = footer.getByRole("link", {
      name: /mobalytics\+/i,
    });
    this.copyrightText = footer.getByText(/mobalytics/i).last();
  }

  /** Assert a footer section heading / link is visible. */
  async verifySectionVisible(sectionLocator: Locator): Promise<void> {
    await this.verifyElementVisible(sectionLocator);
  }

  /** Click a footer link and wait for navigation. */
  async navigateViaLink(linkLocator: Locator): Promise<void> {
    await this.click(linkLocator);
    await this.waitForNavigation();
  }

  /** Assert all legal links (Terms, Privacy, Cookie Policy) are visible. */
  async verifyLegalLinksVisible(): Promise<void> {
    await this.verifyElementVisible(this.termsLink);
    await this.verifyElementVisible(this.privacyLink);
    await this.verifyElementVisible(this.cookiePolicyLink);
  }

  /** Assert the Discord link has an href pointing to discord.com. */
  async verifyDiscordLinkHref(): Promise<void> {
    await expect(this.discordLink).toHaveAttribute("href", /discord\.(com|gg)/);
  }

  /** Assert the copyright line is visible in the footer. */
  async verifyCopyrightVisible(): Promise<void> {
    await this.verifyElementVisible(this.copyrightText);
  }
}
