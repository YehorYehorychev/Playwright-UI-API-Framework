# UI Test Analysis Report — mobalytics.gg

> **Generated:** February 19, 2026  
> **Framework:** Playwright + TypeScript  
> **Scope:** All UI test files under `tests/ui/`  
> **Live site inspected via Playwright MCP:** https://mobalytics.gg

---

## Table of Contents

1. [Existing Test Suite Overview](#1-existing-test-suite-overview)
2. [Duplicate Tests](#2-duplicate-tests)
3. [Coverage Gaps by Page / Section](#3-coverage-gaps-by-page--section)
4. [Proposed New Tests](#4-proposed-new-tests)
5. [Recommendations Summary](#5-recommendations-summary)

---

## 1. Existing Test Suite Overview

### 1.1 Files

| File | Tag Strategy | # Tests | Scope |
|------|-------------|---------|-------|
| `mobalytics-home-smoke.spec.ts` | `@ui @smoke` | 7 | Page load, hero, download CTA, game cards, nav items |
| `mobalytics-home.spec.ts` | `@ui @regression` | 27 | Header, Hero, Game Logos, Features, Improvement Loop, Statistics, Community, Footer, Visuals |
| `mobalytics-poe2-guides.spec.ts` | `@ui @regression @poe2` | 3 | POE2 navigation, guides list, opening a guide |

**Total: 37 UI tests**

### 1.2 Page Objects & Components

| Page Object | Components Used | Notes |
|-------------|----------------|-------|
| `HomePage` | Navigation, Hero, GameCards, Features, ImprovementLoop, Statistics, Community, Footer | Full home-page composition |
| `POE2Page` | Navigation | Only POE2-specific locators; no sub-nav components |
| `BasePage` | — | Shared `goto`, `waitForPageLoad`, `click`, `verifyElementVisible` |

**Pages with NO page object:** LoL, TFT, Valorant, Diablo 4, Borderlands 4, Nightreign, Deadlock, MH Wilds, Blog.

### 1.3 Test Coverage Map — Home Page

| Section | Element / Behaviour | Covered? |
|---------|---------------------|----------|
| Header | Logo visible | ✅ |
| Header | All nav links visible | ✅ |
| Header | Navigate → LoL | ✅ |
| Header | Navigate → TFT | ✅ |
| Header | Navigate → Diablo 4 | ❌ |
| Header | Navigate → PoE2 | ❌ (only from POE2 spec) |
| Header | Navigate → Borderlands 4 | ❌ |
| Header | Navigate → Nightreign | ❌ |
| Header | Navigate → Deadlock | ❌ |
| Header | Navigate → MH Wilds | ❌ |
| Header | Social media links attached | ✅ |
| Header | Social links correct URLs | ❌ |
| Hero | H1 heading visible | ✅ |
| Hero | "10M gamers" text | ✅ |
| Hero | Download button visible | ✅ |
| Hero | Download button href | ✅ |
| Hero | "Watch the video" button | ❌ |
| Game Logos | LoL, TFT, PoE2, Diablo 4 visible | ✅ |
| Game Logos | Navigate via Valorant logo | ✅ |
| Game Logos | Navigate via LoL logo | ❌ |
| Game Logos | Navigate via TFT logo | ❌ |
| Game Logos | Navigate via Diablo 4 logo | ❌ |
| Game Logos | Borderlands 4 / Hades 2 / 2XKO / Deadlock logos visible | ❌ |
| Features | Section heading | ✅ |
| Features | All 3 feature items visible | ✅ |
| Improvement Loop | Heading | ✅ |
| Improvement Loop | All 4 stages visible | ✅ |
| Statistics | 27% stat visible | ✅ |
| Statistics | Research link visible | ✅ |
| Statistics | LCS partnership text | ✅ |
| Statistics | "Read the research" navigates correctly | ❌ |
| Statistics | "Check mobalytics esports" link | ❌ |
| Community | Player count text | ✅ |
| Community | 182 countries text | ✅ (via `verifyCommunityInfoVisible`) |
| Community | Testimonial carousel visible | ❌ |
| Community | Carousel previous / next | ❌ |
| Trusted Partners | Section visible | ❌ |
| Trusted Partners | T1 / Team Liquid / Omen / Tobii quotes | ❌ |
| Second download CTA | Middle-of-page download button | ❌ |
| Bottom download CTA | Footer-area download button | ❌ |
| Footer | LoL section heading | ✅ |
| Footer | TFT section heading | ✅ |
| Footer | Valorant section heading | ✅ |
| Footer | Resources section heading | ✅ |
| Footer | Blog link navigates | ✅ |
| Footer | Diablo 4 / POE2 sections | ❌ |
| Footer | "Other" links (Proving Grounds, Founders Wall) | ❌ |
| Footer | Mobalytics Plus link | ❌ |
| Footer | Discord link | ❌ |
| Footer | Legal links (Terms, Privacy, Cookie Policy) | ❌ |
| Footer | Copyright text | ❌ |
| Footer | Social links in footer (Facebook, Twitter, YouTube, Instagram) | ❌ |
| Cookie Banner | Accept button | ❌ (auto-accepted in `navigate()`) |
| Cookie Banner | "Read More" link | ❌ |
| Privacy | "Do Not Sell / Share" button | ❌ |
| Visual | Full-page screenshot attached | ✅ |
| Visual | Hero section screenshot attached | ✅ |

---

## 2. Duplicate Tests

The following test pairs/groups verify the same behaviour and should be consolidated.

### 2.1 Page Load / Logo Visible

| # | File | Test Name | What it checks |
|---|------|-----------|---------------|
| A | `home-smoke.spec.ts` | `should load home page successfully` | `verifyPageLoaded()` + `navigation.logo` visible |
| B | `home.spec.ts` › Header | `should display logo/home link` | `verifyPageLoaded()` (identical call) |

**Root cause:** Both call `homePage.verifyPageLoaded()` which checks `navigation.homeLink` is attached.  
**Recommendation:** Keep **A** (tagged `@smoke @critical`). Remove **B** or demote it to only the extra logo-visibility assertion that A does not cover.

---

### 2.2 Download Button Visible

| # | File | Test Name | What it checks |
|---|------|-----------|---------------|
| A | `home-smoke.spec.ts` | `should display download button` | `verifyDownloadButtonVisible()` + text contains "DOWNLOAD" |
| B | `home.spec.ts` › Hero | `should display download button` | `verifyDownloadButtonVisible()` (identical call) |

**Recommendation:** Keep **A** (richer assertion). Merge the href-attribute assertion from the separate `home.spec.ts` test into **A** to form one complete download-CTA test. Remove **B**.

---

### 2.3 "Million Gamers" Text

| # | File | Test Name | What it checks |
|---|------|-----------|---------------|
| A | `home-smoke.spec.ts` | `should display main heading with million gamers text` | `hero.verifyJoinMillionGamersText()` |
| B | `home.spec.ts` › Hero | `should display description text` | `hero.verifyJoinMillionGamersText()` (identical call) |

**Recommendation:** Keep **A** only. **B** is a direct duplicate — different suite file, same assertion, same fixture method.

---

### 2.4 Game Cards — LoL and TFT Visibility

| # | File | Test Name | What it checks |
|---|------|-----------|---------------|
| A | `home-smoke.spec.ts` | `should display game cards` | `lolGameCard.isVisible()` + `tftGameCard.isVisible()` |
| B | `home.spec.ts` › Game Logos | `should display LoL game logo` | `verifyLogoVisible(lolGameCard)` |
| C | `home.spec.ts` › Game Logos | `should display TFT game logo` | `verifyLogoVisible(tftGameCard)` |

**Recommendation:** **B** and **C** duplicate the LoL/TFT checks already in **A**. Since `home.spec.ts` also covers PoE2 and Diablo 4 logos (which are not in smoke), keep B and C focused there — either remove their LoL/TFT assertions, or tag them `@regression` only and annotate that `@smoke` already covers the same check.

---

### 2.5 Aggregate "All Main Elements" Test

| # | File | Test Name | What it checks |
|---|------|-----------|---------------|
| A | `home-smoke.spec.ts` | `should have all main elements visible` | logo + hero text + download button + game card + navLOL |

Each sub-assertion inside this test is already a standalone test in the same smoke file and in `home.spec.ts`. The "all elements" test exists as a convenient single-failure point, which is legitimate, but it should be clearly documented as a **sanity aggregate** — not a unique test.

**Recommendation:** Retain but rename to `"[SANITY] all critical home-page elements are visible"` and tag only `@smoke @critical`. Remove the step that duplicates a screenshot already produced by the Visual Tests suite.

---

### 2.6 Summary Table

| Duplicate Group | Action |
|----------------|--------|
| Page load / logo | Remove `home.spec.ts` "display logo/home link"; extend smoke test |
| Download button | Remove `home.spec.ts` "display download button"; merge href check into smoke |
| Million gamers text | Remove `home.spec.ts` "display description text" |
| LoL/TFT game card visibility | Remove LoL/TFT sub-assertions from `home.spec.ts`; keep PoE2/Diablo4/Valorant |
| Sanity aggregate | Rename and retain; remove redundant screenshot step |

---

## 3. Coverage Gaps by Page / Section

### 3.1 Home Page — Untested Interactions

| Gap | Priority | Reason |
|-----|----------|--------|
| Navigate → Diablo 4 from header | High | Core nav link; only LoL & TFT are tested |
| Navigate → PoE2 from header directly | Medium | Covered indirectly via poe2 spec but not as a home nav test |
| Navigate → Borderlands 4 / Nightreign / Deadlock / MH Wilds | Low | Less critical games but nav regression |
| Social links have correct target URLs | Medium | `verifySocialMediaLinksPresent` only checks DOM attachment |
| "Watch the video" button clickable | Medium | Interactive hero element with no test |
| Logo links (game cards) navigation (LoL, TFT, Diablo 4) | Medium | Only Valorant navigation via logo is tested |
| "Read the research" href and navigation | Medium | Link visible but click + URL never asserted |
| "Check mobalytics esports" link | Low | Exists in statistics section |
| Testimonials carousel prev/next | Low | Interactive component completely untested |
| Trusted partners section visible | Low | T1 / Team Liquid / Omen / Tobii section |
| Middle download CTA (improvement loop section) | Medium | Second download button on page |
| Bottom download CTA (desktop app section) | Medium | Third download button on page |
| Footer → Diablo 4 section | Medium | Only LoL / TFT / Valorant / Resources tested |
| Footer → POE2 section | Low | Missing from footer coverage |
| Footer → Legal links (Terms, Privacy, Cookie) | Medium | Compliance-critical links |
| Footer → Social links + correct URLs | Low | Currently untested |
| Footer → Discord link | Low | "Talk to our team on: Discord" |
| Footer → Mobalytics Plus link | Low | Monetisation link |
| Footer → Copyright text present | Low | `"Copyright © 2016-2026"` |
| Cookie banner accept/dismiss flow | Medium | Auto-dismissed in setup; consent UX not tested |
| Cookie banner "Read More" link | Low | `/cookie/` destination |
| "Do Not Sell My Personal Information" button | Low | CCPA compliance element |
| Page title exact string assertion | Low | Currently uses `toContain` only |

### 3.2 LoL Page (`/lol`) — **No spec file exists**

The LoL page has its own navigation bar and several sub-sections:
- Summoner search input
- "Profile" / "Champions" / "Tier List" / "GPI" sub-navigation
- In-game Overlay download CTA

### 3.3 TFT Page (`/tft`) — **No spec file exists**

- Sub-navigation (Meta Team Comps, Comp Builder, Profile, Tier List, Leaderboard)
- Player search field

### 3.4 POE2 Page — Partially Covered

| Gap | Priority |
|-----|----------|
| POE2 sub-navigation items visible (Builds, Guides, Wiki) | High |
| POE2 page title | Medium |
| POE2 page heading | Medium |
| Unauthenticated access to guides page (redirect?) | Medium |
| Guide card components (title, meta, thumbnail visible on grid) | Medium |
| Pagination or load-more on guides | Low |
| Guide page content (heading, body text) | Low |

### 3.5 Cross-Cutting Gaps

| Gap | Priority |
|-----|----------|
| Mobile viewport tests (375×812, 390×844) | High |
| Tablet viewport (768×1024) | Medium |
| Navigation on mobile (hamburger menu) | High |
| Dark mode / theme toggle (if present) | Low |
| 404 error page | Medium |
| Page load within acceptable time (< 5 s) | Medium |
| No broken images (all `<img>` tags load) | Low |
| Keyboard navigation (Tab order, Enter) | Low |
| Authenticated vs unauthenticated view differences | Medium |

---

## 4. Proposed New Tests

### 4.1 Home — Missing Navigation Tests

```typescript
// tests/ui/mobalytics-home-navigation.spec.ts

test.describe("Header Navigation — Extended", { tag: [Tags.ui, Tags.regression, Tags.navigation] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test("should navigate to Diablo 4 from header", async ({ homePage, page }) => {
    await homePage.navigation.navigateTo(homePage.navigation.navDiablo4);
    await expect(page).toHaveURL(TestData.urlPatterns.diablo4);
  });

  test("should navigate to PoE2 from header", async ({ homePage, page }) => {
    await homePage.navigation.navigateTo(homePage.navigation.navPOE2);
    await expect(page).toHaveURL(TestData.urlPatterns.poe2);
  });

  test("should navigate to Borderlands 4 from header", async ({ homePage, page }) => {
    await homePage.navigation.navigateTo(homePage.navigation.navBorderlands4);
    await expect(page).toHaveURL(/.*borderlands-4.*/);
  });

  test("should navigate to Deadlock from header", async ({ homePage, page }) => {
    await homePage.navigation.navigateTo(homePage.navigation.navDeadlock);
    await expect(page).toHaveURL(/.*deadlock.*/);
  });

  test("should navigate to MH Wilds from header", async ({ homePage, page }) => {
    await homePage.navigation.navigateTo(homePage.navigation.navMHWilds);
    await expect(page).toHaveURL(/.*mhw.*/);
  });

  test("should navigate to Nightreign from header", async ({ homePage, page }) => {
    await homePage.navigation.navigateTo(homePage.navigation.navNightreign);
    await expect(page).toHaveURL(/.*elden-ring-nightreign.*/);
  });

  test("social media links should have correct href attributes", async ({ homePage }) => {
    await expect(homePage.navigation.twitterLink).toHaveAttribute("href", /twitter\.com/);
    await expect(homePage.navigation.facebookLink).toHaveAttribute("href", /facebook\.com/);
    await expect(homePage.navigation.instagramLink).toHaveAttribute("href", /instagram\.com/);
  });
});
```

---

### 4.2 Home — Hero Interactions

```typescript
test("should have clickable Play button in the demo video section",
  { tag: [Tags.ui, Tags.regression, Tags.hero] },
  async ({ homePage, page }) => {
    const videoPlayButton = page.getByRole("button", { name: /Video Play/i });
    await expect(videoPlayButton).toBeVisible();
    await expect(videoPlayButton).toBeEnabled();
  }
);

test("all download CTAs on the page should link to Overwolf installer",
  { tag: [Tags.ui, Tags.regression, Tags.hero] },
  async ({ homePage, page }) => {
    const downloadLinks = page.getByRole("link", { name: /Download desktop app/i });
    const count = await downloadLinks.count();
    expect(count).toBeGreaterThanOrEqual(2); // hero + mid-page + bottom
    for (let i = 0; i < count; i++) {
      await expect(downloadLinks.nth(i)).toHaveAttribute(
        "href", TestData.urlPatterns.downloadOverwolf
      );
    }
  }
);
```

---

### 4.3 Home — Footer Completeness

```typescript
test.describe("Footer — Extended", { tag: [Tags.ui, Tags.regression, Tags.footer] }, () => {
  test.beforeEach(async ({ homePage }) => { await homePage.navigate(); });

  test("should display Diablo 4 footer section", async ({ homePage, page }) => {
    await page.getByRole("link", { name: "Diablo 4" }).first().scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Diablo 4" }).first()).toBeVisible();
  });

  test("should display legal links in footer", async ({ page, homePage }) => {
    await expect(page.getByRole("link", { name: "Terms of Service" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cookie Policy" })).toBeVisible();
  });

  test("Footer legal links should navigate to correct pages", async ({ page, homePage }) => {
    await page.getByRole("link", { name: "Terms of Service" }).click();
    await expect(page).toHaveURL(/.*\/terms.*/);
  });

  test("copyright text should be present and contain current year", async ({ page, homePage }) => {
    await expect(page.getByText(/Copyright.*Gamers Net/)).toBeVisible();
  });

  test("Footer social links should have correct href attributes", async ({ page, homePage }) => {
    const fbLink = page.locator("footer, [class*='footer']").getByRole("link", { name: "Facebook" });
    const twitterLink = page.locator("footer, [class*='footer']").getByRole("link", { name: "Twitter" });
    await expect(fbLink).toHaveAttribute("href", /facebook\.com/);
    await expect(twitterLink).toHaveAttribute("href", /twitter\.com/);
  });

  test("Discord link should be present and functional", async ({ page, homePage }) => {
    const discordLink = page.getByRole("link", { name: "Discord" });
    await expect(discordLink).toBeVisible();
    await expect(discordLink).toHaveAttribute("href", /discord\.(gg|com)/);
  });
});
```

---

### 4.4 Cookie Consent Banner

```typescript
test.describe("Cookie Consent", { tag: [Tags.ui, Tags.regression] }, () => {
  // Do NOT use the `homePage` fixture — it auto-accepts cookies
  test("should display cookie banner on first visit", async ({ page }) => {
    await page.goto("https://mobalytics.gg");
    const banner = page.getByText(/This website uses cookies/i);
    await expect(banner).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /Accept/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Read More/i })).toBeVisible();
  });

  test("cookie banner should disappear after accepting", async ({ page }) => {
    await page.goto("https://mobalytics.gg");
    await page.getByRole("button", { name: /Accept/i }).click();
    await expect(page.getByText(/This website uses cookies/i)).not.toBeVisible({ timeout: 3000 });
  });

  test("Read More should navigate to cookie policy page", async ({ page }) => {
    await page.goto("https://mobalytics.gg");
    await page.getByRole("link", { name: /Read More/i }).click();
    await expect(page).toHaveURL(/.*\/cookie.*/);
  });
});
```

---

### 4.5 New Test Suite — LoL Page

```typescript
// tests/ui/mobalytics-lol.spec.ts

test.describe("LoL Page", { tag: [Tags.ui, Tags.regression] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://mobalytics.gg/lol");
  });

  test("should load LoL page with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/League of Legends.*Mobalytics/i);
    await expect(page).toHaveURL(/.*\/lol.*/);
  });

  test("should display LoL sub-navigation items", async ({ page }) => {
    // Sub-nav items observed in live snapshot
    for (const name of ["Tier List", "Champions", "GPI"]) {
      await expect(page.getByRole("link", { name: new RegExp(name, "i") }).first()).toBeVisible();
    }
  });

  test("should display Mobalytics logo on LoL page", async ({ page }) => {
    await expect(page.getByRole("img", { name: "Mobalytics" })).toBeVisible();
  });

  test("Tier List link should navigate to LoL Tier List page", async ({ page }) => {
    await page.getByRole("link", { name: /Tier List/i }).first().click();
    await expect(page).toHaveURL(/.*\/lol\/tier-list.*/);
  });
});
```

---

### 4.6 New Test Suite — POE2 Extended

```typescript
// Additions to mobalytics-poe2-guides.spec.ts or new file

test("should display POE2 page title", { tag: [Tags.poe2, Tags.smoke] },
  async ({ page }) => {
    await page.goto("https://mobalytics.gg/poe-2");
    await expect(page).toHaveTitle(/Path of Exile 2.*Mobalytics/i);
  }
);

test("should display POE2 sub-navigation items (Builds, Guides, Wiki)",
  { tag: [Tags.poe2, Tags.regression] },
  async ({ page }) => {
    await page.goto("https://mobalytics.gg/poe-2");
    for (const label of ["Builds", "Guides", "Wiki"]) {
      const link = page.getByRole("link", { name: new RegExp(label, "i") }).first();
      await expect(link).toBeVisible({ timeout: 10000 });
    }
  }
);

test("unauthenticated user should still see the POE2 guides list",
  { tag: [Tags.poe2, Tags.regression] },
  async ({ page }) => {
    await page.goto("https://mobalytics.gg/poe-2/guides");
    await expect(page).toHaveURL(/.*\/poe-2\/guides/);
    // At least one guide card must be present
    await expect(
      page.getByRole("link", { name: /.+/i }).nth(5)
    ).toBeVisible({ timeout: 15000 });
  }
);
```

---

### 4.7 Responsive / Mobile Viewport Tests

```typescript
// tests/ui/mobalytics-responsive.spec.ts
import { devices } from "@playwright/test";

test.describe("Mobile Viewport — Home Page", { tag: [Tags.ui, Tags.regression] }, () => {
  test.use({ ...devices["iPhone 14"] });

  test("should load home page on mobile viewport", async ({ page }) => {
    await page.goto("https://mobalytics.gg");
    await expect(page).toHaveTitle(/Mobalytics/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });
  });

  test("should display hamburger / mobile navigation menu", async ({ page }) => {
    await page.goto("https://mobalytics.gg");
    // Mobile nav typically collapses into a hamburger button
    const mobileMenuTrigger = page.locator('[aria-label*="menu" i], button[class*="burger"], button[class*="mobile"]').first();
    await expect(mobileMenuTrigger).toBeVisible({ timeout: 10000 });
  });

  test("download button should be accessible on mobile", async ({ page }) => {
    await page.goto("https://mobalytics.gg");
    await expect(
      page.getByRole("link", { name: /Download desktop app/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });
});
```

---

### 4.8 Community — Testimonials Carousel

```typescript
test("should display testimonials carousel with at least one testimonial",
  { tag: [Tags.ui, Tags.regression, Tags.community] },
  async ({ homePage, page }) => {
    await homePage.navigate();
    const testimonial = page.locator("[class*='testimonial'], [class*='review']").first();
    await testimonial.scrollIntoViewIfNeeded();
    await expect(testimonial).toBeVisible({ timeout: 10000 });
  }
);
```

---

### 4.9 Page Load Performance

```typescript
test("home page should load within 5 seconds",
  { tag: [Tags.ui, Tags.smoke] },
  async ({ page }) => {
    const start = Date.now();
    await page.goto("https://mobalytics.gg", { waitUntil: "domcontentloaded" });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  }
);
```

---

## 5. Recommendations Summary

### 5.1 Duplicate Removal

| Action | File | Test to Remove / Rename |
|--------|------|------------------------|
| Remove | `home.spec.ts` | `should display logo/home link` (covered by smoke) |
| Remove | `home.spec.ts` | `should display download button` in Hero section |
| Remove | `home.spec.ts` | `should display description text` in Hero section |
| Merge into smoke | `home.spec.ts` | Move href assertion from `should verify download button has correct URL` into smoke |
| Annotate | `home.spec.ts` | `should display LoL game logo` / `should display TFT game logo` — note they duplicate smoke |
| Rename | `home-smoke.spec.ts` | `should have all main elements visible` → `[SANITY] critical home-page elements present` |

### 5.2 Test Structure Improvements

- **Add `@smoke` tag to POE2 page title test** — the current POE2 smoke test only covers navigation, not a standalone page health check.
- **Add a Tags entry for missing scopes**: `Tags.lol`, `Tags.tft`, `Tags.valorant`, `Tags.cookie`, `Tags.responsive`, `Tags.performance`.
- **Introduce a `LolPage` and `TftPage` page object** following the same pattern as `POE2Page`.
- **Extract a `CookieBannerComponent`** since the accept button is already referenced in `HomePage.navigate()`.

### 5.3 Priority Order for New Test Implementation

| Priority | Test Group | Effort |
|----------|-----------|--------|
| 🔴 High | Mobile viewport / responsive tests | Medium |
| 🔴 High | LoL page basic smoke suite | Low |
| 🟠 Medium | Remaining header navigation links (Diablo 4, PoE2, etc.) | Low |
| 🟠 Medium | Cookie consent banner tests | Low |
| 🟠 Medium | Footer completeness (legal, social, copyright) | Low |
| 🟠 Medium | POE2 sub-navigation & page title | Low |
| 🟡 Low | Game logo navigation (LoL, TFT, Diablo 4 via logo) | Low |
| 🟡 Low | Testimonials carousel | Low |
| 🟡 Low | Page load performance | Low |
| 🟡 Low | Multiple download CTAs href validation | Low |
| 🟡 Low | "Do Not Sell" CCPA button | Low |

### 5.4 Test Count Projection

| Status | Count |
|--------|-------|
| Current UI tests | 37 |
| Duplicate tests to remove | 5 |
| New tests proposed | ~28 |
| **Projected total** | **~60** |

---

*End of Report*
