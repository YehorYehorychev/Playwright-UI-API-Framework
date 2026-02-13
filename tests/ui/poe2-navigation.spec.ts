import { test, expect } from "../../src/fixtures/test.fixtures";

test.describe("POE2 Navigation Tests", () => {
  test("should navigate to POE2 guides and open specific guide", async ({
    authenticatedPage,
  }) => {
    // Step 1: Navigate to home page
    await authenticatedPage.goto("https://mobalytics.gg");

    // Wait for navigation to be visible
    await authenticatedPage.getByRole("link", { name: "PoE2" }).waitFor();

    // Step 2: Click on POE2 in navigation
    await authenticatedPage.getByRole("link", { name: "PoE2" }).click();

    // Verify we're on POE2 page
    await expect(authenticatedPage).toHaveURL(/.*poe-2.*/);
    console.log("✅ Navigated to POE2 page");

    // Step 3: Click on "Go to Guides Page" button
    await authenticatedPage
      .getByRole("button", { name: "Go to Guides Page" })
      .click();

    // Verify we're on guides page
    await expect(authenticatedPage).toHaveURL(/.*\/poe-2\/guides$/);
    console.log("✅ Navigated to Guides page");

    // Step 4: Find and click on "The Last of the Druids" guide
    await authenticatedPage
      .getByRole("link", { name: "The Last of the Druids:" })
      .click();

    // Wait for URL to change to the guide page
    await authenticatedPage.waitForURL(
      /.*0-4-the-last-of-the-druids-content-livestream-summary$/,
    );
    console.log("✅ Opened 'The Last of the Druids' guide");

    // Take a screenshot for verification
    await authenticatedPage.screenshot({
      path: "test-results/poe2-guide-opened.png",
      fullPage: true,
    });
  });
});
