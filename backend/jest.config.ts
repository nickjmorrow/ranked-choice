import type { Config } from 'jest';

// Unit tests: every *.spec.ts under src/, no database. test/jest-e2e.json is the
// end-to-end suite, which needs Postgres.
const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
};

export default config;
