# 🎭 Playwright Test Automation Framework

Professional test automation framework for **Mobalytics.gg** using **Playwright**, **TypeScript**, **Page Object Model**, and **Allure Reports**.

## 🚀 Features

- ✅ **Playwright** - Modern, reliable end-to-end testing
- ✅ **TypeScript** - Type-safe test code with strict typing
- ✅ **Page Object Model (POM)** - Clean and maintainable architecture
- ✅ **Custom Fixtures** - Pre-configured page objects for each test
- ✅ **Allure Reports** - Beautiful, detailed test reports
- ✅ **Multi-browser Support** - Chromium, Firefox, WebKit
- ✅ **Parallel Execution** - Fast test runs with 4 workers
- ✅ **API Testing** - GraphQL authentication tests
- ✅ **Environment Configuration** - Flexible config management

## 📁 Project Structure

```
playwright-mcp-tests/
├── src/
│   ├── pages/                    # Page Object Models
│   │   ├── BasePage.ts          # Base page with common methods
│   │   ├── HomePage.ts          # Home page with 60+ locators
│   │   └── POE2Page.ts          # POE2 specific page
│   ├── fixtures/
│   │   └── test.fixtures.ts     # Custom Playwright fixtures
│   └── helpers/
│       └── loginHelper.ts       # API authentication helper
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
└── .env                         # Environment variables
```

## 🏗️ Page Object Model Architecture

### BasePage

Base class for all page objects with common functionality:

- `goto()` - Navigate to URL
- `click()` - Click with waiting
- `waitForElement()` - Wait for element visibility
- `verifyElementVisible()` - Assert element is visible
- `takeScreenshot()` - Capture screenshots
- `acceptCookiesIfPresent()` - Handle cookie banners

### HomePage

Main home page with 60+ locators and 30+ methods:

- Navigation links (LoL, TFT, POE2, etc.)
- Game cards and features
- Footer links and social media
- Community statistics
- Hero section elements

### POE2Page

POE2-specific page with navigation methods:

- `navigateFromHome()` - Navigate from home to POE2
- `navigateToGuides()` - Navigate to guides page
- `openGuideByTitle()` - Open specific guide
- `verifyGuideOpened()` - Verify guide page loaded

## 🧪 Test Coverage

### UI Tests (46 tests)

- **mobalytics-home-smoke.spec.ts** (7 tests)
  - Basic smoke tests for critical functionality
  - Page load, title, logo visibility
- **mobalytics-home.spec.ts** (36 tests)
  - Header Navigation (5 tests)
  - Hero Section (4 tests)
  - Game Logos (5 tests)
  - Features Section (4 tests)
  - Improvement Loop (2 tests)
  - Statistics (3 tests)
  - Community (1 test)
  - Footer Links (5 tests)
  - Visual Elements (7 tests)

- **mobalytics-poe2-guides.spec.ts** (3 tests)
  - Navigate from home to POE2
  - Navigate to guides page
  - Open specific guide

### API Tests (12 tests)

- **mobalytics-graphql-auth.spec.ts** (12 tests)
  - Successful login with email/password
  - Account retrieval after login
  - Failed login scenarios
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

# Run tests by tag/project
npx playwright test --project=chromium
npx playwright test tests/ui/
npx playwright test tests/api/
```

## 📊 Reports

```bash
# View Playwright HTML report
npx playwright show-report

# Generate and view Allure report
npm run report
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
