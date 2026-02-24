/**
 * ─────────────────────────────────────────────────────────────────────────────
 * API TEST TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Use this file as a starting point when writing API / request-level tests.
 *
 * Key concepts:
 *  • API tests import `test` and `expect` directly from `@playwright/test`
 *    (no browser is launched, so the custom fixture file is not required here
 *    unless you also need authenticated-page fixtures).
 *  • Use Playwright's built-in `request` fixture — it provides an
 *    `APIRequestContext` scoped to the test, with automatic cleanup.
 *  • Use `TestData` for all URLs, credentials, and payload constants so values
 *    are maintained in one place.
 *  • Always assert BOTH the HTTP status code AND the response body shape.
 *  • Wrap each logical step in `test.step()` so Allure / HTML reports show
 *    exactly which step failed.
 *
 * Filtering by tag:
 *   npx playwright test --grep @api
 *   npx playwright test --grep "@api&@regression"
 *
 * Docs & References:
 *  • APIRequestContext       : https://playwright.dev/docs/api/class-apirequestcontext
 *  • API Testing guide       : https://playwright.dev/docs/api-testing
 *  • expect assertions       : https://playwright.dev/docs/test-assertions
 *  • test.step()             : https://playwright.dev/docs/api/class-test#test-step
 *  • REST / GraphQL patterns : https://playwright.dev/docs/api-testing#using-request-context
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Steps to adapt this template:
 *  1. Rename this file, e.g. `mobalytics-graphql-user.spec.ts`.
 *  2. Replace every `[REPLACE_*]` placeholder with real values.
 *  3. Add / remove test cases as required.
 *  4. Delete this banner comment block once you're done.
 */

// ── Imports ───────────────────────────────────────────────────────────────────
// API tests use the base `test` from @playwright/test — no browser fixtures needed.
import { test, expect } from "@playwright/test";
import { Tags } from "../../src/data/tags";
import { TestData as _TestData } from "../../src/data/test-data"; // [REPLACE] remove underscore and use TestData once your tests reference it
import { createLogger } from "../../src/utils/logger";

// ─────────────────────────────────────────────────────────────────────────────
// Shared constants
// ─────────────────────────────────────────────────────────────────────────────

/** Logger namespaced to this suite for structured output in the Allure report. */
const log = createLogger("[REPLACE_SUITE_LOGGER_NAME]"); // e.g. "GraphQL-User"

/**
 * Fully-qualified API URL.
 * Build from `process.env.API_BASE_URL` + the path from `TestData.api`.
 * Never hard-code a host — it must be configurable per environment.
 *
 * Example:
 *   const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;
 */
const apiUrl = `${process.env.API_BASE_URL}/[REPLACE_API_PATH]`; // e.g. /api/graphql/v1/query

/** Default headers for JSON API requests. */
const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────────────────────

test.describe(
  "[REPLACE_SUITE_NAME]", // e.g. "GraphQL User — CRUD Operations"
  { tag: [Tags.api, Tags.regression] },
  () => {
    // ── Happy path ──────────────────────────────────────────────────────────

    /**
     * Test: Successful request — verify 2xx status and expected response shape.
     *
     * Use `request` from the fixture destructuring. It is scoped to this test
     * and is automatically disposed after the test finishes.
     */
    test(
      "should return [REPLACE_EXPECTED_RESPONSE] for a valid request",
      { tag: Tags.critical },
      async ({ request }) => {
        const response = await test.step("Send valid [REPLACE_METHOD] request", async () =>
          request.post(apiUrl, {
            // [REPLACE] with request.get / .put / .delete as needed
            data: {
              // [REPLACE] with the actual request payload:
              // operationName: "SomeOperation",
              // query: `query SomeOperation { ... }`,
              // variables: { id: "123" },
            },
            headers: jsonHeaders,
          }));

        await test.step("Verify HTTP 200 OK", async () => {
          expect(response.ok()).toBeTruthy();
          expect(response.status()).toBe(200); // [REPLACE] if a different status is expected
        });

        await test.step("Verify response body shape", async () => {
          const body = await response.json();
          log.debug("Response body", body);

          // Assert the top-level structure:
          expect(body).toBeDefined();
          // [REPLACE] with real property assertions, e.g.:
          // expect(body.data).toBeDefined();
          // expect(body.data.user).toHaveProperty("id");
          // expect(body.errors).toBeUndefined();
        });
      },
    );

    // ── Error / edge cases ──────────────────────────────────────────────────

    /**
     * Test: Missing required field — verify the API returns a proper error.
     *
     * Document each edge-case test with a mini spec block explaining:
     *  • Endpoint
     *  • Scenario
     *  • Expected outcome
     *  • Test steps
     */
    test("should return an error when [REPLACE_MISSING_FIELD] is absent", async ({ request }) => {
      /**
       * Endpoint  : [REPLACE_ENDPOINT]
       * Scenario  : [REPLACE_SCENARIO_DESCRIPTION]
       * Expected  : [REPLACE_EXPECTED_STATUS] with an error message in the body
       * Steps     :
       *   1. Send a request with [REPLACE_MISSING_FIELD] omitted.
       *   2. Assert the HTTP status is NOT 5xx (server must handle this gracefully).
       *   3. Assert the body contains an error indicator.
       */
      const response = await test.step("Send request with missing field", async () =>
        request.post(apiUrl, {
          data: {
            // [REPLACE] with a payload that intentionally omits a required field:
          },
          headers: jsonHeaders,
        }));

      await test.step("Verify no server error (not 5xx)", async () => {
        expect(response.status()).toBeLessThan(500);
      });

      await test.step("Verify error is reported in response body", async () => {
        const body = await response.json();
        log.debug("Error response body", body);
        // [REPLACE] with the actual error field your API uses, e.g.:
        // expect(body.errors).toBeDefined();
        // expect(body.message).toMatch(/required/i);
      });
    });

    /**
     * Test: Unauthorised request — verify 401 / 403 when credentials are absent.
     */
    test("should return 401 / 403 for an unauthenticated request", async ({ request }) => {
      const response = await test.step("Send request without auth token", async () =>
        request.post(apiUrl, {
          data: {
            // [REPLACE] with the minimum payload needed to reach the auth check:
          },
          headers: {
            // Deliberately omit the Authorization header:
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }));

      await test.step("Verify unauthorised status", async () => {
        expect([401, 403]).toContain(response.status());
      });
    });

    // ── Add more test cases above this line ───────────────────────────────────
  },
);
