import { test, expect } from "../../src/fixtures/test.fixtures";

test.describe("POE2 Navigation Tests", () => {
  test("should navigate from home to POE2 page", async ({
    homePage,
    poe2Page,
  }) => {
    await homePage.navigate();
    await poe2Page.navigateFromHome();
    await poe2Page.verifyOnPOE2Page();
    console.log("✅ Successfully navigated to POE2 page");
  });

  test("should navigate to POE2 guides page", async ({ poe2Page }) => {
    // Navigate directly to POE2 page (faster than navigating from home)
    await poe2Page.goto(`${process.env.BASE_URL}/poe-2`);
    await poe2Page.verifyOnPOE2Page();

    await poe2Page.navigateToGuides();
    await poe2Page.verifyOnGuidesPage();
    console.log("✅ Successfully navigated to Guides page");
  });

  test("should open specific guide from guides page", async ({ poe2Page }) => {
    // Navigate directly to guides page (faster)
    await poe2Page.goto(`${process.env.BASE_URL}/poe-2/guides`);
    await poe2Page.verifyOnGuidesPage();

    await poe2Page.openGuideByTitle("The Last of the Druids");
    await poe2Page.verifyGuideOpened(
      /.*0-4-the-last-of-the-druids-content-livestream-summary$/,
    );
    console.log("✅ Successfully opened 'The Last of the Druids' guide");
  });
});
