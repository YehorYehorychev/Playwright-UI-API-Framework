import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

/**
 * Extended regression coverage for the Mobalytics home page.
 * Covers areas not touched by the smoke suite:
 *  - Statistics "Read the research" navigation
 *  - Footer legal & social links
 *  - Footer copyright
 *  - Community section
 *  - Footer game-section links (Diablo 4, POE2)
 *
 * CLI:
 *   npx playwright test tests/ui/mobalytics-home-extended.spec.ts
 *   npx playwright test --grep @footer
 */
test.describe(
  "Mobalytics Home Page — Extended Regression",
  { tag: [Tags.ui, Tags.regression] },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
    });

    // ── Statistics ──────────────────────────────────────────────────────────

    test.describe("Statistics Section", { tag: Tags.statistics }, () => {
      test(
        "should navigate to LoL ladder research via 'Read the research' link",
        {},
        async ({ homePage, context }) => {
          await test.step("Verify 'Read the research' link is visible", async () => {
            await homePage.statistics.verifyResearchLinkVisible();
          });

          // The link has target="_blank" — it opens in a new tab.
          await test.step("Click 'Read the research' link and verify new tab URL", async () => {
            const [newTab] = await Promise.all([
              context.waitForEvent("page"),
              homePage.statistics.readResearchLink.click(),
            ]);
            await newTab.waitForLoadState("domcontentloaded");
            expect(newTab.url()).toMatch(TestData.urlPatterns.lolLadderResearch);
            await newTab.close();
          });
        },
      );

      test("should display LCS partnership text", {}, async ({ homePage }) => {
        await test.step("Verify LCS partnership visible", async () => {
          await homePage.statistics.verifyLCSPartnershipVisible();
        });
      });
    });

    // ── Community ───────────────────────────────────────────────────────────

    test.describe("Community Section", { tag: Tags.community }, () => {
      test("should display community statistics", {}, async ({ homePage }) => {
        await test.step("Verify community section info is visible", async () => {
          await homePage.community.verifyCommunityInfoVisible();
        });
      });
    });

    // ── Footer legal links ──────────────────────────────────────────────────

    test.describe("Footer — Legal Links", { tag: Tags.footer }, () => {
      test("should display Terms, Privacy, and Cookie Policy links", {}, async ({ homePage }) => {
        await test.step("Verify all legal links visible in footer", async () => {
          await homePage.footer.verifyLegalLinksVisible();
        });
      });

      test("should navigate to Terms of Service page", {}, async ({ homePage, page }) => {
        await test.step("Click Terms link in footer", async () => {
          await homePage.footer.navigateViaLink(homePage.footer.termsLink);
        });

        await test.step("Verify Terms URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.terms);
        });
      });

      test("should navigate to Privacy Policy page", {}, async ({ homePage, page }) => {
        await test.step("Click Privacy Policy link in footer", async () => {
          await homePage.footer.navigateViaLink(homePage.footer.privacyLink);
        });

        await test.step("Verify Privacy URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.privacy);
        });
      });

      test("should navigate to Cookie Policy page", {}, async ({ homePage, page }) => {
        await test.step("Click Cookie Policy link in footer", async () => {
          await homePage.footer.navigateViaLink(homePage.footer.cookiePolicyLink);
        });

        await test.step("Verify Cookie Policy URL", async () => {
          await expect(page).toHaveURL(TestData.urlPatterns.cookie);
        });
      });
    });

    // ── Footer social ───────────────────────────────────────────────────────

    test.describe("Footer — Discord Link", { tag: [Tags.footer, Tags.social] }, () => {
      test("should display Discord link with correct href", {}, async ({ homePage }) => {
        await test.step("Verify Discord link href points to discord.com", async () => {
          await homePage.footer.verifyDiscordLinkHref();
        });
      });
    });

    // ── Footer copyright ────────────────────────────────────────────────────

    test.describe("Footer — Copyright", { tag: Tags.footer }, () => {
      test("should display copyright text", {}, async ({ homePage }) => {
        await test.step("Verify copyright is visible in footer", async () => {
          await homePage.footer.verifyCopyrightVisible();
        });
      });
    });

    // ── Footer game sections ────────────────────────────────────────────────

    test.describe("Footer — Game Sections", { tag: Tags.footer }, () => {
      test("should display LoL footer section", {}, async ({ homePage }) => {
        await test.step("Verify LoL section visible in footer", async () => {
          await homePage.footer.verifySectionVisible(homePage.footer.lol);
        });
      });

      test("should display TFT footer section", {}, async ({ homePage }) => {
        await test.step("Verify TFT section visible in footer", async () => {
          await homePage.footer.verifySectionVisible(homePage.footer.tft);
        });
      });

      test("should display Valorant footer section", {}, async ({ homePage }) => {
        await test.step("Verify Valorant section visible in footer", async () => {
          await homePage.footer.verifySectionVisible(homePage.footer.valorant);
        });
      });

      test(
        "should navigate to Blog from footer",
        { tag: Tags.navigation },
        async ({ homePage, page }) => {
          await test.step("Click Blog link in footer", async () => {
            await homePage.footer.navigateViaLink(homePage.footer.blogLink);
          });

          await test.step("Verify Blog URL", async () => {
            await expect(page).toHaveURL(TestData.urlPatterns.blog);
          });
        },
      );
    });
  },
);
