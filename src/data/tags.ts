/**
 * Centralised tag registry for Playwright tests.
 *
 * Using constants instead of raw strings prevents typos, enables
 * IDE autocomplete, and gives a single place to rename a tag.
 *
 * Usage in tests:
 * @example
 *   import { Tags } from '../data/tags';
 *
 *   test.describe('Header Navigation', { tag: Tags.navigation }, () => {
 *     test('should display logo', { tag: [Tags.smoke, Tags.critical] }, async ({ homePage }) => { ... });
 *   });
 *
 * Filtering on the command line:
 *   npx playwright test --grep @smoke
 *   npx playwright test --grep "@smoke|@api"
 *   npx playwright test --grep-invert @visual
 */

export const Tags = {
  /** Core user-facing paths — run on every build. */
  smoke: "@smoke",

  /** Full regression suite — run nightly or before releases. */
  regression: "@regression",

  /** Any test that drives the browser. */
  ui: "@ui",

  /** Tests that exercise API endpoints directly. */
  api: "@api",

  /** Header / footer / side-bar navigation flows. */
  navigation: "@navigation",

  /** Must-pass scenarios; failure blocks the pipeline. */
  critical: "@critical",

  /** Screenshot / pixel-diff tests. */
  visual: "@visual",

  /** Tests that require an authenticated session. */
  authenticated: "@authenticated",

  /** Tests scoped to the POE2 section. */
  poe2: "@poe2",

  /** Authentication-specific tests (login, logout, session). */
  auth: "@auth",

  /** Verifies specific page sections / components. */
  hero: "@hero",
  gameLogos: "@game-logos",
  features: "@features",
  improvementLoop: "@improvement-loop",
  statistics: "@statistics",
  community: "@community",
  footer: "@footer",
  social: "@social",
} as const;

export type Tag = (typeof Tags)[keyof typeof Tags];
