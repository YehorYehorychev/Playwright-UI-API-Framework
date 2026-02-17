import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";
import { createLogger } from "../utils/logger";
import { ApiError, AuthenticationError } from "../errors/test-errors";

dotenv.config();

const log = createLogger("AuthHelper");

interface AuthResponse {
  success: boolean;
  cookies?: string;
  accountData?: any;
}

/**
 * Perform API login and return authentication cookies
 */
export async function loginViaAPI(
  request: APIRequestContext,
): Promise<AuthResponse> {
  const apiUrl = `${process.env.API_BASE_URL}/api/graphql/v1/query`;
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  const signInMutation = `
    mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
      signIn(email: $email, password: $password, continueFrom: $continueFrom)
    }
  `;

  try {
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

    if (!response.ok()) {
      throw new ApiError(
        response.status(),
        "SignIn mutation returned a non-2xx response",
        apiUrl,
      );
    }

    const responseData = await response.json();

    if (responseData.data?.signIn === true) {
      const cookies = response.headers()["set-cookie"];
      log.info("API authentication successful");
      return { success: true, cookies };
    }

    const gqlErrors = responseData.errors
      ?.map((e: { message: string }) => e.message)
      .join("; ");
    log.warn("API authentication rejected by server", { errors: gqlErrors });
    return { success: false };
  } catch (error) {
    if (error instanceof ApiError || error instanceof AuthenticationError) {
      throw error;
    }
    log.error("API login request failed unexpectedly", error);
    return { success: false };
  }
}

/**
 * Get account information after authentication
 */
export async function getAccountInfo(request: APIRequestContext): Promise<any> {
  const apiUrl = `${process.env.API_BASE_URL}/api/graphql/v1/query`;

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

  try {
    const response = await request.post(apiUrl, {
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

    const responseData = await response.json();
    return responseData.data?.account;
  } catch (error) {
    log.error("Failed to retrieve account info", error);
    return null;
  }
}
