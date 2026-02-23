import { TestDataError } from "../errors/test-errors";

/**
 * Asserts that an env variable is present and non-empty.
 * Throws TestDataError at runtime if the value is missing.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new TestDataError(key);
  return value;
}

/**
 * Central registry of all test data used across the suite.
 *
 * - Credential fields use `requireEnv` so a missing env variable
 *   produces a clear, actionable error instead of a cryptic assertion failure.
 * - Non-secret constants (URL patterns, UI strings) are defined inline.
 */
export const TestData = {
  /**
   * User credentials — sourced exclusively from environment variables.
   * Never hard-code real values here.
   */
  credentials: {
    /** Returns credentials for the standard test account. Throws if env vars are absent. */
    get validUser() {
      return {
        email: requireEnv("USER_EMAIL"),
        password: requireEnv("USER_PASSWORD"),
        username: process.env.USER_USERNAME ?? "",
      };
    },
    /** A well-formed but intentionally invalid credential set for negative tests. */
    invalidUser: {
      email: "invalid-user@example.com",
      password: "WrongPassword123!",
    },
  },

  /**
   * URL path segments appended to `baseURL`.
   * Keep in sync with the routes in mobalytics.gg.
   */
  urls: {
    home: "/",
    lol: "/lol",
    tft: "/tft",
    poe2: "/poe-2",
    poe2Guides: "/poe-2/guides",
    diablo4: "/diablo-4",
    borderlands4: "/borderlands-4",
    nightreign: "/elden-ring-nightreign",
    deadlock: "/deadlock",
    mhWilds: "/mhw",
    valorant: "/valorant",
    blog: "/blog",
    terms: "/terms",
    privacy: "/privacy",
    cookie: "/cookie",
    esports: "/esports/home",
    lolLadderResearch: "/lol-ladder-research",
  },

  /**
   * Regex patterns used in `expect(page).toHaveURL()` assertions.
   */
  urlPatterns: {
    lol: /.*lol.*/,
    tft: /.*tft.*/,
    poe2: /.*\/poe-2.*/,
    poe2Guides: /.*\/poe-2\/guides.*/,
    diablo4: /.*diablo-4.*/,
    borderlands4: /.*borderlands-4.*/,
    nightreign: /.*elden-ring-nightreign.*/,
    deadlock: /.*deadlock.*/,
    mhWilds: /.*\/mhw.*/,
    valorant: /.*valorant.*/,
    blog: /.*blog.*/,
    terms: /.*\/terms.*/,
    privacy: /.*\/privacy.*/,
    cookie: /.*\/cookie.*/,
    esports: /.*\/esports.*/,
    lolLadderResearch: /.*lol-ladder-research.*/,
    downloadOverwolf: /.*download\.overwolf\.com.*/,
  },

  /**
   * API endpoint paths — combined with `apiBaseURL` from config.
   */
  api: {
    graphqlEndpoint: "/api/graphql/v1/query",
  },

  /**
   * Expected text / label constants visible in the UI.
   * Centralising them here means a single copy-change fixes every assertion.
   */
  ui: {
    navigation: {
      /** All nav-bar link labels that must be visible on the home page. */
      expectedLinks: [
        "LoL",
        "TFT",
        "PoE2",
        "Diablo 4",
        "Borderlands 4",
        "Nightreign",
        "Deadlock",
        "MH Wilds",
      ] as const,
    },
    homepage: {
      gamersCount: "10,000,000+",
      countriesCount: "182",
      statisticPercent: "27",
      lcsPartnershipText: "The official data partner of the LCS Amateur Scene",
      downloadButtonText: "Download desktop app for Windows",
      videoButtonName: "Video Play",
      testimonialAuthors: ["Poder", "Hikamatsu", "TF Blade", "Midbeast"] as const,
      trustedPartnerLogos: ["T1 Team", "Omen", "Team Liquid", "Tobii"] as const,
    },
    footer: {
      discordLabel: "Discord",
      termsLabel: "Terms of Service",
      privacyLabel: "Privacy Policy",
      cookiePolicyLabel: "Cookie Policy",
      copyrightText: "Gamers Net, Inc.",
      mobalyticsPlusLabel: "Mobalytics Plus",
    },
    cookie: {
      bannerText: "This website uses cookies",
      acceptLabel: "Accept",
      readMoreLabel: "Read More",
    },
    lol: {
      pageTitle: /League of Legends.*Mobalytics/i,
      subNavLinks: ["Tier List", "Champions", "GPI"] as const,
    },
    poe2: {
      pageTitle: /Path of Exile 2.*Mobalytics/i,
      subNavLinks: ["Builds", "Guides"] as const,
    },
  },

  /**
   * Convenience timeout constants (ms) for explicit waits inside helpers.
   * Note: keep these in sync with playwright.config timeouts where possible.
   */
  timeouts: {
    short: 5_000,
    medium: 15_000,
    long: 30_000,
  },
} as const;
