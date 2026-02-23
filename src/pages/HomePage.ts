import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { NavigationComponent } from "../components/NavigationComponent";
import { HeroComponent } from "../components/HeroComponent";
import { GameCardsComponent } from "../components/GameCardsComponent";
import { FeaturesComponent } from "../components/FeaturesComponent";
import { ImprovementLoopComponent } from "../components/ImprovementLoopComponent";
import { StatisticsComponent } from "../components/StatisticsComponent";
import { CommunityComponent } from "../components/CommunityComponent";
import { FooterComponent } from "../components/FooterComponent";
import config from "../../config/test.config";

/**
 * Home page — composed from focused UI components.
 *
 * Each section of the page is a dedicated component that owns its own
 * locators and interaction methods. The page object itself only contains
 * page-level concerns: routing, initial load, cookies, and screenshot helpers.
 *
 * Usage in tests:
 *   homePage.navigation.navLOL
 *   homePage.hero.downloadButton
 *   homePage.footer.blogLink
 */
export class HomePage extends BasePage {
  // ── Components ────────────────────────────────────────────────────────────
  readonly navigation: NavigationComponent;
  readonly hero: HeroComponent;
  readonly gameCards: GameCardsComponent;
  readonly features: FeaturesComponent;
  readonly improvementLoop: ImprovementLoopComponent;
  readonly statistics: StatisticsComponent;
  readonly community: CommunityComponent;
  readonly footer: FooterComponent;

  // ── Page-level locators (not owned by any single section) ─────────────────
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    super(page);

    this.navigation = new NavigationComponent(page);
    this.hero = new HeroComponent(page);
    this.gameCards = new GameCardsComponent(page);
    this.features = new FeaturesComponent(page);
    this.improvementLoop = new ImprovementLoopComponent(page);
    this.statistics = new StatisticsComponent(page);
    this.community = new CommunityComponent(page);
    this.footer = new FooterComponent(page);

    this.cookieAcceptButton = page.getByRole("button", { name: /Accept/i });
  }

  // ── Page-level actions ────────────────────────────────────────────────────

  /** Navigate to the home page and wait for it to be interactive. */
  async navigate(): Promise<void> {
    await this.goto(config.baseURL);
    await this.hero.mainHeading.waitFor({ state: "visible", timeout: 15000 });
    await this.acceptCookiesIfPresent();
  }

  /** Assert the home page is loaded (home link attached). */
  async verifyPageLoaded(): Promise<void> {
    await this.navigation.homeLink.waitFor({
      state: "attached",
      timeout: 10000,
    });
  }

  /** Assert the page title contains the expected string. */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    const title = await this.getTitle();
    if (!title.includes(expectedTitle)) {
      throw new Error(`Expected title to contain "${expectedTitle}", but got "${title}"`);
    }
  }

  // ── Screenshot helpers ────────────────────────────────────────────────────

  /**
   * Capture a full-page screenshot and return the raw buffer.
   * Attach via testInfo.attach() in the test to make it visible in Allure.
   */
  async takeFullPageScreenshot(): Promise<Buffer> {
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Capture a screenshot of a specific element and return the raw buffer.
   * Attach via testInfo.attach() in the test to make it visible in Allure.
   */
  async takeElementScreenshot(locator: Locator): Promise<Buffer> {
    return await locator.screenshot();
  }
}
