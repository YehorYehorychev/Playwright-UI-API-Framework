import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

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

    const responseData = await response.json();

    if (responseData.data?.signIn === true) {
      const cookies = response.headers()["set-cookie"];
      return {
        success: true,
        cookies,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("API login failed:", error);
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
    console.error("Failed to get account info:", error);
    return null;
  }
}
