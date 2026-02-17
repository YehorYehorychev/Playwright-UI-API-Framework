/**
 * Lightweight structured logger for Playwright tests.
 * Supports log levels, colored output, and optional structured data.
 * Set LOG_LEVEL env var to control verbosity: debug | info | warn | error
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const ANSI: Record<LogLevel | "reset" | "dim", string> = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m", // green
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  reset: "\x1b[0m",
  dim: "\x1b[2m",
};

function resolveMinLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL || "info").toLowerCase() as LogLevel;
  return env in LEVEL_PRIORITY ? env : "info";
}

export class Logger {
  private readonly minLevel: LogLevel;

  constructor(private readonly context: string) {
    this.minLevel = resolveMinLevel();
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  private buildPrefix(level: LogLevel): string {
    const timestamp = new Date().toISOString();
    const color = ANSI[level];
    const reset = ANSI.reset;
    const dim = ANSI.dim;
    return `${dim}${timestamp}${reset} ${color}[${level.toUpperCase().padEnd(5)}]${reset} ${dim}[${this.context}]${reset}`;
  }

  private serialize(data: unknown): string {
    if (data === undefined) return "";
    try {
      return " " + JSON.stringify(data, null, 0);
    } catch {
      return " " + String(data);
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog("debug")) {
      console.debug(
        `${this.buildPrefix("debug")} ${message}${this.serialize(data)}`,
      );
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog("info")) {
      console.info(
        `${this.buildPrefix("info")} ${message}${this.serialize(data)}`,
      );
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog("warn")) {
      console.warn(
        `${this.buildPrefix("warn")} ${message}${this.serialize(data)}`,
      );
    }
  }

  error(message: string, err?: unknown): void {
    if (this.shouldLog("error")) {
      const detail =
        err instanceof Error
          ? `\n  ${ANSI.error}${err.name}: ${err.message}${ANSI.reset}${err.stack ? `\n${err.stack}` : ""}`
          : err !== undefined
            ? `\n  ${String(err)}`
            : "";
      console.error(`${this.buildPrefix("error")} ${message}${detail}`);
    }
  }

  /**
   * Log a step — useful to annotate important milestones inside a test action.
   */
  step(message: string): void {
    this.info(`→ ${message}`);
  }
}

/**
 * Create a named logger scoped to a particular class or module.
 *
 * @example
 * const log = createLogger('HomePage');
 * log.info('Navigating to home page');
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
