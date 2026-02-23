import { type Page, type Locator, expect } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Hero section — top of the home page with the main heading,
 * the "million gamers" strapline and the download CTA button.
 */
export class HeroComponent extends BaseComponent {
  readonly mainHeading: Locator;
  readonly joinGamersText: Locator;
  readonly downloadButton: Locator;

  constructor(page: Page) {
    super(page);

    this.mainHeading = page.getByRole("heading", { level: 1 });
    this.joinGamersText = page.getByText(/JOIN OVER.*MILLION GAMERS/i);
    this.downloadButton = page.getByRole("link", { name: /Download desktop app/i }).first();
  }

  /** Assert the hero section is fully visible. */
  async verifyVisible(): Promise<void> {
    await this.verifyElementVisible(this.mainHeading);
  }

  /** Assert the "JOIN OVER X MILLION GAMERS" text is visible. */
  async verifyJoinMillionGamersText(): Promise<void> {
    await this.verifyElementVisible(this.joinGamersText);
  }

  /** Assert the download CTA button is visible. */
  async verifyDownloadButtonVisible(): Promise<void> {
    await this.verifyElementVisible(this.downloadButton);
  }

  /** Return the text content of the download button. */
  async getDownloadButtonText(): Promise<string> {
    await this.waitForElement(this.downloadButton);
    return (await this.downloadButton.textContent()) ?? "";
  }

  /** Assert the download button links to the expected href pattern. */
  async verifyDownloadButtonHref(pattern: string | RegExp): Promise<void> {
    await expect(this.downloadButton).toHaveAttribute("href", pattern);
  }
}
