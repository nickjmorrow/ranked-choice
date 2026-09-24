import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * The broad type-checked rule sets, with the few rules Nest's style fights
 * turned off and a note saying why. Prettier owns formatting.
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        // Not for decorated classes: Nest reads constructor parameter types at
        // runtime, so a DTO or service imported as a type is undefined there.
        { fixStyle: 'inline-type-imports', prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-floating-promises': 'error',

      // Nest modules are classes with no members by design.
      '@typescript-eslint/no-extraneous-class': 'off',

      // `counts[0]!` after a length check reads better than a re-check.
      '@typescript-eslint/no-non-null-assertion': 'off',

      // `${count}` in a message is the normal case.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    // Rewriting applied migrations to satisfy a newer linter would change
    // nothing they do and everything a diff of them shows.
    files: ['src/migrations/1594*.ts'],
    rules: { '@typescript-eslint/consistent-type-imports': 'off' },
  },
  {
    // Decorated classes need their injected and validated types as values.
    files: ['src/**/*.controller.ts', 'src/**/*.service.ts', 'src/**/*.module.ts'],
    rules: { '@typescript-eslint/consistent-type-imports': 'off' },
  },
  { files: ['**/*.mjs', '**/*.js'], extends: [tseslint.configs.disableTypeChecked] },
  prettier,
);
