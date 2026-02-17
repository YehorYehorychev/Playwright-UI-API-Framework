# 🎭 Playwright Test Automation Framework

Professional test automation framework for **Mobalytics.gg** using **Playwright**, **TypeScript**, **Page Object Model**, and **Allure Reports**.

## 🚀 Features

- ✅ **Playwright** - Modern, reliable end-to-end testing
- ✅ **TypeScript** - Type-safe test code with strict typing
- ✅ **Page Object Model (POM)** - Clean and maintainable architecture
- ✅ **Custom Fixtures** - Pre-configured page objects for each test (including authenticated sessions)
- ✅ **Allure Reports** - Beautiful, detailed test reports
- ✅ **Multi-browser Support** - Chromium, Firefox, WebKit
- ✅ **Parallel Execution** - Fast test runs with 4 workers
- ✅ **API Testing** - GraphQL authentication tests
- ✅ **Environment Configuration** - Flexible config management
- ✅ **Structured Logger** - Levelled, colour-coded console output per test context
- ✅ **Typed Error Classes** - Descriptive, catchable error hierarchy
- ✅ **Centralised Test Data** - Single source of truth for URLs, credentials and UI strings
- ✅ **Tag System** - Type-safe tag constants with regex-based CLI filtering

## 📁 Project Structure

```
playwright-mcp-tests/
├── src/
│   ├── pages/                    # Page Object Models
│   │   ├── BasePage.ts          # Base page with common methods + logger + typed errors
│   │   ├── HomePage.ts          # Home page with 60+ locators
│   │   └── POE2Page.ts          # POE2 specific page
│   ├── fixtures/
│   │   └── test.fixtures.ts     # Custom Playwright fixtures (incl. authenticated sessions)
│   ├── helpers/
│   │   └── auth.helper.ts       # API authentication helper (loginViaAPI)
│   ├── utils/
│   │   └── logger.ts            # Structured, levelled test logger
│   ├── errors/
│   │   └── test-errors.ts       # Typed error class hierarchy
│   └── data/
│       ├── test-data.ts         # Centralised test data (URLs, credentials, UI strings)
│       └── tags.ts              # Type-safe tag constants
├── tests/
│   ├── ui/                      # UI tests using POM
│   │   ├── mobalytics-home-smoke.spec.ts      # 7 smoke tests
│   │   ├── mobalytics-home.spec.ts            # 36 comprehensive tests
│   │   └── mobalytics-poe2-guides.spec.ts     # 3 POE2 navigation tests
│   └── api/                     # API tests
│       └── mobalytics-graphql-auth.spec.ts    # 12 GraphQL tests
├── config/
│   └── test.config.ts           # Environment configuration
├── playwright.config.ts         # Playwright configuration
└── .env                         # Environment variables (not committed)
```

## 🏗️ Architecture

### BasePage

Base class for all page objects with common functionality:

- `goto(path)` - Navigate to a path (waits for `domcontentloaded`)
- `waitForPageLoad()` - Wait for networkidle after navigation
- `click(locator)` - Click with automatic waiting
- `fill(locator, value)` - Fill an input field
- `waitForElement(locator)` - Wait for element visibility
- `verifyElementVisible(locator)` - Assert element is visible
- `assertNavigatesTo(pattern)` - Assert current URL matches a regex pattern
- `takeScreenshot(name)` - Capture screenshots
- `acceptCookiesIfPresent()` - Handle cookie banners

All methods log at `debug` level via the built-in `Logger` and throw typed errors on failure.

### HomePage

Main home page with 60+ locators and 30+ methods:

- Navigation links (LoL, TFT, POE2, etc.)
- Game cards and features section
- Footer links and social media
- Community statistics
- Hero section elements

### POE2Page

POE2-specific page with navigation methods:

- `navigateFromHome()` - Navigate from home to POE2 via nav link
- `navigateToGuides()` - Navigate to the guides listing page
- `openGuideByTitle(title)` - Open a specific guide card
- `verifyGuideOpened(title)` - Verify a guide page has loaded

---

### Logger (`src/utils/logger.ts`)

Structured, levelled console logger with ANSI colours and per-context prefixes.

```typescript
import { createLogger } from "../utils/logger";
const log = createLogger("MyContext");

log.debug("locator resolved", { selector });
log.info("navigated to page");
log.warn("element took longer than expected");
log.error("navigation failed", error);
```

Log level is controlled by the `LOG_LEVEL` environment variable (`debug` | `info` | `warn` | `error`). Defaults to `info`.

---

### Typed Error Classes (`src/errors/test-errors.ts`)

Six purpose-built error classes that replace generic `Error` throws:

| Class                  | When to use                                       |
| ---------------------- | ------------------------------------------------- |
| `PageLoadError`        | Page failed to reach expected URL or state        |
| `ElementNotFoundError` | Locator timed out or element was not visible      |
| `NavigationError`      | URL assertion / redirect failed                   |
| `AuthenticationError`  | Login via API or UI failed                        |
| `ApiError`             | HTTP / GraphQL request returned unexpected status |
| `TestDataError`        | A required env var or test data value is missing  |

```typescript
import { NavigationError } from "../errors/test-errors";
throw new NavigationError(`Expected URL ${pattern}, got ${current}`);
```

---

### Centralised Test Data (`src/data/test-data.ts`)

Single source of truth for all values used across tests:

```typescript
import { TestData } from "../data/test-data";

TestData.urls.home; // "/"
TestData.urls.poe2; // "/poe-2"
TestData.urls.poe2Guides; // "/poe-2/guides"
TestData.urlPatterns.poe2; // /.*\/poe-2.*/
TestData.credentials.validUser.email;
TestData.ui.homepage.gamersCount;
TestData.api.graphqlEndpoint;
```

---

### Tag System (`src/data/tags.ts`)

Type-safe tag constants used in `test.describe` / `test` options:

```typescript
import { Tags } from '../data/tags';

test.describe('POE2 Guides', { tag: [Tags.ui, Tags.poe2] }, () => {
  test('should load guides page', { tag: [Tags.smoke, Tags.navigation] }, async () => { ... });
});
```

**Available tags:**

| Tag constant         | Value            | Purpose                      |
| -------------------- | ---------------- | ---------------------------- |
| `Tags.smoke`         | `@smoke`         | Run on every build           |
| `Tags.regression`    | `@regression`    | Nightly / pre-release        |
| `Tags.ui`            | `@ui`            | Browser-driven tests         |
| `Tags.api`           | `@api`           | API / GraphQL tests          |
| `Tags.navigation`    | `@navigation`    | Navigation flows             |
| `Tags.critical`      | `@critical`      | Must-pass; blocks pipeline   |
| `Tags.visual`        | `@visual`        | Screenshot / pixel-diff      |
| `Tags.authenticated` | `@authenticated` | Requires a logged-in session |
| `Tags.poe2`          | `@poe2`          | POE2 section                 |
| `Tags.auth`          | `@auth`          | Login / logout / session     |
| `Tags.hero`          | `@hero`          | Hero section                 |
| `Tags.gameLogos`     | `@game-logos`    | Game logo carousel           |
| `Tags.features`      | `@features`      | Features section             |
| `Tags.footer`        | `@footer`        | Footer area                  |

---

### Custom Fixtures (`src/fixtures/test.fixtures.ts`)

| Fixture                 | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `homePage`              | Unauthenticated `HomePage` instance                            |
| `poe2Page`              | Unauthenticated `POE2Page` instance                            |
| `authenticatedPage`     | `HomePage` with a valid authenticated session injected via API |
| `authenticatedPoe2Page` | `POE2Page` with a valid authenticated session injected via API |

## 🧪 Test Coverage

### UI Tests — 46 tests

**`mobalytics-home-smoke.spec.ts`** — 7 tests `@smoke @ui`

- Page load, title, logo visibility, gamers count, navigation links

**`mobalytics-home.spec.ts`** — 36 tests `@regression @ui`

- Header Navigation (5 tests) `@navigation`
- Hero Section (4 tests) `@hero`
- Game Logos (5 tests) `@game-logos`
- Features Section (4 tests) `@features`
- Improvement Loop (2 tests) `@improvement-loop`
- Statistics (3 tests) `@statistics`
- Community (1 test) `@community`
- Footer Links (5 tests) `@footer`
- Visual Elements (7 tests) `@visual`

**`mobalytics-poe2-guides.spec.ts`** — 3 tests `@poe2 @ui`

- Navigate from home to POE2 `@smoke @navigation`
- Navigate to guides page `@navigation @authenticated`
- Open specific guide from guides page `@regression @authenticated`

### API Tests — 12 tests `@api @auth`

**`mobalytics-graphql-auth.spec.ts`** — 12 tests

- Successful login with email and password
- Account retrieval after login
- Failed / invalid credential scenarios
- Empty credentials validation

## 🏃 Running Tests

```bash
# Install dependencies
npm install

# Run all tests (parallel, headless)
npm test

# Run specific test file
npx playwright test tests/ui/mobalytics-home.spec.ts

# Run tests with browser visible
npm run test:headed

# Run in debug mode (step through tests)
npm run test:debug

# Run in UI mode (interactive)
npm run test:ui

# Run against a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run UI or API tests
npx playwright test tests/ui/
npx playwright test tests/api/
```

### Filtering by Tag

Playwright's `--grep` flag accepts a **regular expression**.

```bash
# Single tag
npx playwright test --grep @smoke
npx playwright test --grep @poe2

# OR — any of these tags
npx playwright test --grep "@smoke|@regression"

# AND — tests that carry BOTH tags (regex lookahead)
npx playwright test --grep "(?=.*@poe2)(?=.*@smoke)"

# Exclude a tag
npx playwright test --grep-invert @visual

# AND + exclude
npx playwright test --grep "(?=.*@ui)(?=.*@regression)" --grep-invert @visual
```

> **Note:** `--grep "@poe2&@smoke"` does **not** work — `&` has no special meaning in regex.  
> Use `(?=.*@poe2)(?=.*@smoke)` for AND logic.

## 📊 Reports

```bash
# View Playwright HTML report
npx playwright show-report

# Generate and view Allure report
npm run report

# Or step-by-step
npm run allure:generate
npm run allure:open

# Live Allure server (auto-refresh)
npm run allure:serve
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
BASE_URL=https://mobalytics.gg
API_BASE_URL=https://api.mobalytics.gg
USER_EMAIL=your.email@example.com
USER_PASSWORD=your_password
USER_USERNAME=your_username
```

### Playwright Config Highlights

- **Timeout**: 90 seconds for navigation (slow site)
- **Wait Strategy**: `domcontentloaded` (faster than networkidle)
- **Retries**: 2 retries on CI, 0 locally
- **Workers**: 4 parallel workers
- **Browsers**: Chromium, Firefox, WebKit
- **Screenshots**: On failure
- **Videos**: On first retry

### Tests Timing Out

1. Check if site is slow - use `domcontentloaded` instead of `networkidle`
2. Increase specific waits, not global timeout
3. Navigate directly to page instead of clicking through

### Selectors Not Found

1. Check if element is in iframe
2. Try different selector strategies (role, text, testid)
3. Add explicit wait: `waitFor({ state: "visible" })`
4. Use `.first()` if multiple matches

### Tests Flaky

1. Use `exact: true` for specific matches
2. Add proper waits before actions
3. Check for overlapping elements
4. Handle popups/cookies/modals

## 🤝 Contributing

1. Follow naming conventions: `mobalytics-<area>-<feature>.spec.ts`
2. Use Page Object Model - no direct selectors in tests
3. Add fixtures for new page objects
4. Keep tests fast and focused
5. Document complex logic

## 📈 Test Results

Current Status:

- ✅ **46 UI tests** - All passing
- ✅ **12 API tests** - All passing
- ✅ **3 browsers** - Chromium, Firefox, WebKit
- ✅ **~20-30s** average test suite execution time

Happy Testing! 🎉
