import { test, expect } from "@playwright/test";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import { createLogger } from "../../src/utils/logger";
import { ApiError } from "../../src/errors/test-errors";

const log = createLogger("GraphQL-Auth");

// ─────────────────────────────────────────────────────────────────────────────
// Shared GraphQL helpers
// ─────────────────────────────────────────────────────────────────────────────

const apiUrl = `${process.env.API_BASE_URL}${TestData.api.graphqlEndpoint}`;

const SIGN_IN_MUTATION = `
  mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
    signIn(email: $email, password: $password, continueFrom: $continueFrom)
  }
`;

const ACCOUNT_QUERY = `
  query {
    account {
      uid
      email
      login
      level
      referrerCode
      referralStatus
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Mobalytics API Authentication", { tag: [Tags.api, Tags.auth] }, () => {
  test(
    "should successfully login via API with email and password",
    { tag: [Tags.smoke, Tags.critical] },
    async ({ request }) => {
      const { email, password } = TestData.credentials.validUser;

      const response = await test.step("Send SignIn mutation", async () => {
        return request.post(apiUrl, {
          data: {
            operationName: "SignIn",
            query: SIGN_IN_MUTATION,
            variables: { email, password, continueFrom: "" },
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      });

      await test.step("Verify HTTP response is successful", async () => {
        if (!response.ok()) {
          throw new ApiError(
            response.status(),
            "SignIn mutation returned non-2xx response",
            apiUrl,
          );
        }
        expect(response.status()).toBe(200);
      });

      await test.step("Verify GraphQL response structure and result", async () => {
        const responseData = await response.json();
        log.debug("SignIn response", responseData);

        expect(responseData).toHaveProperty("data");
        expect(responseData.data).toHaveProperty("signIn");
        expect(responseData.data.signIn).toBe(true);
      });

      await test.step("Verify authentication cookies were set", async () => {
        const setCookieHeader = response.headers()["set-cookie"];
        expect(setCookieHeader).toBeDefined();
        log.info("Authentication cookies received");
      });
    },
  );

  test(
    "should login and retrieve account information",
    { tag: [Tags.regression, Tags.authenticated] },
    async ({ request }) => {
      const { email, password, username } = TestData.credentials.validUser;

      await test.step("Login via SignIn mutation", async () => {
        const loginResponse = await request.post(apiUrl, {
          data: {
            operationName: "SignIn",
            query: SIGN_IN_MUTATION,
            variables: { email, password, continueFrom: "" },
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginData = await loginResponse.json();
        expect(loginData.data.signIn).toBe(true);
        log.info("Login step completed");
      });

      const account = await test.step("Retrieve account information", async () => {
        const accountResponse = await request.post(apiUrl, {
          data: {
            operationName: null,
            query: ACCOUNT_QUERY,
            variables: {},
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        expect(accountResponse.ok()).toBeTruthy();
        const accountData = await accountResponse.json();
        log.debug("Account response", accountData);
        return accountData.data.account;
      });

      await test.step("Verify account data matches expected values", async () => {
        expect(account).toHaveProperty("uid");
        expect(account.uid).toBeTruthy();
        expect(account.email).toBe(email);
        expect(account.login).toBe(username);
        expect(account).toHaveProperty("level");
        log.info("Account verified", {
          uid: account.uid,
          login: account.login,
        });
      });
    },
  );

  test(
    "should fail login with incorrect credentials",
    { tag: Tags.regression },
    async ({ request }) => {
      const { email } = TestData.credentials.validUser;
      const { password: wrongPassword } = TestData.credentials.invalidUser;

      const response = await test.step("Send SignIn with wrong password", async () => {
        return request.post(apiUrl, {
          data: {
            operationName: "SignIn",
            query: SIGN_IN_MUTATION,
            variables: { email, password: wrongPassword, continueFrom: "" },
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      });

      await test.step("Verify login was rejected", async () => {
        const responseData = await response.json();
        log.debug("Rejected login response", responseData);

        // GraphQL may return 200 with errors in body, or false in data
        expect(
          responseData.errors ||
            (responseData.data && responseData.data.signIn === false) ||
            response.status() >= 400,
        ).toBeTruthy();
      });
    },
  );

  test(
    "should fail login with empty credentials",
    { tag: Tags.regression },
    async ({ request }) => {
      const response = await test.step("Send SignIn with empty credentials", async () => {
        return request.post(apiUrl, {
          data: {
            operationName: "SignIn",
            query: SIGN_IN_MUTATION,
            variables: { email: "", password: "", continueFrom: "" },
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      });

      await test.step("Verify empty credentials are rejected", async () => {
        const responseData = await response.json();
        log.debug("Empty credentials response", responseData);

        expect(
          responseData.errors ||
            (responseData.data && responseData.data.signIn === false) ||
            response.status() >= 400,
        ).toBeTruthy();
      });
    },
  );
});
