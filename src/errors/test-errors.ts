/**
 * Domain-specific error classes for the test framework.
 * Using typed errors (instead of plain Error) makes failures more informative
 * and allows callers to handle different error categories explicitly.
 */

/**
 * Thrown when a page fails to load within the allowed timeout.
 */
export class PageLoadError extends Error {
  constructor(url: string, timeoutMs: number) {
    super(`Page "${url}" did not finish loading within ${timeoutMs}ms`);
    this.name = "PageLoadError";
  }
}

/**
 * Thrown when an expected element cannot be found or is not in the required state.
 */
export class ElementNotFoundError extends Error {
  constructor(descriptor: string, timeoutMs?: number) {
    const suffix = timeoutMs !== undefined ? ` (waited ${timeoutMs}ms)` : "";
    super(`Element not found: "${descriptor}"${suffix}`);
    this.name = "ElementNotFoundError";
  }
}

/**
 * Thrown when a navigation action does not produce the expected URL.
 */
export class NavigationError extends Error {
  constructor(actualUrl: string, expectedPattern: string | RegExp) {
    super(
      `Navigation failed — actual URL: "${actualUrl}", expected to match: "${expectedPattern}"`,
    );
    this.name = "NavigationError";
  }
}

/**
 * Thrown when API or UI authentication fails.
 */
export class AuthenticationError extends Error {
  constructor(reason?: string) {
    super(reason ? `Authentication failed: ${reason}` : "Authentication failed");
    this.name = "AuthenticationError";
  }
}

/**
 * Thrown when an API call returns an unexpected status code or malformed payload.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly endpoint?: string,
  ) {
    const where = endpoint ? ` [${endpoint}]` : "";
    super(`API error (HTTP ${statusCode})${where}: ${message}`);
    this.name = "ApiError";
  }
}

/**
 * Thrown when required test data or environment variables are missing.
 */
export class TestDataError extends Error {
  constructor(field: string) {
    super(
      `Required test data is missing or empty: "${field}". ` +
        `Check your .env file or environment variables.`,
    );
    this.name = "TestDataError";
  }
}
