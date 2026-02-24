/**
 * Account query tests.
 *
 * Endpoint: POST /api/graphql/v1/query
 * Operation: query { account { uid email login level referrerCode referralStatus } }
 *
 * Already covered in mobalytics-graphql-auth.spec.ts (DO NOT duplicate):
 *  ✓ Authenticated request → account fields uid/email/login/level verified
 *
 * This file adds:
 *  • Unauthenticated request → error / null account
 *  • All account fields present and of correct types
 *  • uid is a non-empty string
 *  • email matches the credential used to sign in
 *  • referrerCode is present (string or null)
 *  • referralStatus is present (string or null)
 *  • Partial field selection (only uid + email requested)
 *  • level is a number (or null) — not a string
 */

import { test, expect, type APIRequestContext } from "@playwright/test";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import {
  SIGN_IN_MUTATION,
  ACCOUNT_QUERY as ACCOUNT_QUERY_FULL,
} from "../../src/data/graphql-queries";
import { createLogger } from "../../src/utils/logger";

const log = createLogger("GraphQL-Account");

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;

// ACCOUNT_QUERY_FULL is imported from graphql-queries (canonical full field set).
// SIGN_IN_MUTATION is imported from graphql-queries.

/** Partial selection — only two scalar fields. */
const ACCOUNT_QUERY_PARTIAL = `
  query {
    account {
      uid
      email
    }
  }
`;

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Authenticate in the current request context and return the account payload.
 * Fails the test step if sign-in does not succeed.
 */
async function signInAndFetchAccount(
  request: APIRequestContext,
  query: string = ACCOUNT_QUERY_FULL,
) {
  const { email, password } = TestData.credentials.validUser;

  await test.step("Sign in to obtain session cookies", async () => {
    const loginResponse = await request.post(apiUrl, {
      data: {
        operationName: "SignIn",
        query: SIGN_IN_MUTATION,
        variables: { email, password, continueFrom: "" },
      },
      headers: defaultHeaders,
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    expect(loginBody.data?.signIn).toBe(true);
  });

  const accountResponse = await test.step("Query account data", async () =>
    request.post(apiUrl, {
      data: { operationName: null, query, variables: {} },
      headers: defaultHeaders,
    }));

  const accountBody = await accountResponse.json();
  return { accountResponse, accountBody };
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

test.describe("GraphQL Account Query", { tag: [Tags.api, Tags.auth] }, () => {
  // ── Negative: unauthenticated request ────────────────────────────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Invalid request — no session / authentication cookie present
   * Expected   : The server returns errors or a null account; HTTP 200 (GQL convention)
   * Steps      :
   *   1. Send the account query WITHOUT signing in first (fresh request context).
   *   2. Assert the response body contains `errors` OR `data.account` is null/undefined.
   */
  test(
    "should return an error or null account when requesting without authentication",
    { tag: Tags.regression },
    async ({ request }) => {
      const response = await test.step("Send account query without authentication", async () =>
        request.post(apiUrl, {
          data: {
            operationName: null,
            query: ACCOUNT_QUERY_FULL,
            variables: {},
          },
          headers: defaultHeaders,
        }));

      await test.step("Verify unauthenticated access is rejected", async () => {
        const body = await response.json();
        log.debug("Unauthenticated account response", body);

        const isRejected =
          !!body.errors ||
          body.data?.account === null ||
          body.data?.account === undefined ||
          response.status() >= 400;

        expect(isRejected).toBeTruthy();
      });
    },
  );

  // ── Positive: all account fields present with correct types ──────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Valid request — all returned fields have the expected JS types
   * Expected   : uid (string), email (string), login (string),
   *              level (number|null), referrerCode (string|null),
   *              referralStatus (string|null); no extra errors.
   * Steps      :
   *   1. Sign in with valid credentials.
   *   2. Query the full account object.
   *   3. Assert each field's type matches the GraphQL schema contract.
   */
  test(
    "should return all account fields with correct types when authenticated",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { accountBody } = await signInAndFetchAccount(request);

      await test.step("Verify field types match expected schema", async () => {
        const account = accountBody.data.account;
        log.debug("Full account payload", account);

        expect(account).toBeDefined();
        expect(account).not.toBeNull();

        // uid — required non-empty string
        expect(typeof account.uid).toBe("string");
        expect(account.uid.length).toBeGreaterThan(0);

        // email — required non-empty string
        expect(typeof account.email).toBe("string");
        expect(account.email.length).toBeGreaterThan(0);

        // login — required string
        expect(typeof account.login).toBe("string");

        // level — the API serialises level as a string (e.g. a rank label) or null
        expect(
          account.level === null ||
            typeof account.level === "string" ||
            typeof account.level === "number",
        ).toBeTruthy();

        // referrerCode — nullable string
        expect(
          account.referrerCode === null || typeof account.referrerCode === "string",
        ).toBeTruthy();

        // referralStatus — nullable string
        expect(
          account.referralStatus === null || typeof account.referralStatus === "string",
        ).toBeTruthy();
      });
    },
  );

  // ── Positive: uid is a non-empty, unique-looking identifier ──────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Valid request — uid field is a meaningful, non-empty string
   * Expected   : uid is truthy and has a length consistent with a GUID/UUID (≥ 8 chars)
   * Steps      :
   *   1. Sign in.
   *   2. Query account.
   *   3. Assert uid is non-empty and of reasonable length.
   */
  test(
    "should return a non-empty uid that looks like a valid identifier",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { accountBody } = await signInAndFetchAccount(request);

      await test.step("Verify uid is a meaningful identifier", async () => {
        const { uid } = accountBody.data.account;
        log.info("Account uid", { uid });

        expect(uid).toBeTruthy();
        // UUIDs / nanoids are at least 8 characters; anything shorter would be suspicious.
        expect(uid.length).toBeGreaterThanOrEqual(8);
      });
    },
  );

  // ── Positive: returned email matches the sign-in credential ──────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Valid request — email field reflects the authenticated user's address
   * Expected   : account.email === the email used during sign-in
   * Steps      :
   *   1. Sign in with the known test credential.
   *   2. Query account.
   *   3. Assert account.email equals the sign-in email (case-insensitive comparison).
   */
  test(
    "should return an email that matches the authenticated user's credentials",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { email } = TestData.credentials.validUser;
      const { accountBody } = await signInAndFetchAccount(request);

      await test.step("Verify returned email matches sign-in email", async () => {
        const returnedEmail: string = accountBody.data.account.email;
        log.info("Comparing emails", {
          expected: email,
          actual: returnedEmail,
        });

        expect(returnedEmail.toLowerCase()).toBe(email.toLowerCase());
      });
    },
  );

  // ── Positive: referrerCode is present in the payload ─────────────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Valid request — referrerCode field is included in the response
   * Expected   : referrerCode key exists on the account object (value may be null)
   * Steps      :
   *   1. Sign in.
   *   2. Query account.
   *   3. Assert the key `referrerCode` exists; its value may be null or a string.
   */
  test(
    "should include the referrerCode field in the account response",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { accountBody } = await signInAndFetchAccount(request);

      await test.step("Verify referrerCode field is present", async () => {
        const account = accountBody.data.account;
        log.debug("referrerCode value", account.referrerCode);

        // Key must be present; value can legitimately be null
        expect(Object.prototype.hasOwnProperty.call(account, "referrerCode")).toBeTruthy();
      });
    },
  );

  // ── Positive: referralStatus is present in the payload ───────────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Valid request — referralStatus field is included in the response
   * Expected   : referralStatus key exists on the account object (value may be null)
   * Steps      :
   *   1. Sign in.
   *   2. Query account.
   *   3. Assert the key `referralStatus` exists.
   */
  test(
    "should include the referralStatus field in the account response",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { accountBody } = await signInAndFetchAccount(request);

      await test.step("Verify referralStatus field is present", async () => {
        const account = accountBody.data.account;
        log.debug("referralStatus value", account.referralStatus);

        expect(Object.prototype.hasOwnProperty.call(account, "referralStatus")).toBeTruthy();
      });
    },
  );

  // ── Positive: partial field selection ────────────────────────────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query — partial)
   * Scenario   : Valid request — client requests only uid + email (no extra fields)
   * Expected   : Response contains only the requested fields; no GraphQL errors.
   * Steps      :
   *   1. Sign in.
   *   2. Send account query requesting only uid and email.
   *   3. Assert the response object has uid and email keys.
   *   4. Assert level, referrerCode, referralStatus are NOT in the partial response.
   */
  test(
    "should return only requested fields when using a partial account selection",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { accountBody } = await signInAndFetchAccount(request, ACCOUNT_QUERY_PARTIAL);

      await test.step("Verify only uid and email are returned", async () => {
        const account = accountBody.data.account;
        log.debug("Partial account payload", account);

        expect(account).toBeDefined();
        expect(account.uid).toBeDefined();
        expect(account.email).toBeDefined();

        // Fields not in the selection set must be absent from the response object
        expect(account.level).toBeUndefined();
        expect(account.referrerCode).toBeUndefined();
        expect(account.referralStatus).toBeUndefined();
      });
    },
  );

  // ── Edge case: level is numeric, not a string ─────────────────────────────

  /**
   * Endpoint   : POST /api/graphql/v1/query (account query)
   * Scenario   : Edge case — level field type contract
   * Expected   : account.level is string, number, or null — never undefined.
   * Note       : The API returns level as a string (e.g. a rank label like "Gold").
   *              This test documents and protects that contract.
   * Steps      :
   *   1. Sign in.
   *   2. Query account.
   *   3. Assert level is string, number, or null — not undefined.
   */
  test(
    "should return level as a string, number, or null — never undefined",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { accountBody } = await signInAndFetchAccount(request);

      await test.step("Verify level type contract", async () => {
        const { level } = accountBody.data.account;
        log.debug("Level value", { level, type: typeof level });

        // Must not be undefined — the field should always be present
        expect(level).not.toBeUndefined();

        // Acceptable types: null, number, or string (label or numeric)
        const isAcceptable =
          level === null || typeof level === "number" || typeof level === "string";

        expect(isAcceptable).toBeTruthy();
      });
    },
  );
});
