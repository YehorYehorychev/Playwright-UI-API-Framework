#!/usr/bin/env bash
# =============================================================================
# test-and-report.sh
#
# Runs Playwright tests, then optionally generates and opens the Allure report.
#
# Usage:
#   ./scripts/test-and-report.sh [playwright-args...]
#
# ── Quick-run npm aliases (npm run <script>) ──────────────────────────────────
#
#   Full suite
#     npm run test:report                    – all tests
#     npm run test:report:chromium           – chromium only
#
#   By severity / type
#     npm run test:report:smoke              – @smoke  (fast gate)
#     npm run test:report:critical           – @critical
#     npm run test:report:regression         – @regression (full nightly)
#     npm run test:report:visual             – @visual (screenshot tests)
#
#   By domain / feature
#     npm run test:report:api                – @api  (GraphQL)
#     npm run test:report:ui                 – @ui   (all browser tests)
#     npm run test:report:navigation         – @navigation
#     npm run test:report:poe2               – @poe2
#     npm run test:report:lol                – @lol
#     npm run test:report:responsive         – @responsive (mobile viewport)
#     npm run test:report:cookie             – @cookie (consent banner)
#
# ── Direct invocation examples ────────────────────────────────────────────────
#   ./scripts/test-and-report.sh
#   ./scripts/test-and-report.sh --project=chromium
#   ./scripts/test-and-report.sh --grep "@smoke"
#   ./scripts/test-and-report.sh --grep "@regression"
#   ./scripts/test-and-report.sh --grep "@lol"
#   ./scripts/test-and-report.sh --grep "@responsive"
#   ./scripts/test-and-report.sh --grep "@cookie"
#   ./scripts/test-and-report.sh --grep "@navigation"
#   ./scripts/test-and-report.sh --grep "(?=.*@poe2)(?=.*@smoke)"
#   ./scripts/test-and-report.sh tests/api/ --project=chromium
# =============================================================================

set -uo pipefail

# ── colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}ℹ  $*${NC}"; }
success() { echo -e "${GREEN}✔  $*${NC}"; }
warn()    { echo -e "${YELLOW}⚠  $*${NC}"; }
error()   { echo -e "${RED}✖  $*${NC}"; }

# ── resolve project root (script lives in ./scripts/) ────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# ── configuration ─────────────────────────────────────────────────────────────
ALLURE_RESULTS_DIR="${ALLURE_RESULTS_DIR:-allure-results}"
ALLURE_REPORT_DIR="${ALLURE_REPORT_DIR:-allure-report}"

# ── run tests ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${YELLOW}▶  Running Playwright tests…${NC}"
[[ $# -gt 0 ]] && info "Flags: $*"
echo ""

# Capture exit code without aborting on failure
set +e
npx playwright test "$@"
TEST_EXIT_CODE=$?
set -e

# ── result banner ─────────────────────────────────────────────────────────────
echo ""
if [[ $TEST_EXIT_CODE -eq 0 ]]; then
  success "All tests passed."
else
  error "Some tests failed (exit code: $TEST_EXIT_CODE)."
  warn  "Results are still available — the Allure report will include failure details."
fi

# ── guard: nothing to report if no results were written ───────────────────────
if [[ ! -d "$ALLURE_RESULTS_DIR" || -z "$(ls -A "$ALLURE_RESULTS_DIR" 2>/dev/null)" ]]; then
  warn "No Allure results found in '$ALLURE_RESULTS_DIR'. Skipping report prompt."
  exit $TEST_EXIT_CODE
fi

# ── prompt ────────────────────────────────────────────────────────────────────
echo ""
read -r -p "$(echo -e "${YELLOW}${BOLD}Would you like to view the Allure report? (y/n): ${NC}")" REPLY
echo ""

if [[ "$REPLY" =~ ^[Yy]$ ]]; then
  # ── generate ────────────────────────────────────────────────────────────────
  info "Generating Allure report from '$ALLURE_RESULTS_DIR'…"

  if npx allure generate "$ALLURE_RESULTS_DIR" --clean -o "$ALLURE_REPORT_DIR" 2>/dev/null; then
    success "Report generated → $ALLURE_REPORT_DIR/"
    echo ""
    info "Opening report in browser…"
    npx allure open "$ALLURE_REPORT_DIR"
  else
    # ── fallback: allure serve ───────────────────────────────────────────────
    warn "allure generate failed. Falling back to 'allure serve'…"
    echo ""
    npx allure serve "$ALLURE_RESULTS_DIR"
  fi

else
  info "Report skipped. Run 'npm run report' at any time to generate and view it."
fi

# ── propagate test exit code so CI pipelines fail correctly ───────────────────
exit $TEST_EXIT_CODE
