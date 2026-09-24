import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/**
 * The broad recommended sets, with individual rules turned off and a note
 * saying why — the same config as the author's other projects, less the rules
 * that guard things this app does not have (streaming, markdown).
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public'] },

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      unicorn.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { perfectionist },
    rules: {
      // Absolute imports only (`src/api/client`). Relative paths stop being
      // readable three directories in.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: 'Absolute imports only: use `src/...`.',
            },
          ],
        },
      ],

      '@typescript-eslint/no-floating-promises': 'error',

      // Type-only imports never pull a module into the bundle.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],

      // `console.error` stays for the ErrorBoundary.
      'no-console': ['error', { allow: ['error'] }],

      // ---- Ordering ----------------------------------------------------------
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'style'],
          internalPattern: ['^src/.*'],
          newlinesBetween: 'ignore',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-jsx-props': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-named-imports': ['error', { type: 'alphabetical' }],

      // ---- Accommodations, with reasons ----------------------------------

      // Allows effect cleanups like `() => clearTimeout(t)`.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],

      // `Round ${n}` is a number in a string, which is the normal case.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      // ---- unicorn: off, and why -----------------------------------------

      // `null` is what the backend sends; `undefined` does not survive JSON.
      'unicorn/no-null': 'off',

      // `props` and `ref` are React's vocabulary.
      'unicorn/name-replacements': 'off',
      'unicorn/prevent-abbreviations': 'off',

      // One-line `/** ... */` field notes are intended.
      'unicorn/single-line-block-comment-style': 'off',

      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-early-return': 'off',

      // Browser-only.
      'unicorn/prefer-global-this': 'off',

      // `getElementById` is not worse than `querySelector('#id')`.
      'unicorn/prefer-query-selector': 'off',

      // `reduce` is clear for a sum.
      'unicorn/no-array-reduce': 'off',

      // `response.json().catch(() => null)` is clearer than try/await.
      'unicorn/prefer-await': 'off',

      // Separate guards, each with its own reason.
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-combined-guards': 'off',

      // `[...map.values()]` reads as well as `Iterator#toArray`.
      'unicorn/prefer-iterator-to-array': 'off',

      // ---- unicorn: configured rather than disabled ----------------------

      // `VotePage.tsx`, `usePoll.ts`, `rounds.ts`.
      'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],

      // `caught`, so it never shadows a query's `error`.
      'unicorn/catch-error-name': ['error', { name: 'caught' }],
    },
  },

  {
    files: ['**/*.tsx'],
    extends: [jsxA11y.flatConfigs.strict],
    plugins: { react, 'react-refresh': reactRefresh },
    settings: { react: { version: '19.0' } },
    rules: {
      // Poll titles and labels are anyone's input.
      'react/no-danger': 'error',

      // One component per file. `only-export-components` checks exports;
      // this counts definitions.
      'react/no-multi-comp': ['error', { ignoreStateless: false }],

      // A helper another file needs belongs in a `.ts` module.
      'react-refresh/only-export-components': ['error', { allowConstantExport: false }],
    },
  },

  reactHooks.configs.flat.recommended,

  // A test that reaches for `rows[0]!` and finds nothing fails, which is the
  // point; guarding every lookup would only make the assertions harder to read.
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'unicorn/max-nested-calls': 'off',
    },
  },

  // Build files run in Node and are not part of the browser program.
  {
    files: ['vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
    rules: { 'no-restricted-imports': 'off' },
  },
  { files: ['**/*.js'], extends: [tseslint.configs.disableTypeChecked] },

  // Last, so Prettier alone owns formatting.
  prettier,
);
