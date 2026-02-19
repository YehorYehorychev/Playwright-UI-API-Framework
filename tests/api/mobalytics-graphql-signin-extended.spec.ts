/**
 * Extended SignIn mutation tests.
 *
 * Endpoint: POST /api/graphql/v1/query
 * Operation: mutation SignIn($email: String!, $password: String!, $continueFrom: String)
 *
 * Already covered in mobalytics-graphql-auth.spec.ts (DO NOT duplicate):
 *  ✓ Valid credentials → signIn === true + cookies set
 *  ✓ Valid email + wrong password → rejected
 *  ✓ Empty email + empty password → rejected
 *
 * This file adds:
 *  • Non-existent email
 *  • Invalid email format (not an e-mail string)
 *  • Missing email variable (required field omitted)
 *  • Missing password variable (required field omitted)
 *  • Very long email (edge case — beyond typical DB limits)
 *  • Special characters in password (edge case)
 *
 * Note: continueFrom with a non-empty value is consistently rejected by the API
 * (server returns data: null for any non-empty string), so it is not testable as
 * a success scenario. The existing smoke test already covers continueFrom: "".
 */

import { test, expect } from "@playwright/test";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import { createLogger } from "../../src/utils/logger";

const log = createLogger("GraphQL-SignIn-Extended");

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;

const SIGN_IN_MUTATION = `
  mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
    signIn(email: $email, password: $password, continueFrom: $continueFrom)
  }
`;

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Sends the SignIn mutation and returns the response and a safely-parsed body.
 * When the server returns non-JSON (e.g. an HTML WAF page), `body` is `null`.
 */
async function sendSignIn(
  request: import("@playwright/test").APIRequestContext,
  variables: Record<string, unknown>,
) {
  const response = await request.post(apiUrl, {
    data: { operationName: "SignIn", query: SIGN_IN_MUTATION, variables },
    headers: defaultHeaders,
  });
  const body = await response.json().catch(() => null);
  return { response, body };
}

/**
 * Returns true when the GraphQL body indicates a rejected or errored sign-in.
 * GraphQL can express failure as `data.signIn === false` OR via `errors`.
 * A null body (e.g. WAF returning HTML) is treated as rejected.
 */
function isRejected(
  body: { data?: { signIn?: unknown } | null; errors?: unknown[] } | null,
) {
  if (!body) return true;
  return (
    !!body.errors || body.data?.signIn === false || body.data?.signIn === null
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

test.describe(
  "GraphQL SignIn — Extended Scenarios",
  { tag: [Tags.api, Tags.auth] },
  () => {
    // ── Negative: non-existent email ─────────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query (SignIn)
     * Scenario   : Invalid request — email that does not exist in the system
     * Expected   : signIn === false OR errors array present; HTTP 200
     * Steps      :
     *   1. Send SignIn with an email that was never registered.
     *   2. Assert the HTTP response is 200 (GraphQL-over-HTTP).
     *   3. Assert the body indicates rejection (errors || signIn === false).
     */
    test(
      "should reject sign-in with a non-existent email address",
      { tag: Tags.regression },
      async ({ request }) => {
        const { body, response } =
          await test.step("Send SignIn with non-existent email", async () =>
            sendSignIn(request, {
              email: TestData.credentials.invalidUser.email,
              password: TestData.credentials.invalidUser.password,
              continueFrom: "",
            }));

        await test.step("Verify HTTP 200 is returned", async () => {
          expect(response.status()).toBe(200);
        });

        await test.step("Verify the server rejects the sign-in", async () => {
          log.debug("Non-existent email response", body);
          expect(isRejected(body)).toBeTruthy();
        });
      },
    );

    // ── Negative: invalid email format ───────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query (SignIn)
     * Scenario   : Invalid request — email value is not a valid email string
     * Expected   : signIn === false OR errors; HTTP 200 or 400
     * Steps      :
     *   1. Send SignIn with a plain string in the email field (e.g. "not-an-email").
     *   2. Assert the body or status indicates an error / rejection.
     */
    test(
      "should reject sign-in when email is not a valid email format",
      { tag: Tags.regression },
      async ({ request }) => {
        const { body, response } =
          await test.step("Send SignIn with malformed email", async () =>
            sendSignIn(request, {
              email: "not-an-email",
              password: "AnyPassword1!",
              continueFrom: "",
            }));

        await test.step("Verify the server rejects the request", async () => {
          log.debug("Malformed email response", body);
          expect(isRejected(body) || response.status() >= 400).toBeTruthy();
        });
      },
    );

    // ── Negative: missing required variable — email ──────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query (SignIn)
     * Scenario   : Invalid request — required variable `email` is omitted entirely
     * Expected   : GraphQL variable-coercion error; errors array present
     * Steps      :
     *   1. Send SignIn variables without the `email` key.
     *   2. Assert the response body contains a `errors` array (schema violation).
     */
    test(
      "should return a GraphQL error when required email variable is missing",
      { tag: Tags.regression },
      async ({ request }) => {
        const response =
          await test.step("Send SignIn without email variable", async () =>
            request.post(apiUrl, {
              data: {
                operationName: "SignIn",
                query: SIGN_IN_MUTATION,
                // `email` intentionally omitted
                variables: { password: "SomePassword1!", continueFrom: "" },
              },
              headers: defaultHeaders,
            }));

        await test.step("Verify GraphQL reports a validation error", async () => {
          const body = await response.json();
          log.debug("Missing email variable response", body);
          expect(body.errors).toBeDefined();
          expect(Array.isArray(body.errors)).toBeTruthy();
        });
      },
    );

    // ── Negative: missing required variable — password ───────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query (SignIn)
     * Scenario   : Invalid request — required variable `password` is omitted
     * Expected   : GraphQL variable-coercion error; errors array present
     * Steps      :
     *   1. Send SignIn variables without the `password` key.
     *   2. Assert the response body contains a `errors` array.
     */
    test(
      "should return a GraphQL error when required password variable is missing",
      { tag: Tags.regression },
      async ({ request }) => {
        const { email } = TestData.credentials.validUser;

        const response =
          await test.step("Send SignIn without password variable", async () =>
            request.post(apiUrl, {
              data: {
                operationName: "SignIn",
                query: SIGN_IN_MUTATION,
                // `password` intentionally omitted
                variables: { email, continueFrom: "" },
              },
              headers: defaultHeaders,
            }));

        await test.step("Verify GraphQL reports a validation error", async () => {
          const body = await response.json();
          log.debug("Missing password variable response", body);
          expect(body.errors).toBeDefined();
          expect(Array.isArray(body.errors)).toBeTruthy();
        });
      },
    );

    // ── Edge case: very long email ────────────────────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query (SignIn)
     * Scenario   : Edge case — email exceeds typical storage length (>254 chars)
     * Expected   : The server handles it gracefully — errors or signIn === false;
     *              must NOT return HTTP 500.
     * Steps      :
     *   1. Build an email string > 254 characters.
     *   2. Send the SignIn mutation.
     *   3. Assert no 5xx response.
     *   4. Assert the body indicates a rejection (not a crash).
     */
    test(
      "should handle an email that exceeds maximum length without server error",
      { tag: Tags.regression },
      async ({ request }) => {
        // RFC 5321 max email length = 254; we go well beyond that.
        const longEmail =
          "a".repeat(200) + "@" + "b".repeat(50) + ".example.com";

        const { body, response } =
          await test.step("Send SignIn with oversized email", async () =>
            sendSignIn(request, {
              email: longEmail,
              password: "AnyPassword1!",
              continueFrom: "",
            }));

        await test.step("Verify no server error (5xx) is returned", async () => {
          log.debug("Long email response", body);
          expect(response.status()).toBeLessThan(500);
        });

        await test.step("Verify the sign-in was rejected, not silently accepted", async () => {
          expect(isRejected(body) || response.status() >= 400).toBeTruthy();
        });
      },
    );

    // ── Edge case: special characters in password ────────────────────────────

    /**
     * Endpoint   : POST /api/graphql/v1/query (SignIn)
     * Scenario   : Edge case — password contains SQL injection-like and Unicode chars
     * Expected   : Server handles gracefully — rejection without 5xx.
     * Steps      :
     *   1. Send SignIn with a real (valid) email but a password containing special chars.
     *   2. Assert no 5xx response.
     *   3. Assert the body indicates rejection (wrong password, but no crash).
     */
    test(
      "should handle special characters in the password field without server error",
      { tag: Tags.regression },
      async ({ request }) => {
        const { email } = TestData.credentials.validUser;
        const specialPassword = `'; DROP TABLE users; -- 🔥 <script>alert(1)</script>`;

        const { body, response } =
          await test.step("Send SignIn with special-character password", async () =>
            sendSignIn(request, {
              email,
              password: specialPassword,
              continueFrom: "",
            }));

        await test.step("Verify no server error (5xx)", async () => {
          // body may be null if a WAF returned an HTML page instead of JSON
          log.debug("Special chars password response", {
            status: response.status(),
            hasBody: body !== null,
          });
          expect(response.status()).toBeLessThan(500);
        });

        await test.step("Verify the sign-in was rejected cleanly", async () => {
          // WAF blocking (non-JSON body) counts as a rejection
          const rejected =
            body === null || isRejected(body) || response.status() >= 400;
          expect(rejected).toBeTruthy();
        });
      },
    );
  },
);
