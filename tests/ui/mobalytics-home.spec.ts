import { test, expect } from "../../src/fixtures/test.fixtures";

test.describe("Mobalytics Home Page Tests", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto("https://mobalytics.gg");
  });

  test.describe("Header Navigation", () => {
    test("should display logo and navigate to home page on click", async ({
      authenticatedPage,
    }) => {
      // Verify logo is visible
      const logo = authenticatedPage.getByRole("link", {
        name: "Mobalytics logo",
      });
      await expect(logo).toBeVisible();

      // Click logo and verify URL
      await logo.first().click();
      await expect(authenticatedPage).toHaveURL("https://mobalytics.gg");
      console.log("✅ Logo is visible and clickable");
    });

    test("should display all main navigation links", async ({
      authenticatedPage,
    }) => {
      // Check all main navigation items
      const navItems = [
        "LoL",
        "TFT",
        "PoE2",
        "Diablo 4",
        "Borderlands 4",
        "Nightreign",
        "Deadlock",
        "MH Wilds",
      ];

      for (const item of navItems) {
        const link = authenticatedPage.getByRole("link", { name: item });
        await expect(link).toBeVisible();
      }
      console.log("✅ All navigation links are visible");
    });

    test("should navigate to LoL page from header", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.getByRole("link", { name: "LoL" }).click();
      await expect(authenticatedPage).toHaveURL(/.*lol.*/);
      console.log("✅ Successfully navigated to LoL page");
    });

    test("should navigate to TFT page from header", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.getByRole("link", { name: "TFT" }).click();
      await expect(authenticatedPage).toHaveURL(/.*tft.*/);
      console.log("✅ Successfully navigated to TFT page");
    });

    test("should display social media links", async ({ authenticatedPage }) => {
      // Verify social media links exist
      const twitterLink = authenticatedPage
        .getByRole("link", {
          name: "",
        })
        .filter({ has: authenticatedPage.locator('[href*="twitter"]') });
      const facebookLink = authenticatedPage
        .getByRole("link", {
          name: "",
        })
        .filter({ has: authenticatedPage.locator('[href*="facebook"]') });
      const instagramLink = authenticatedPage
        .getByRole("link", {
          name: "",
        })
        .filter({ has: authenticatedPage.locator('[href*="instagram"]') });

      // Check if links are present in the page
      await expect(authenticatedPage.locator('[href*="twitter"]')).toHaveCount(
        1,
      );
      await expect(authenticatedPage.locator('[href*="facebook"]')).toHaveCount(
        1,
      );
      await expect(
        authenticatedPage.locator('[href*="instagram"]'),
      ).toHaveCount(1);
      console.log("✅ Social media links are present");
    });
  });

  test.describe("Hero Section", () => {
    test("should display main heading", async ({ authenticatedPage }) => {
      const heading = authenticatedPage.getByRole("heading", {
        name: /JOIN OVER 10 MILLION GAMERS/i,
        level: 1,
      });
      await expect(heading).toBeVisible();
      console.log("✅ Main heading is visible");
    });

    test("should display description text", async ({ authenticatedPage }) => {
      const description = authenticatedPage.locator(
        "text=Mobalytics is your all-in-one companion",
      );
      await expect(description).toBeVisible();
      console.log("✅ Description text is visible");
    });

    test("should display download button", async ({ authenticatedPage }) => {
      const downloadButton = authenticatedPage.getByRole("link", {
        name: /Download desktop app for Windows/i,
      });
      await expect(downloadButton.first()).toBeVisible();
      console.log("✅ Download button is visible");
    });

    test("should verify download button has correct URL", async ({
      authenticatedPage,
    }) => {
      const downloadButton = authenticatedPage.getByRole("link", {
        name: /Download desktop app for Windows/i,
      });
      await expect(downloadButton.first()).toHaveAttribute(
        "href",
        /.*download.overwolf.com.*/,
      );
      console.log("✅ Download button has correct Overwolf URL");
    });
  });

  test.describe("Game Logos Section", () => {
    test("should display LoL game logo and be clickable", async ({
      authenticatedPage,
    }) => {
      const lolLogo = authenticatedPage.getByRole("link", {
        name: /logo-lol/i,
      });
      await expect(lolLogo).toBeVisible();
      console.log("✅ LoL game logo is visible");
    });

    test("should display TFT game logo and be clickable", async ({
      authenticatedPage,
    }) => {
      const tftLogo = authenticatedPage.getByRole("link", {
        name: /logo-tft/i,
      });
      await expect(tftLogo).toBeVisible();
      console.log("✅ TFT game logo is visible");
    });

    test("should display PoE2 game logo and be clickable", async ({
      authenticatedPage,
    }) => {
      const poe2Logo = authenticatedPage.getByRole("link", {
        name: /mobalytics.atlassian/i,
      });
      await expect(poe2Logo).toBeVisible();
      console.log("✅ PoE2 game logo is visible");
    });

    test("should display Diablo 4 game logo and be clickable", async ({
      authenticatedPage,
    }) => {
      const diablo4Logo = authenticatedPage.getByRole("link", {
        name: /logo-diablo-4/i,
      });
      await expect(diablo4Logo).toBeVisible();
      console.log("✅ Diablo 4 game logo is visible");
    });

    test("should navigate to Valorant page when clicking its logo", async ({
      authenticatedPage,
    }) => {
      const valorantLogo = authenticatedPage.getByRole("link", {
        name: /logo-valorant/i,
      });
      await valorantLogo.click();
      await expect(authenticatedPage).toHaveURL(/.*valorant.*/);
      console.log("✅ Successfully navigated to Valorant page");
    });
  });

  test.describe("Features Section", () => {
    test("should display 'How Mobalytics helps you win more' section", async ({
      authenticatedPage,
    }) => {
      const sectionText = authenticatedPage.locator(
        "text=How Mobalytics helps you win more",
      );
      await expect(sectionText).toBeVisible();
      console.log("✅ Features section header is visible");
    });

    test("should display 'Master the meta every patch' feature", async ({
      authenticatedPage,
    }) => {
      const feature = authenticatedPage.locator(
        "text=Master the meta every patch",
      );
      await expect(feature).toBeVisible();
      console.log("✅ 'Master the meta' feature is visible");
    });

    test("should display 'Identify and fix your weaknesses' feature", async ({
      authenticatedPage,
    }) => {
      const feature = authenticatedPage.locator(
        "text=Identify and fix your weaknesses",
      );
      await expect(feature).toBeVisible();
      console.log("✅ 'Identify weaknesses' feature is visible");
    });

    test("should display 'Get more victories and climb' feature", async ({
      authenticatedPage,
    }) => {
      const feature = authenticatedPage.locator(
        "text=Get more victories and climb",
      );
      await expect(feature).toBeVisible();
      console.log("✅ 'Get victories' feature is visible");
    });
  });

  test.describe("Improvement Loop Section", () => {
    test("should display 'The Mobalytics Improvement Loop' heading", async ({
      authenticatedPage,
    }) => {
      const heading = authenticatedPage.locator(
        "text=The Mobalytics Improvement Loop",
      );
      await expect(heading).toBeVisible();
      console.log("✅ Improvement Loop heading is visible");
    });

    test("should display all four stages: Before, During, After, Between", async ({
      authenticatedPage,
    }) => {
      const stages = ["Before", "During", "After", "Between"];

      for (const stage of stages) {
        const stageElement = authenticatedPage.locator(`text=${stage}`).first();
        await expect(stageElement).toBeVisible();
      }
      console.log("✅ All four improvement loop stages are visible");
    });

    test("should display 'Before your game' description", async ({
      authenticatedPage,
    }) => {
      const description = authenticatedPage.locator(
        "text=Optimize your game plan with key insights",
      );
      await expect(description).toBeVisible();
      console.log("✅ 'Before' stage description is visible");
    });
  });

  test.describe("Statistics Section", () => {
    test("should display 27% climbing statistic", async ({
      authenticatedPage,
    }) => {
      const statistic = authenticatedPage.locator('text="27"');
      await expect(statistic).toBeVisible();
      console.log("✅ 27% statistic is visible");
    });

    test("should display research link", async ({ authenticatedPage }) => {
      const researchLink = authenticatedPage.getByRole("link", {
        name: /Read the research/i,
      });
      await expect(researchLink).toBeVisible();
      console.log("✅ Research link is visible");
    });

    test("should display LCS partnership message", async ({
      authenticatedPage,
    }) => {
      const partnership = authenticatedPage.locator(
        "text=The official data partner of the LCS Amateur Scene",
      );
      await expect(partnership).toBeVisible();
      console.log("✅ LCS partnership message is visible");
    });
  });

  test.describe("Community Section", () => {
    test("should display '10,000,000+ players' message", async ({
      authenticatedPage,
    }) => {
      const message = authenticatedPage.locator(
        "text=10,000,000+ players around the world love Mobalytics",
      );
      await expect(message).toBeVisible();
      console.log("✅ Community size message is visible");
    });

    test("should display '182 countries' text", async ({
      authenticatedPage,
    }) => {
      const countries = authenticatedPage.locator("text=182 countries");
      await expect(countries).toBeVisible();
      console.log("✅ Countries count is visible");
    });

    test("should display user testimonials", async ({ authenticatedPage }) => {
      // Check for testimonial from Poder
      const poderTestimonial = authenticatedPage.locator("text=Poder").first();
      await expect(poderTestimonial).toBeVisible();

      // Check for testimonial from TF Blade
      const tfBladeTestimonial = authenticatedPage.locator("text=TF Blade");
      await expect(tfBladeTestimonial).toBeVisible();

      // Check for testimonial from Midbeast
      const midbeastTestimonial = authenticatedPage.locator("text=Midbeast");
      await expect(midbeastTestimonial).toBeVisible();

      console.log("✅ User testimonials are visible");
    });
  });

  test.describe("Partners Section", () => {
    test("should display 'trusted by the world's best Players and Orgs' message", async ({
      authenticatedPage,
    }) => {
      const message = authenticatedPage.locator(
        "text=Mobalytics is trusted by the world's best Players and Orgs",
      );
      await expect(message).toBeVisible();
      console.log("✅ Partners section message is visible");
    });

    test("should display T1 Team testimonial", async ({
      authenticatedPage,
    }) => {
      const t1Logo = authenticatedPage
        .getByRole("img", { name: "T1 Team" })
        .first();
      await expect(t1Logo).toBeVisible();
      console.log("✅ T1 Team logo is visible");
    });
  });

  test.describe("Footer", () => {
    test("should display League of Legends footer section", async ({
      authenticatedPage,
    }) => {
      const lolSection = authenticatedPage
        .getByRole("link", { name: "League of Legends" })
        .first();
      await expect(lolSection).toBeVisible();
      console.log("✅ LoL footer section is visible");
    });

    test("should display TFT footer section", async ({ authenticatedPage }) => {
      const tftSection = authenticatedPage
        .getByRole("link", { name: "Teamfight Tactics" })
        .first();
      await expect(tftSection).toBeVisible();
      console.log("✅ TFT footer section is visible");
    });

    test("should display Valorant footer section", async ({
      authenticatedPage,
    }) => {
      const valorantSection = authenticatedPage
        .getByRole("link", { name: "Valorant" })
        .first();
      await expect(valorantSection).toBeVisible();
      console.log("✅ Valorant footer section is visible");
    });

    test("should display Resources footer section", async ({
      authenticatedPage,
    }) => {
      const resourcesSection = authenticatedPage
        .getByRole("link", { name: "Resources" })
        .first();
      await expect(resourcesSection).toBeVisible();
      console.log("✅ Resources footer section is visible");
    });

    test("should navigate to Blog from footer", async ({
      authenticatedPage,
    }) => {
      const blogLink = authenticatedPage.getByRole("link", { name: "Blog" });
      await blogLink.click();
      await expect(authenticatedPage).toHaveURL(/.*blog.*/);
      console.log("✅ Successfully navigated to Blog page");
    });
  });

  test.describe("Visual Tests", () => {
    test("should take full page screenshot", async ({ authenticatedPage }) => {
      await authenticatedPage.screenshot({
        path: "test-results/home-page-full.png",
        fullPage: true,
      });
      console.log("✅ Full page screenshot captured");
    });

    test("should take hero section screenshot", async ({
      authenticatedPage,
    }) => {
      const heroSection = authenticatedPage.getByRole("heading", {
        name: /JOIN OVER 10 MILLION GAMERS/i,
        level: 1,
      });
      await heroSection.screenshot({
        path: "test-results/home-page-hero-section.png",
      });
      console.log("✅ Hero section screenshot captured");
    });
  });
});
