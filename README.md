# 🎭 Playwright Test Automation Framework

Professional test automation framework for **[Mobalytics.gg](https://mobalytics.gg)** — a gaming analytics platform. Built with **Playwright**, **TypeScript**, **Page Object Model**, **Component Objects**, and **Allure Reports**.

---

## 🚀 Features

- ✅ **Playwright** — Modern, reliable end-to-end and API testing
- ✅ **TypeScript** — Strictly typed test code throughout
- ✅ **Page Object Model (POM)** — Clean, reusable page abstractions
- ✅ **Component Object Model** — Isolated components (`NavigationComponent`, `HeroComponent`, `FooterComponent`, etc.)
- ✅ **Custom Fixtures** — Pre-configured page/component objects per test including authenticated sessions
- ✅ **Allure Reports** — Detailed, interactive HTML test reports
- ✅ **Multi-browser** — Chromium by default; Firefox + WebKit on demand via `CROSS_BROWSER=true`
- ✅ **Parallel Execution** — Auto-scales workers to CPU count (50% of logical cores)
- ✅ **API Testing** — GraphQL endpoint, auth, and account tests via Playwright's request API
- ✅ **Headless by default** — Browsers run headless unless `HEADLESS=false`
- ✅ **Environment Config** — All settings driven by `.env` with documented defaults
- ✅ **Structured Logger** — Levelled, colour-coded console output per test context
- ✅ **Typed Error Classes** — Descriptive, catchable error hierarchy
- ✅ **Centralised Test Data** — Single source of truth for URLs, patterns and UI strings
- ✅ **Tag System** — Type-safe tag constants with regex-based CLI filtering
- ✅ **CI/CD Pipeline** — GitHub Actions with fast smoke gate + sharded full regression

---

## 📁 Project Structure

```
playwright-mcp-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI: smoke → regression shards → cross-browser
├── config/
│   └── test.config.ts              # Typed config object, reads from .env
├── scripts/
│   └── test-and-report.sh          # Run tests + optional Allure report prompt
├── src/
│   ├── components/                 # Component Object Models
│   │   ├── BaseComponent.ts
│   │   ├── CommunityComponent.ts
│   │   ├── CookieBannerComponent.ts
│   │   ├── FeaturesComponent.ts
│   │   ├── FooterComponent.ts
│   │   ├── GameCardsComponent.ts
│   │   ├── HeroComponent.ts
│   │   ├── ImprovementLoopComponent.ts
│   │   ├── NavigationComponent.ts
│   │   └── StatisticsComponent.ts
│   ├── data/
│   │   ├── tags.ts                 # Type-safe tag constants (@smoke, @critical, …)
│   │   └── test-data.ts            # Centralised URLs, URL patterns, UI strings
│   ├── errors/
│   │   └── test-errors.ts          # Typed error hierarchy
│   ├── fixtures/
│   │   └── test.fixtures.ts        # Custom Playwright fixtures + auto screenshot
│   ├── helpers/
│   │   └── auth.helper.ts          # loginViaAPI helper
│   ├── pages/
│   │   ├── BasePage.ts             # Shared navigation, wait, assertion helpers
│   │   ├── HomePage.ts             # Home page (composes all components)
│   │   ├── LolPage.ts              # League of Legends hub page
│   │   └── POE2Page.ts             # Path of Exile 2 page
│   └── utils/
│       ├── element-wait.utils.ts   # Shared waitForElement helper (used by BasePage & BaseComponent)
│       ├── string.utils.ts         # General-purpose string and date utilities
│       └── logger.ts               # Structured, levelled console logger
├── tests/
│   ├── api/                        # API / GraphQL tests (27 tests)
│   │   ├── mobalytics-graphql-account.spec.ts        # 8 tests  @api @account
│   │   ├── mobalytics-graphql-auth.spec.ts           # 4 tests  @api @auth
│   │   ├── mobalytics-graphql-endpoint.spec.ts       # 9 tests  @api
│   │   └── mobalytics-graphql-signin-extended.spec.ts # 6 tests @api @auth
│   └── ui/                         # Browser tests (75 tests)
│       ├── mobalytics-cookie.spec.ts                 # 3 tests  @cookie
│       ├── mobalytics-home-extended.spec.ts          # 13 tests @regression
│       ├── mobalytics-home-navigation.spec.ts        # 8 tests  @navigation
│       ├── mobalytics-home-smoke.spec.ts             # 7 tests  @smoke @critical
│       ├── mobalytics-home.spec.ts                   # 28 tests @regression
│       ├── mobalytics-lol.spec.ts                    # 5 tests  @lol
│       ├── mobalytics-poe2-guides.spec.ts             # 6 tests  @poe2
│       └── mobalytics-responsive.spec.ts             # 5 tests  @responsive
├── .env                            # Local env vars (not committed)
├── .env.example                    # Template — copy to .env to get started
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json
└── package.json
```

---

## 🏗️ Architecture

### Page Object Model

Each page composes multiple **Component Objects** instead of owning all locators directly. This keeps pages thin and components reusable across pages.

```
HomePage
 ├── NavigationComponent   (nav bar, game links, social links)
 ├── HeroComponent         (hero banner, CTA buttons, heading)
 ├── GameCardsComponent    (game card grid)
 ├── FeaturesComponent     (feature highlights)
 ├── ImprovementLoopComponent
 ├── StatisticsComponent
 ├── CommunityComponent
 └── FooterComponent
```

### BasePage

Base class extended by all page objects:

| Method                          | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| `navigate()`                    | Go to the page's URL, wait for load, accept cookies          |
| `goto(path)`                    | Navigate to an arbitrary path (waits for `domcontentloaded`) |
| `waitForPageLoad()`             | Wait for `networkidle`                                       |
| `click(locator)`                | Click with automatic waiting                                 |
| `fill(locator, value)`          | Fill an input field                                          |
| `waitForElement(locator)`       | Wait for element visibility                                  |
| `verifyElementVisible(locator)` | Assert element is visible                                    |
| `assertNavigatesTo(pattern)`    | Assert current URL matches a regex                           |
| `takeScreenshot(name)`          | Capture a screenshot                                         |
| `acceptCookiesIfPresent()`      | Dismiss cookie banner if present                             |

All methods log at `debug` via the built-in `Logger` and throw typed errors on failure.

### Logger (`src/utils/logger.ts`)

```typescript
import { createLogger } from "../utils/logger";
const log = createLogger("MyContext");

log.debug("locator resolved", { selector });
log.info("navigated to page");
log.warn("element took longer than expected");
log.error("navigation failed", error);
```

Controlled by `LOG_LEVEL` env var: `debug` | `info` | `warn` | `error`. Defaults to `info`.

### Typed Errors (`src/errors/test-errors.ts`)

| Class                  | When to use                                       |
| ---------------------- | ------------------------------------------------- |
| `PageLoadError`        | Page failed to reach expected URL or state        |
| `ElementNotFoundError` | Locator timed out or element not visible          |
| `NavigationError`      | URL assertion / redirect failed                   |
| `AuthenticationError`  | Login via API or UI failed                        |
| `ApiError`             | HTTP / GraphQL request returned unexpected status |
| `TestDataError`        | Required env var or test data value is missing    |

### Centralised Test Data (`src/data/test-data.ts`)

```typescript
import { TestData } from "../data/test-data";

TestData.urls.home; // "/"
TestData.urls.poe2; // "/poe-2"
TestData.urls.poe2Guides; // "/poe-2/guides"
TestData.urlPatterns.poe2; // /.*\/poe-2.*/
TestData.urlPatterns.lol; // /.*\/lol.*/
TestData.ui.homepage.gamersCount;
TestData.api.graphqlEndpoint;
```

### Tag System (`src/data/tags.ts`)

```typescript
import { Tags } from '../data/tags';

test.describe('LoL Page', { tag: [Tags.ui, Tags.lol] }, () => {
  test('should load page', { tag: Tags.smoke }, async () => { ... });
});
```

| Tag                  | Value            | Purpose                                 |
| -------------------- | ---------------- | --------------------------------------- |
| `Tags.smoke`         | `@smoke`         | Fast gate — runs on every merge to main |
| `Tags.critical`      | `@critical`      | Must-pass; blocks pipeline              |
| `Tags.regression`    | `@regression`    | Full coverage — nightly / pre-release   |
| `Tags.ui`            | `@ui`            | All browser-driven tests                |
| `Tags.api`           | `@api`           | API / GraphQL tests                     |
| `Tags.navigation`    | `@navigation`    | Navigation flow tests                   |
| `Tags.visual`        | `@visual`        | Screenshot / visual diff                |
| `Tags.authenticated` | `@authenticated` | Requires logged-in session              |
| `Tags.poe2`          | `@poe2`          | Path of Exile 2 section                 |
| `Tags.lol`           | `@lol`           | League of Legends section               |
| `Tags.responsive`    | `@responsive`    | Mobile viewport tests                   |
| `Tags.cookie`        | `@cookie`        | Cookie consent banner                   |
| `Tags.auth`          | `@auth`          | Login / logout / session                |
| `Tags.hero`          | `@hero`          | Hero section                            |
| `Tags.footer`        | `@footer`        | Footer area                             |
| `Tags.statistics`    | `@statistics`    | Statistics section                      |

### Custom Fixtures (`src/fixtures/test.fixtures.ts`)

| Fixture                 | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `homePage`              | `HomePage` instance (unauthenticated)                                    |
| `poe2Page`              | `POE2Page` instance (unauthenticated)                                    |
| `lolPage`               | `LolPage` instance (unauthenticated)                                     |
| `navigation`            | Standalone `NavigationComponent`                                         |
| `hero`                  | Standalone `HeroComponent`                                               |
| `gameCards`             | Standalone `GameCardsComponent`                                          |
| `footer`                | Standalone `FooterComponent`                                             |
| `authenticatedPage`     | `Page` with valid session injected via API login                         |
| `authenticatedPoe2Page` | `POE2Page` with valid session injected via API login                     |
| `screenshotOnFailure`   | _(auto)_ Captures full-page screenshot on failure and attaches to Allure |

---

## 🧪 Test Coverage

**Total: 102 tests** across 12 spec files.

### UI Tests — 75 tests

| Spec file                            | Tests | Tags                                                     |
| ------------------------------------ | ----- | -------------------------------------------------------- |
| `mobalytics-home-smoke.spec.ts`      | 7     | `@smoke` `@critical` `@ui`                               |
| `mobalytics-home.spec.ts`            | 28    | `@regression` `@ui` `@navigation` `@hero` `@visual` …    |
| `mobalytics-home-navigation.spec.ts` | 8     | `@navigation` `@regression` `@ui`                        |
| `mobalytics-home-extended.spec.ts`   | 13    | `@regression` `@ui` `@footer` `@statistics` `@community` |
| `mobalytics-lol.spec.ts`             | 5     | `@lol` `@regression` `@ui`                               |
| `mobalytics-poe2-guides.spec.ts`     | 6     | `@poe2` `@ui` `@navigation` `@authenticated`             |
| `mobalytics-responsive.spec.ts`      | 5     | `@responsive` `@regression` `@ui`                        |
| `mobalytics-cookie.spec.ts`          | 3     | `@cookie` `@regression` `@ui`                            |

### API Tests — 27 tests

| Spec file                                    | Tests | Coverage                                          |
| -------------------------------------------- | ----- | ------------------------------------------------- |
| `mobalytics-graphql-endpoint.spec.ts`        | 9     | GraphQL HTTP layer, malformed queries, edge cases |
| `mobalytics-graphql-account.spec.ts`         | 8     | Account retrieval after login                     |
| `mobalytics-graphql-signin-extended.spec.ts` | 6     | Extended sign-in scenarios                        |
| `mobalytics-graphql-auth.spec.ts`            | 4     | Auth success / failure                            |

---

## 🏃 Running Tests

### Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment template
cp .env.example .env
# Edit .env with your values
```

### Main Commands

> **Recommended for local development:** use `npm run test:report` — it runs the full test suite and automatically generates and opens the interactive Allure report when finished.

```bash
# ✅ PRIMARY command — run all tests + generate & open Allure report
npm run test:report

# Run all tests without a report (headless, Chromium, parallel)
npm test

# Run in headed mode (watch the browser)
npm run test:headed

# Interactive debug mode
npm run test:debug

# Playwright UI Mode (visual test runner)
npm run test:ui
```

### Filter by Browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit

# All three browsers simultaneously
npm run test:cross-browser
# or
CROSS_BROWSER=true npm run test:report
```

### Filter by Tag

```bash
npm run test:smoke          # @smoke
npm run test:critical        # @critical
npm run test:regression      # @regression
npm run test:navigation      # @navigation
npm run test:poe2            # @poe2
npm run test:lol             # @lol
npm run test:responsive      # @responsive
npm run test:cookie          # @cookie
npm run test:visual          # @visual

# API tests only
npm run test:api
```

### Filter by Tag + Allure Report

Every tag filter has a matching `test:report:*` variant that runs the subset **and** opens the Allure report automatically:

```bash
npm run test:report:smoke       # @smoke  + Allure
npm run test:report:critical    # @critical + Allure
npm run test:report:regression  # @regression + Allure
npm run test:report:navigation  # @navigation + Allure
npm run test:report:poe2        # @poe2 + Allure
npm run test:report:lol         # @lol + Allure
npm run test:report:responsive  # @responsive + Allure
npm run test:report:cookie      # @cookie + Allure
npm run test:report:visual      # @visual + Allure
npm run test:report:api         # @api + Allure
npm run test:report:chromium    # Chromium project + Allure
```

---

### Advanced `--grep` Patterns

Playwright's `--grep` flag accepts a **regular expression**.

```bash
# OR — match any of these tags
npx playwright test --grep "@smoke|@critical"

# AND — tests that carry BOTH tags (lookahead)
npx playwright test --grep "(?=.*@poe2)(?=.*@smoke)"

# Exclude a tag
npx playwright test --grep-invert @visual

# Specific spec file
npx playwright test tests/ui/mobalytics-lol.spec.ts
```

> `--grep "@poe2&@smoke"` does **not** work — `&` has no meaning in regex.  
> Use `(?=.*@poe2)(?=.*@smoke)` for AND logic.

---

## 📊 Reports

```bash
# Playwright HTML report (built-in)
npx playwright show-report

# Generate + open Allure report
npm run report

# Step by step
npm run allure:generate
npm run allure:open

# Live Allure server (auto-refreshes)
npm run allure:serve
```

---

## ⚙️ Configuration

### `.env` Reference

| Variable                | Default                         | Description                                        |
| ----------------------- | ------------------------------- | -------------------------------------------------- |
| `BASE_URL`              | `https://mobalytics.gg`         | Application under test                             |
| `API_BASE_URL`          | `https://account.mobalytics.gg` | API base for auth tests                            |
| `HEADLESS`              | `true`                          | Set to `false` to watch the browser                |
| `BROWSER`               | `chromium`                      | Default browser                                    |
| `CROSS_BROWSER`         | _(unset)_                       | Set to `true` to add Firefox + WebKit              |
| `PARALLEL_WORKERS`      | 50% of CPU cores (min 4)        | Worker count                                       |
| `DEFAULT_TIMEOUT`       | `15000`                         | Action timeout (ms)                                |
| `NAVIGATION_TIMEOUT`    | `30000`                         | Page navigation timeout (ms)                       |
| `TEST_TIMEOUT`          | `30000`                         | Hard per-test timeout (ms)                         |
| `API_TIMEOUT`           | `10000`                         | API request timeout (ms)                           |
| `RETRY_COUNT`           | `1` local / `2` on CI           | Retry attempts on failure                          |
| `SCREENSHOT_ON_FAILURE` | `true`                          | Attach screenshot to report on failure             |
| `VIDEO_ON_FAILURE`      | `true`                          | Retain video on failure                            |
| `TRACE_ON_FAILURE`      | `true`                          | Retain Playwright trace on failure                 |
| `LOG_LEVEL`             | `info`                          | Logger verbosity: `debug`\|`info`\|`warn`\|`error` |
| `USER_EMAIL`            | —                               | Test account email (do not commit)                 |
| `USER_PASSWORD`         | —                               | Test account password (do not commit)              |
| `USER_USERNAME`         | —                               | Test account username                              |

### Browser Projects Strategy

By default only **Chromium** runs (fastest feedback loop). Firefox and WebKit are opt-in:

```bash
CROSS_BROWSER=true npx playwright test       # adds Firefox + WebKit
npx playwright test --project=firefox         # single alternate browser
```

The `mobile-chrome` project activates automatically for `@responsive` tests (Pixel 7 viewport), replacing the `page.setViewportSize()` calls that previously ran inside `beforeEach`.

### Timeout Strategy

```
actionTimeout:      15 000 ms  — individual element interaction
navigationTimeout:  30 000 ms  — page.goto() / URL change
TEST_TIMEOUT:       30 000 ms  — hard kill per test (prevents infinite hangs)
API_TIMEOUT:        10 000 ms  — Playwright request API calls
```

Override a single test when needed:

```typescript
test("extra slow test", async ({ page }) => {
  test.setTimeout(60_000);
  // ...
});
```

---

## 🔄 CI / CD

### GitHub Actions Pipeline

The workflow in `.github/workflows/playwright.yml` runs automatically on every merge (push) to `main`, and can also be triggered manually.

```
Merge / Push to main
  │
  ├─ Stage 1 — Smoke & Critical (Chromium)       ~3 min  ← fast feedback gate
  │            8 workers · fails fast
  │
  ├─ Stage 2 — Full Regression, 3 shards          ~6–8 min  ← runs after smoke passes
  │            (each shard: Chromium, 6 workers, fail-fast: false)
  │
  ├─ Stage 3 — Cross-browser Smoke                ~5 min  ← main branch / release PRs only
  │            (Firefox + WebKit in parallel, @smoke grep)
  │
  └─ Report  — Merge shard Allure results → generate HTML → upload artifact
               + deploy to GitHub Pages (main branch only)
```

**Total wall-clock time: ~9 minutes** for a full run on `main`.

---

### 🔐 Required GitHub Secrets & Variables

> **The pipeline will not work until these are configured in your repository.**

Go to: **GitHub repository → Settings → Secrets and variables → Actions**

#### Repository Secrets (🔒 encrypted, never visible in logs)

| Secret name     | Value                           | Description                                   |
| --------------- | ------------------------------- | --------------------------------------------- |
| `USER_EMAIL`    | your account email              | Used by `loginViaAPI` for authenticated tests |
| `USER_PASSWORD` | your account password           | Used by `loginViaAPI` for authenticated tests |
| `USER_USERNAME` | your account username           | Verified in account assertion tests           |
| `BASE_URL`      | `https://mobalytics.gg`         | Application under test                        |
| `API_BASE_URL`  | `https://account.mobalytics.gg` | GraphQL API base URL                          |

**Steps:**

1. Open your repository on GitHub
2. Go to **Settings → Secrets and variables → Actions → Secrets tab**
3. Click **"New repository secret"** for each entry above
4. Enter the name and value → **Add secret**

> ⚠️ `USER_EMAIL` and `USER_PASSWORD` are sensitive — never commit them to code.  
> The `.env` file is in `.gitignore` for the same reason.

---

### ▶️ Triggering the Pipeline

**Automatic** — happens on every merge (push) to `main`:

```bash
git push origin main       # triggers full pipeline
# or merge any PR into main via GitHub UI
```

**Manual** — via GitHub Actions UI:

1. Repository → **Actions** tab → **"Playwright Tests"** workflow
2. Click **"Run workflow"**
3. Optionally fill in:
   - **Tag filter** — e.g. `@smoke`, `@critical`, `@regression` (runs only matching tests)
   - **Number of workers** — default `8`
4. Click **"Run workflow"**

**Manual via GitHub CLI:**

```bash
# Run smoke tests only on a feature branch
gh workflow run playwright.yml \
  --ref feature/my-branch \
  --field grep="@smoke" \
  --field workers="4"
```

---

### 📊 Allure Report on GitHub Pages

After every successful run on `main`, the Allure report is automatically published to:

```
https://<your-github-username>.github.io/<repo-name>/allure/
```

> **One-time setup required:**  
> Repository → **Settings → Pages → Source → Deploy from a branch**  
> Branch: **`gh-pages`** / Folder: **`/ (root)`** → Save
>
> The `gh-pages` branch is created automatically on the first run.

The artifact ZIP is also available for download for 30 days under the **Actions → run → Artifacts** section.

---

### 🧾 CI Reporters

In CI mode (`CI=true`) the following reporters are active:

| Reporter            | Output file                 | Purpose                        |
| ------------------- | --------------------------- | ------------------------------ |
| `junit`             | `test-results/junit.xml`    | Machine-readable results       |
| `json`              | `test-results/results.json` | Structured result data         |
| `allure-playwright` | `allure-results/`           | Interactive Allure HTML report |
| `list`              | stdout                      | Real-time log streaming        |

---

### CI npm scripts

```bash
npm run test:ci               # smoke + critical only (Chromium, 8 workers)
npm run test:ci:full          # full suite (Chromium, 8 workers)
npm run test:ci:cross-browser # smoke on Firefox + WebKit
```

---

## 🔧 Troubleshooting

### Tests Timing Out

- Check live site latency; `NAVIGATION_TIMEOUT=45000` buys extra headroom without changing code
- Override per-test: `test.setTimeout(60_000)`
- Prefer `domcontentloaded` over `networkidle` for faster navigation waits

### Selectors Not Found

- Check for iframes: use `frameLocator` to scope into the frame
- Prefer role / text / `data-testid` selectors over CSS
- Add explicit `await expect(locator).toBeVisible()` before interacting
- Use `.first()` when multiple matching elements exist

### Flaky Tests

- Add `await expect(locator).toBeVisible()` before `.click()`
- Handle cookie/modal banners before asserting page state
- Use `page.waitForResponse()` to ensure API calls have completed
- Avoid `page.waitForTimeout()` — replace with condition-based waits

### Cookie Banner Interfering

The `mobalytics-cookie.spec.ts` tests use raw `page.goto()` intentionally. All other tests go through `homePage.navigate()` which calls `acceptCookiesIfPresent()` automatically.

---

## 🤝 Contributing

1. **Naming**: `mobalytics-<area>-<feature>.spec.ts`
2. **Architecture**: No direct selectors in test files — use Page Objects and Components
3. **Fixtures**: Add new page objects as fixtures in `test.fixtures.ts`
4. **Tags**: Tag every test and describe block — at minimum `@ui`/`@api` + severity
5. **Data**: Add new URLs and strings to `test-data.ts`, not inline in tests
6. **Steps**: Wrap logical actions in `test.step()` for readable Allure output
7. **Secrets**: Never hardcode credentials — use `.env` and `process.env`

---

## 📈 Current Status

| Metric             | Value                           |
| ------------------ | ------------------------------- |
| Total tests        | **102**                         |
| UI tests           | **75** across 8 spec files      |
| API tests          | **27** across 4 spec files      |
| Browsers (default) | **Chromium** (headless)         |
| Browsers (full)    | **Chromium + Firefox + WebKit** |
| Parallel workers   | **Auto (≥4, 50% of CPU cores)** |
| CI run time        | **~9 min** (sharded, Chromium)  |

Happy Testing! 🎉
