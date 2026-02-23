/**
 * GraphQL endpoint — general health and edge-case tests.
 *
 * Endpoint: POST /api/graphql/v1/query
 *
 * These tests exercise the HTTP layer and GraphQL execution engine directly,
 * independent of any specific operation (SignIn, account, etc.).
 *
 * Scenarios covered:
 *  • Malformed GraphQL query syntax → GraphQL parse error
 *  • Requesting a non-existent top-level field → GraphQL field error
 *  • Completely empty request body → 400 or GraphQL error
 *  • Non-JSON (plain text) Content-Type body → 400 or error
 *  • GET request to the endpoint → 405 or appropriate error
 *  • Unknown / misspelled operation name in a valid mutation → graceful error
 *  • Query with deeply nested unknown fields → graceful error (no 5xx)
 *  • Request with extra unknown top-level JSON keys → still processes correctly
 */

import { test, expect } from "@playwright/test";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import { createLogger } from "../../src/utils/logger";

const log = createLogger("GraphQL-Endpoint");

// ─────────────────────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────────────────────

const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

test.describe(
  "GraphQL Endpoint — Health & Edge Cases",
  { tag: [Tags.api, Tags.regression] },
  () => {
    // ── Malformed GraphQL syntax ─────────────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Invalid request — syntactically broken GraphQL query string
     * Expected   : HTTP 200 with a body containing `errors` (GraphQL parse error);
     *              must NOT return HTTP 5xx.
     * Steps      :
     *   1. Send a POST with a query string that is not valid GraphQL syntax.
     *   2. Assert response is not 5xx.
     *   3. Assert the body contains an `errors` array.
     */
    test("should return a GraphQL parse error for syntactically malformed query", async ({
      request,
    }) => {
      const response = await test.step("Send malformed GraphQL query", async () =>
        request.post(apiUrl, {
          data: {
            operationName: null,
            query: "{ this is } not { valid graphql !!!",
            variables: {},
          },
          headers: jsonHeaders,
        }));

      await test.step("Verify no server error", async () => {
        expect(response.status()).toBeLessThan(500);
      });

      await test.step("Verify a parse error is reported in the body", async () => {
        const body = await response.json();
        log.debug("Malformed query response", body);
        expect(body.errors).toBeDefined();
        expect(Array.isArray(body.errors)).toBeTruthy();
        expect(body.errors.length).toBeGreaterThan(0);
      });
    });

    // ── Non-existent top-level field ─────────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Invalid request — querying a field that does not exist in the schema
     * Expected   : HTTP 200 with `errors` describing the unknown field; no 5xx.
     * Steps      :
     *   1. Send a syntactically valid query that references a field not in the schema.
     *   2. Assert response is not 5xx.
     *   3. Assert the body contains an `errors` array with at least one entry.
     */
    test("should return a GraphQL field error for a non-existent top-level field", async ({
      request,
    }) => {
      const response = await test.step("Send query with unknown field", async () =>
        request.post(apiUrl, {
          data: {
            operationName: null,
            query: "query { thisFieldDefinitelyDoesNotExist { id name } }",
            variables: {},
          },
          headers: jsonHeaders,
        }));

      await test.step("Verify no server error", async () => {
        expect(response.status()).toBeLessThan(500);
      });

      await test.step("Verify a schema error is reported", async () => {
        const body = await response.json();
        log.debug("Unknown field response", body);
        expect(body.errors).toBeDefined();
        expect(body.errors.length).toBeGreaterThan(0);
      });
    });

    // ── Empty request body ───────────────────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Invalid request — completely empty body string
     * Expected   : HTTP 400 or a GraphQL error; must NOT return 5xx or hang.
     * Steps      :
     *   1. Send a POST with an empty string body and application/json header.
     *   2. Assert status is 400 or the body contains an error.
     */
    test("should respond gracefully to an empty request body", async ({ request }) => {
      const response = await test.step("Send POST with empty body", async () =>
        request.post(apiUrl, {
          headers: jsonHeaders,
          // Playwright sends an empty body when `data` is omitted with these headers.
        }));

      await test.step("Verify a 4xx response or an error body is returned", async () => {
        log.debug("Empty body status", response.status());
        expect(response.status()).toBeLessThan(500);

        // Either the status itself is 4xx, or the body carries an error message.
        if (response.status() === 200) {
          const body = await response.json().catch(() => ({}));
          expect(body.errors ?? body.error ?? body.message).toBeDefined();
        }
      });
    });

    // ── Non-JSON body (plain text) ───────────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Invalid request — body is not valid JSON
     * Expected   : HTTP 400 or a parse error; must NOT return 5xx.
     * Steps      :
     *   1. Send a POST with "text/plain" content-type and a plain string body.
     *   2. Assert status < 500.
     */
    test("should respond gracefully when the request body is not valid JSON", async ({
      request,
    }) => {
      const response = await test.step("Send POST with plain text body", async () =>
        request.post(apiUrl, {
          headers: {
            "Content-Type": "text/plain",
            Accept: "application/json",
          },
          data: "this is not valid json at all",
        }));

      await test.step("Verify no server error is returned", async () => {
        log.debug("Plain-text body status", response.status());
        expect(response.status()).toBeLessThan(500);
      });
    });

    // ── HTTP GET request ─────────────────────────────────────────────────────

    /**
     * Endpoint   : GET /api/graphql/v1/query
     * Scenario   : Invalid request — using GET instead of POST
     * Expected   : HTTP 405 Method Not Allowed or 400; must NOT return 200 with data.
     * Steps      :
     *   1. Send a GET request to the GraphQL endpoint.
     *   2. Assert the status code is not 200.
     *   3. (Optionally) verify a method-not-allowed body or status 405.
     */
    test("should not accept GET requests on the GraphQL endpoint", async ({ request }) => {
      const response = await test.step("Send GET to GraphQL endpoint", async () =>
        request.get(apiUrl, { headers: jsonHeaders }));

      await test.step("Verify method is not accepted as a success", async () => {
        log.debug("GET response status", response.status());
        // 404, 405, or some 4xx; definitely not succesful 200 with data
        expect(response.status()).not.toBe(200);
        expect(response.status()).toBeLessThan(500);
      });
    });

    // ── Unknown / misspelled operationName ───────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Invalid request — operationName does not match any operation in query
     * Expected   : GraphQL returns an error about unknown operation; no 5xx.
     * Steps      :
     *   1. Send a query containing one named operation ("RealOp") but set
     *      operationName to a different string ("GhostOp").
     *   2. Assert response is not 5xx.
     *   3. Assert an error is returned.
     */
    test("should return a GraphQL error when operationName does not match the query", async ({
      request,
    }) => {
      const response = await test.step("Send mismatched operationName", async () =>
        request.post(apiUrl, {
          data: {
            operationName: "GhostOp",
            query: "query RealOp { __typename }",
            variables: {},
          },
          headers: jsonHeaders,
        }));

      await test.step("Verify no server error", async () => {
        expect(response.status()).toBeLessThan(500);
      });

      await test.step("Verify an operation error is returned", async () => {
        const body = await response.json();
        log.debug("Mismatched operationName response", body);
        expect(body.errors).toBeDefined();
      });
    });

    // ── Valid introspection field (__typename) ───────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Valid request — __typename meta-field introspection
     * Expected   : HTTP 200; data.__typename === "Query" (or similar root type name);
     *              no errors.
     * Steps      :
     *   1. Send query { __typename }.
     *   2. Assert HTTP 200.
     *   3. Assert data.__typename is a non-empty string.
     */
    test(
      "should respond to a __typename introspection query",
      { tag: Tags.smoke },
      async ({ request }) => {
        const response = await test.step("Send __typename query", async () =>
          request.post(apiUrl, {
            data: {
              operationName: null,
              query: "query { __typename }",
              variables: {},
            },
            headers: jsonHeaders,
          }));

        await test.step("Verify HTTP 200", async () => {
          expect(response.status()).toBe(200);
        });

        await test.step("Verify __typename is returned as a non-empty string", async () => {
          const body = await response.json();
          log.debug("__typename response", body);
          expect(body.errors).toBeUndefined();
          expect(body.data).toBeDefined();
          expect(typeof body.data.__typename).toBe("string");
          expect(body.data.__typename.length).toBeGreaterThan(0);
        });
      },
    );

    // ── Extra unknown top-level JSON keys ────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Edge case — request JSON contains extra unknown keys alongside
     *              the standard `query` / `variables` / `operationName` keys
     * Expected   : Server ignores unknown keys and processes the query normally;
     *              HTTP 200, no errors, __typename returned.
     * Steps      :
     *   1. Send a valid query with extra keys (e.g., "unknownKey", "clientInfo").
     *   2. Assert HTTP 200 and no errors in the body.
     */
    test("should ignore unknown top-level JSON keys and process the query normally", async ({
      request,
    }) => {
      const response = await test.step("Send query with extra JSON keys", async () =>
        request.post(apiUrl, {
          data: {
            operationName: null,
            query: "query { __typename }",
            variables: {},
            unknownKey: "some-random-value",
            clientInfo: { version: "9.9.9", platform: "test" },
          },
          headers: jsonHeaders,
        }));

      await test.step("Verify the endpoint processes the query normally", async () => {
        const body = await response.json();
        log.debug("Extra keys response", body);

        expect(response.status()).toBe(200);
        expect(body.errors).toBeUndefined();
        expect(body.data.__typename).toBeTruthy();
      });
    });

    // ── Deeply nested non-existent fields ────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query
     * Scenario   : Edge case — valid root field with deeply nested non-existent sub-fields
     * Expected   : GraphQL schema validation error; no 5xx crash.
     * Steps      :
     *   1. Send a query that starts with a real root field but continues to fake
     *      sub-fields several levels deep.
     *   2. Assert response status < 500.
     *   3. Assert `errors` is present in the body.
     */
    test("should handle a query with deeply nested non-existent fields without crashing", async ({
      request,
    }) => {
      const response = await test.step("Send query with deeply nested fake fields", async () =>
        request.post(apiUrl, {
          data: {
            operationName: null,
            query: `query {
                  account {
                    fakeField1 {
                      fakeField2 {
                        fakeField3 {
                          fakeField4
                        }
                      }
                    }
                  }
                }`,
            variables: {},
          },
          headers: jsonHeaders,
        }));

      await test.step("Verify no server error", async () => {
        expect(response.status()).toBeLessThan(500);
      });

      await test.step("Verify schema errors are reported", async () => {
        const body = await response.json();
        log.debug("Deeply nested fake fields response", body);
        expect(body.errors).toBeDefined();
        expect(body.errors.length).toBeGreaterThan(0);
      });
    });
  },
);
