# New QA Engineer Onboarding Guide

A practical reference for writing automated tests in this Playwright + TypeScript framework.  
Read through once end-to-end, then keep it open as a quick-reference while writing your first tests.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Architecture Overview](#2-architecture-overview)
3. [Step-by-step: Adding a New Feature Under Test](#3-step-by-step-adding-a-new-feature-under-test)
   - [3.1 Create a Component](#31-create-a-component)
   - [3.2 Create a Page Object](#32-create-a-page-object)
   - [3.3 Register a Fixture](#33-register-a-fixture)
   - [3.4 Write a UI Spec](#34-write-a-ui-spec)
   - [3.5 Write an API Spec](#35-write-an-api-spec)
4. [Naming Conventions](#4-naming-conventions)
5. [Locator Strategy](#5-locator-strategy)
6. [Tags & Test Filtering](#6-tags--test-filtering)
7. [Test Data & Environment Variables](#7-test-data--environment-variables)
8. [Running Tests Locally](#8-running-tests-locally)
9. [Viewing Reports](#9-viewing-reports)
10. [Common Patterns & Examples](#10-common-patterns--examples)
11. [Checklist Before Raising a PR](#11-checklist-before-raising-a-pr)
12. [Further Reading](#12-further-reading)

---

## 1. Project Structure

```
playwright-mcp-tests/
├── config/
│   └── test.config.ts          # Central typed config — reads from .env
├── src/
│   ├── components/             # Component Object Models (one per UI section)
│   │   ├── BaseComponent.ts    # Abstract base — extend, never instantiate
│   │   └── TemplateComponent.ts  ← copy this when adding a new component
│   ├── data/
│   │   ├── tags.ts             # Type-safe tag constants  (@smoke, @critical …)
│   │   └── test-data.ts        # URLs, URL patterns, UI strings, credentials
│   ├── errors/
│   │   └── test-errors.ts      # Typed error hierarchy (PageLoadError, etc.)
│   ├── fixtures/
│   │   └── test.fixtures.ts    # Playwright fixture extensions — add new pages here
│   ├── helpers/
│   │   └── auth.helper.ts      # loginViaAPI — reusable session helper
│   ├── pages/
│   │   ├── BasePage.ts         # Abstract base — extend, never instantiate
│   │   └── TemplatePage.ts     ← copy this when adding a new page
│   └── utils/
│       ├── element-wait.utils.ts
│       ├── helpers.ts
│       └── logger.ts
├── tests/
│   ├── api/
│   │   └── template-api.spec.ts  ← copy this when adding a new API spec
│   └── ui/
│       └── template-ui.spec.ts   ← copy this when adding a new UI spec
└── docs/
    └── onboarding.md           ← you are here
```

---

## 2. Architecture Overview

```
Test spec (.spec.ts)
  │  uses fixture →
  └── Page Object  (src/pages/)
        │  extends →  BasePage
        └── Component  (src/components/)
              │  extends →  BaseComponent
              └── Playwright `page` API
```

| Layer                        | Responsibility                                                    |
| ---------------------------- | ----------------------------------------------------------------- |
| **Test spec**                | Orchestrates steps; contains `expect` assertions; no raw locators |
| **Page Object**              | Owns page-level routing (`navigate()`) and composes components    |
| **Component**                | Owns locators + interaction/assertion methods for one UI section  |
| **BasePage / BaseComponent** | Shared wait, click, fill, logging utilities                       |
| **Fixtures**                 | Instantiate page/component objects and inject them into specs     |
| **TestData / Tags**          | Single source of truth for data and test categorisation           |

> **Rule of thumb:** If you are writing `page.locator(…)` inside a test spec, move it to a component.

---

## 3. Step-by-step: Adding a New Feature Under Test

### 3.1 Create a Component

1. Copy `src/components/TemplateComponent.ts` → `src/components/MyFeatureComponent.ts`.
2. Rename the class to `MyFeatureComponent`.
3. Replace `[REPLACE_*]` placeholders with real selector/text values.
4. Add locators as `readonly` properties initialised in the constructor.
5. Add interaction methods (`click…`, `fill…`) and assertion methods (`verify…`).

```typescript
// src/components/MyFeatureComponent.ts
import { type Page, type Locator, expect } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

export class MyFeatureComponent extends BaseComponent {
  readonly submitButton: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByRole("button", { name: "Subscribe" });
    this.emailInput = page.getByLabel("Email address");
  }

  async subscribe(email: string): Promise<void> {
    this.log.step(`Subscribing with email: ${email}`);
    await this.waitForElement(this.emailInput);
    await this.emailInput.fill(email);
    await this.click(this.submitButton);
  }

  async verifySubmitButtonVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
  }
}
```

---

### 3.2 Create a Page Object

1. Copy `src/pages/TemplatePage.ts` → `src/pages/MyFeaturePage.ts`.
2. Rename the class to `MyFeaturePage`.
3. Import and compose `MyFeatureComponent` (and any other relevant components).
4. Update `navigate()` to use the correct path from `TestData.urls`.

```typescript
// src/pages/MyFeaturePage.ts
import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { MyFeatureComponent } from "../components/MyFeatureComponent";
import { TestData } from "../data/test-data";
import config from "../../config/test.config";

export class MyFeaturePage extends BasePage {
  readonly myFeature: MyFeatureComponent;

  constructor(page: Page) {
    super(page);
    this.myFeature = new MyFeatureComponent(page);
  }

  async navigate(): Promise<void> {
    await this.goto(`${config.baseURL}${TestData.urls.myFeaturePath}`);
    await this.myFeature.submitButton.waitFor({ state: "visible", timeout: 15000 });
  }
}
```

---

### 3.3 Register a Fixture

Add the new page to `src/fixtures/test.fixtures.ts` so it is available in specs:

```typescript
// src/fixtures/test.fixtures.ts  — add to MyFixtures type:
myFeaturePage: MyFeaturePage;

// add to test.extend<MyFixtures>({ … }):
myFeaturePage: async ({ page }, use) => {
  await use(new MyFeaturePage(page));
},
```

---

### 3.4 Write a UI Spec

1. Copy `tests/ui/template-ui.spec.ts` → `tests/ui/my-feature.spec.ts`.
2. Replace placeholders and change the fixture name to `myFeaturePage`.

```typescript
// tests/ui/my-feature.spec.ts
import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";

test.describe("My Feature — Smoke Tests", { tag: [Tags.ui, Tags.smoke] }, () => {
  test.beforeEach(async ({ myFeaturePage }) => {
    await myFeaturePage.navigate();
  });

  test("should subscribe successfully", { tag: Tags.critical }, async ({ myFeaturePage }) => {
    await test.step("Fill email and submit", async () => {
      await myFeaturePage.myFeature.subscribe("test@example.com");
    });

    await test.step("Verify success state", async () => {
      await expect(myFeaturePage.myFeature.submitButton).toBeDisabled();
    });
  });
});
```

---

### 3.5 Write an API Spec

1. Copy `tests/api/template-api.spec.ts` → `tests/api/my-feature-api.spec.ts`.
2. Update imports, the API URL, payload, and assertions.

```typescript
// tests/api/my-feature-api.spec.ts
import { test, expect } from "@playwright/test"; // ← direct import for API-only specs
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";

test.describe("My Feature API", { tag: [Tags.api, Tags.regression] }, () => {
  test("should return 200 for a valid subscribe request", async ({ request }) => {
    const response = await test.step("POST /subscribe", () =>
      request.post(`${process.env.API_BASE_URL}/subscribe`, {
        data: { email: "test@example.com" },
        headers: { "Content-Type": "application/json" },
      }));

    await test.step("Verify 200 OK", () => {
      expect(response.status()).toBe(200);
    });

    await test.step("Verify body contains id", async () => {
      const body = await response.json();
      expect(body).toHaveProperty("id");
    });
  });
});
```

---

## 4. Naming Conventions

| Artifact           | Convention                    | Example                                   |
| ------------------ | ----------------------------- | ----------------------------------------- |
| Component file     | `PascalCase` + `Component.ts` | `GameCardsComponent.ts`                   |
| Page file          | `PascalCase` + `Page.ts`      | `CheckoutPage.ts`                         |
| UI spec file       | `kebab-case.spec.ts`          | `mobalytics-checkout-smoke.spec.ts`       |
| API spec file      | `kebab-case.spec.ts`          | `mobalytics-checkout-api.spec.ts`         |
| Locator property   | `camelCase` noun              | `submitButton`, `emailInput`              |
| Interaction method | `verb` + noun                 | `clickSubmit()`, `fillEmail()`            |
| Assertion method   | `verify` + noun               | `verifySubmitButtonVisible()`             |
| Test description   | `should` + behaviour          | `"should display error on invalid input"` |

---

## 5. Locator Strategy

Use selectors in this priority order — stop at the first option that works:

| Priority | Selector type    | When to use                                         |
| -------- | ---------------- | --------------------------------------------------- |
| 1        | `getByRole()`    | Always prefer — matches accessibility semantics     |
| 2        | `getByLabel()`   | Form inputs with a visible label                    |
| 3        | `getByText()`    | Static, visible text content                        |
| 4        | `getByTestId()`  | Elements with a `data-testid` attribute             |
| 5        | `locator('css')` | Last resort — use highly specific, stable selectors |

**Avoid:** XPath, `:nth-child`, positional selectors, or implementation-detail class names that change frequently.

```typescript
// ✅ Preferred
this.submitButton = page.getByRole("button", { name: "Subscribe" });
this.emailInput = page.getByLabel("Email address");

// ⚠️  Acceptable fallback
this.banner = page.locator('[data-testid="cookie-banner"]');

// ❌ Avoid
this.button = page.locator(".btn.btn-primary.js-submit");
this.item = page.locator("ul > li:nth-child(3) > a");
```

---

## 6. Tags & Test Filtering

All tags live in `src/data/tags.ts`. Use constants — never raw strings.

```typescript
// ✅ Correct
{
  tag: [Tags.smoke, Tags.critical];
}

// ❌ Wrong — typos will silently not match
{
  tag: ["@smok", "@critical"];
}
```

**Commonly used tags:**

| Tag                  | When to use                                |
| -------------------- | ------------------------------------------ |
| `Tags.smoke`         | A few critical paths — run on every commit |
| `Tags.critical`      | Must-pass; pipeline fails if these fail    |
| `Tags.regression`    | Full coverage — run nightly                |
| `Tags.ui`            | Any browser test                           |
| `Tags.api`           | Any API / request test                     |
| `Tags.navigation`    | Navigation flow tests                      |
| `Tags.authenticated` | Requires a logged-in session               |

**Filtering on the command line:**

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run smoke OR critical
npx playwright test --grep "@smoke|@critical"

# Skip visual tests
npx playwright test --grep-invert @visual
```

Or use the npm scripts defined in `package.json`:

```bash
npm run test:smoke
npm run test:critical
npm run test:regression
npm run test:api
```

---

## 7. Test Data & Environment Variables

All test data lives in `src/data/test-data.ts`. **Never hard-code** credentials, base URLs, or environment-specific values inside test files.

```typescript
// ✅ Correct — data centralised, credentials from env
import { TestData } from "../../src/data/test-data";

await expect(page).toHaveURL(TestData.urlPatterns.lol);
const { email, password } = TestData.credentials.validUser; // reads from .env
```

**Required `.env` variables** (copy `.env.example` → `.env` to start):

```bash
BASE_URL=https://mobalytics.gg
API_BASE_URL=https://api.mobalytics.gg
USER_EMAIL=your-test-account@example.com
USER_PASSWORD=YourTestPassword123!
```

> Credentials are **never** committed to source control. Rotate them periodically.

---

## 8. Running Tests Locally

```bash
# Install dependencies (first time only)
npm ci

# Run all tests (headless, auto-scaled workers)
npm test

# Run with a visible browser window
npm run test:headed

# Run the Playwright UI mode (interactive test runner)
npm run test:ui

# Run only smoke tests
npm run test:smoke

# Run only API tests
npm run test:api

# Run a single file
npx playwright test tests/ui/mobalytics-home-smoke.spec.ts

# Run a test by name pattern
npx playwright test --grep "should load home page"

# Debug a specific test (pauses at each step)
npx playwright test --debug tests/ui/mobalytics-home-smoke.spec.ts
```

---

## 9. Viewing Reports

```bash
# Run tests + open Allure report automatically
npm run test:report

# Or open the Playwright HTML report (after any test run)
npx playwright show-report
```

The Allure report includes:

- Test result timeline
- Step-by-step breakdown with durations
- Screenshots attached on failure (via the `screenshotOnFailure` auto-fixture)
- Logs captured by the structured logger

---

## 10. Common Patterns & Examples

### Wait for a specific element before asserting

```typescript
// In a component method:
async verifyBannerVisible(): Promise<void> {
  await this.page.getByRole("alert").waitFor({ state: "visible", timeout: 10000 });
  await expect(this.page.getByRole("alert")).toBeVisible();
}
```

### Assert URL after navigation

```typescript
await test.step("Verify URL after clicking LoL link", async () => {
  await expect(page).toHaveURL(TestData.urlPatterns.lol);
});
```

### Attach a screenshot to the Allure report

```typescript
test("visual check — hero section", async ({ homePage }, testInfo) => {
  const buffer = await homePage.takeFullPageScreenshot();
  await testInfo.attach("hero-screenshot", {
    body: buffer,
    contentType: "image/png",
  });
});
```

### Authenticated test

```typescript
// Using the pre-built fixture:
test(
  "should display account info when logged in",
  { tag: [Tags.ui, Tags.authenticated] },
  async ({ authenticatedPoe2Page }) => {
    await test.step("Navigate to account page", async () => {
      await authenticatedPoe2Page.navigate();
    });
    // …
  },
);
```

---

## 11. Checklist Before Raising a PR

- [ ] Component locators use `getByRole` / `getByLabel` / `getByTestId` where possible
- [ ] No raw locator strings inside test spec files
- [ ] All test cases are wrapped in `test.step()` blocks
- [ ] Tests are tagged with at least `Tags.ui` or `Tags.api`, plus a scope tag
- [ ] New page/component is registered as a fixture in `test.fixtures.ts`
- [ ] Any new test data or URL is added to `src/data/test-data.ts`
- [ ] No hard-coded credentials or environment-specific URLs in test files
- [ ] `[REPLACE_*]` placeholders removed (if copied from a template)
- [ ] Tests pass locally: `npm run test:smoke`
- [ ] No `test.only` left in the codebase

---

## 12. Further Reading

| Resource                   | Link                                        |
| -------------------------- | ------------------------------------------- |
| Playwright Documentation   | https://playwright.dev/docs/intro           |
| Playwright Locators        | https://playwright.dev/docs/locators        |
| Playwright Assertions      | https://playwright.dev/docs/test-assertions |
| Playwright Fixtures        | https://playwright.dev/docs/test-fixtures   |
| Playwright API Testing     | https://playwright.dev/docs/api-testing     |
| Playwright Best Practices  | https://playwright.dev/docs/best-practices  |
| Page Object Model          | https://playwright.dev/docs/pom             |
| TypeScript Handbook        | https://www.typescriptlang.org/docs/        |
| Allure Playwright Reporter | https://allurereport.org/docs/playwright/   |
