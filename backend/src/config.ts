/**
 * The only file that reads the environment. Read when called rather than at
 * import, so a test can set the environment before building the app.
 */
export interface Config {
  databaseUrl: string;
  port: number;
  /** JSON lines in production, for a log collector; readable text in dev. */
  logJson: boolean;
  /**
   * This deployment is the public demo: the example poll is restored nightly
   * and visitors' polls expire. Also what the reset checks before deleting.
   */
  demoReset: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const databaseUrl = env.DATABASE_URL;
  if (databaseUrl === undefined || databaseUrl === '') {
    throw new Error('DATABASE_URL is required, e.g. postgresql://app:app@localhost:5435/app');
  }
  return {
    databaseUrl,
    port: Number(env.PORT ?? 8000),
    logJson: env.LOG_FORMAT === 'json',
    demoReset: env.DEMO_RESET === 'true',
  };
}
