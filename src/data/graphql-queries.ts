/**
 * Centralised GraphQL operation strings and related TypeScript types.
 *
 * Keeping mutations/queries here guarantees a single source of truth:
 * if the schema changes, one edit fixes auth.helper.ts and every spec file
 * that uses these operations.
 *
 * Import pattern:
 *   import { SIGN_IN_MUTATION, ACCOUNT_QUERY } from '../data/graphql-queries';
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Shape of the `account` object returned by the API. */
export interface AccountData {
  uid: string;
  email: string;
  login: string;
  level: number | null;
  referrerCode: string | null;
  referralStatus: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Authenticates a user and sets session cookies.
 * Returns `true` on success, `false` (or `errors`) on failure.
 */
export const SIGN_IN_MUTATION = `
  mutation SignIn($email: String!, $password: String!, $continueFrom: String) {
    signIn(email: $email, password: $password, continueFrom: $continueFrom)
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all account fields for the currently authenticated user.
 * Requires a valid session cookie (obtained via SIGN_IN_MUTATION).
 */
export const ACCOUNT_QUERY = `
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
