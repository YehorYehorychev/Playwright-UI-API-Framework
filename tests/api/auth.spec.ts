import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test.describe("Mobalytics API Authentication", () => {
  const apiUrl = `${process.env.API_BASE_URL}/api/graphql/v1/query`;
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;
  const userUsername = process.env.USER_USERNAME;

  test("should successfully login via API with email and password", async ({
    request,
  }) => {
    // GraphQL mutation for authentication (based on API screenshots)
    const signInMutation = `
      mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
        signIn(email: $email, password: $password, continueFrom: $continueFrom)
      }
    `;

    // Send POST request with GraphQL mutation
    const response = await request.post(apiUrl, {
      data: {
        operationName: "SignIn",
        query: signInMutation,
        variables: {
          email: userEmail,
          password: userPassword,
          continueFrom: "",
        },
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Verify response status
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse response
    const responseData = await response.json();
    console.log("Response:", JSON.stringify(responseData, null, 2));

    // Verify response structure
    expect(responseData).toHaveProperty("data");
    expect(responseData.data).toHaveProperty("signIn");

    // signIn returns boolean (true on success)
    const signInResult = responseData.data.signIn;
    expect(signInResult).toBe(true);

    // Verify that we received cookies for authentication
    const setCookieHeader = response.headers()["set-cookie"];
    expect(setCookieHeader).toBeDefined();

    console.log("✅ Login successful!");
    console.log("SignIn result:", signInResult);
  });

  test("should login and retrieve account information", async ({ request }) => {
    // Step 1: Login
    const signInMutation = `
      mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
        signIn(email: $email, password: $password, continueFrom: $continueFrom)
      }
    `;

    const loginResponse = await request.post(apiUrl, {
      data: {
        operationName: "SignIn",
        query: signInMutation,
        variables: {
          email: userEmail,
          password: userPassword,
          continueFrom: "",
        },
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    expect(loginData.data.signIn).toBe(true);

    // Step 2: Get account information (cookies are automatically saved in request context)
    const accountQuery = `
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

    const accountResponse = await request.post(apiUrl, {
      data: {
        operationName: null,
        query: accountQuery,
        variables: {},
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    expect(accountResponse.ok()).toBeTruthy();
    const accountData = await accountResponse.json();
    console.log("Account Data:", JSON.stringify(accountData, null, 2));

    // Verify account data
    expect(accountData).toHaveProperty("data");
    expect(accountData.data).toHaveProperty("account");

    const account = accountData.data.account;
    expect(account.email).toBe(userEmail);
    expect(account.login).toBe(userUsername);
    expect(account).toHaveProperty("uid");
    expect(account.uid).toBeTruthy();
    expect(account).toHaveProperty("level");

    console.log("✅ Account info retrieved successfully!");
    console.log("UID:", account.uid);
    console.log("Email:", account.email);
    console.log("Username:", account.login);
    console.log("Level:", account.level);
  });

  test("should fail login with incorrect credentials", async ({ request }) => {
    const signInMutation = `
      mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
        signIn(email: $email, password: $password, continueFrom: $continueFrom)
      }
    `;

    const response = await request.post(apiUrl, {
      data: {
        operationName: "SignIn",
        query: signInMutation,
        variables: {
          email: userEmail,
          password: "wrong_password_123",
          continueFrom: "",
        },
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Verify that we received an error
    const responseData = await response.json();
    console.log("Error Response:", JSON.stringify(responseData, null, 2));

    // GraphQL can return 200 but with errors in body or false in data
    expect(
      responseData.errors ||
        (responseData.data && responseData.data.signIn === false) ||
        response.status() >= 400,
    ).toBeTruthy();
  });

  test("should fail login with empty credentials", async ({ request }) => {
    const signInMutation = `
      mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
        signIn(email: $email, password: $password, continueFrom: $continueFrom)
      }
    `;

    const response = await request.post(apiUrl, {
      data: {
        operationName: "SignIn",
        query: signInMutation,
        variables: {
          email: "",
          password: "",
          continueFrom: "",
        },
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const responseData = await response.json();

    // Verify presence of errors
    expect(
      responseData.errors ||
        (responseData.data && responseData.data.signIn === false) ||
        response.status() >= 400,
    ).toBeTruthy();
  });
});
