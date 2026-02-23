// @ts-check
const tseslint = require("typescript-eslint");
const playwright = require("eslint-plugin-playwright");
const prettierConfig = require("eslint-config-prettier");
const playwrightConfigs = /** @type {any} */ (playwright).configs;

module.exports = tseslint.config(
  // ── Global ignores ────────────────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "allure-results/**",
      "allure-report/**",
      "playwright-report/**",
      "test-results/**",
      // Config files are plain JS/CommonJS — skip TypeScript linting on them
      "eslint.config.js",
    ],
  },

  // ── Base TypeScript rules (all .ts files) ─────────────────────────────────
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // Enables type-aware rules (no-floating-promises, etc.)
        // projectService automatically finds the nearest tsconfig.json
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Disallow `any` — warn instead of error to allow gradual adoption
      "@typescript-eslint/no-explicit-any": "warn",

      // Catch unused variables; allow underscore-prefixed to opt out
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Floating promises are a common source of silent failures in async tests
      "@typescript-eslint/no-floating-promises": "error",

      // Enforce `import type` for type-only imports (reduces runtime cost)
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Allow require() calls — needed in config/test.config.ts (require("os"))
      "@typescript-eslint/no-require-imports": "warn",

      // Return types on exported functions improve discoverability
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // console.* is used by the custom logger — silence the built-in rule
      "no-console": "off",

      // Enforce === over ==
      eqeqeq: ["error", "always", { null: "ignore" }],

      // Disallow var, prefer const/let
      "no-var": "error",
      "prefer-const": "error",
    },
  },

  {
    ...playwrightConfigs["flat/recommended"],
    files: ["tests/**/*.ts", "src/**/*.spec.ts"],
    rules: {
      ...playwrightConfigs["flat/recommended"].rules,
      "playwright/no-wait-for-timeout": "warn",
      "playwright/prefer-web-first-assertions": "warn",
      "playwright/no-conditional-in-test": "warn",
      "playwright/require-top-level-describe": "error",
      "playwright/valid-test-tags": "off",
      "playwright/expect-expect": "off",
    },
  },
  prettierConfig,
);
