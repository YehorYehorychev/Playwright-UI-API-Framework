import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Page footer — game section links, resources, and blog navigation.
 */
export class FooterComponent extends BaseComponent {
  readonly lol: Locator;
  readonly tft: Locator;
  readonly valorant: Locator;
  readonly resources: Locator;
  readonly blogLink: Locator;

  constructor(page: Page) {
    super(page);

    this.lol = page.getByRole("link", { name: "League of Legends" }).first();
    this.tft = page.getByRole("link", { name: "Teamfight Tactics" }).first();
    this.valorant = page.getByRole("link", { name: "Valorant" }).first();
    this.resources = page.getByRole("link", { name: "Resources" }).first();
    this.blogLink = page.getByRole("link", { name: "Blog" });
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
}
