import { type Page, type Locator, expect } from "@playwright/test";
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

    // The site renders the footer as <div class="footer-outer"> — no <footer> element.
    const footer = page.locator(".footer-outer");

    this.lol = footer.getByRole("link", { name: "League of Legends", exact: true }).first();
    this.tft = footer.getByRole("link", { name: "Teamfight Tactics", exact: true }).first();
    this.valorant = footer.getByRole("link", { name: "Valorant", exact: true }).first();
    // Diablo 4 and POE2 section headings are not present in the footer as of 2026-02.
    this.diablo4 = footer.getByRole("link", { name: "Diablo 4", exact: true }).first();
    this.poe2 = footer.getByRole("link", { name: /path of exile 2/i }).first();
    this.resources = footer.getByRole("link", { name: "Resources", exact: true }).first();
    this.blogLink = footer.getByRole("link", { name: "Blog", exact: true });
    // Discord icon link has no visible text — scope by href.
    this.discordLink = footer.locator('a[href*="discord"]');
    this.termsLink = footer.getByRole("link", {
      name: "Terms of Service",
      exact: true,
    });
    this.privacyLink = footer.getByRole("link", {
      name: "Privacy Policy",
      exact: true,
    });
    this.cookiePolicyLink = footer.getByRole("link", {
      name: "Cookie Policy",
      exact: true,
    });
    this.mobalyticsPlusLink = footer.getByRole("link", {
      name: /mobalytics\+/i,
    });
    // Copyright text lives in a plain text node inside .footer-outer.
    this.copyrightText = footer.getByText(/Copyright/i);
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
