import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The frontend conventions eslint cannot express: which directory may import
 * what, and whether a file is named after what it exports. See AGENTS.md > Checks
 * and `backend/tests/structure/test_conventions.py`.
 */

const SRC = new URL('.', import.meta.url).pathname;

function walk(directory: string): string[] {
  const out: string[] = [];
  const entries = readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const FILES = walk(SRC).filter((file) => !file.endsWith('.test.ts'));

const read = (file: string) => readFileSync(file, 'utf8');
const relative = (file: string) => file.slice(SRC.length);

// --------------------------------------------------------- semantic colors
//
// Colors are semantic tokens, so a theme is a block of variables. Fractions are
// written against `ink`, because `black/10` vanishes on a dark background.
// Nothing else in the toolchain reads inside class strings.

const TAILWIND_PALETTE = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'black',
  'white',
];

const COLOR_UTILITIES = [
  'bg',
  'text',
  'border',
  'ring',
  'outline',
  'divide',
  'fill',
  'stroke',
  'shadow',
  'accent',
  'caret',
  'decoration',
  'placeholder',
  'from',
  'via',
  'to',
];

const LITERAL_COLOR = new RegExp(
  String.raw`\b(?:${COLOR_UTILITIES.join('|')})-(?:${TAILWIND_PALETTE.join('|')})\b`,
  'g',
);

describe('colors are semantic tokens', () => {
  it('uses no literal Tailwind palette color anywhere in src/', () => {
    const offenders = FILES.flatMap((file) => {
      const hits = [...read(file).matchAll(LITERAL_COLOR)].map((match) => match[0]);
      return hits.map((hit) => `${relative(file)}: ${hit}`);
    });

    expect(
      offenders,
      'Use a token from the @theme block in src/index.css — `bg-surface`, `text-danger`, ' +
        '`text-on-accent`. For a fraction of a color use `ink` (`border-ink/10`), which inverts ' +
        'with the theme where `black` and `white` do not. See AGENTS.md > Frontend.',
    ).toEqual([]);
  });

  it('declares every token it needs in one place', () => {
    // If the @theme block ever empties, the rule above would pass vacuously.
    const css = readFileSync(path.join(SRC, 'index.css'), 'utf8');
    const tokens = [...css.matchAll(/--color-([\w-]+):/g)].map((match) => match[1]);
    expect(new Set(tokens)).toContain('ink');
    expect(new Set(tokens)).toContain('on-accent');
  });
});

// ------------------------------------------------------- the view model is pure
//
// The top-level `.ts` modules and `src/api/` import no React, so they stay
// testable without a renderer.

describe('the view model and the API boundary contain no React', () => {
  const pure = FILES.filter(
    (file) => relative(file).startsWith('api/') || /^[\w-]+\.ts$/.test(relative(file)),
  );

  it.each(pure.map((file) => relative(file)))('%s imports no React', (name) => {
    const source = read(path.join(SRC, name));
    expect(/from 'react(-dom)?'/.test(source)).toBe(false);
  });
});

// ---------------------------------------------------- one thing, named for it
//
// `no-multi-comp` counts definitions and `filename-case` checks case; this
// checks that the export's name is the file's name.

const DEFAULT_EXPORT = /export default (?:function |class |memo\(|forwardRef\()?(\w+)/;

describe('a file is named after what it exports', () => {
  const named = FILES.filter(
    (file) => relative(file).startsWith('components/') || relative(file).startsWith('hooks/'),
  );

  it.each(named.map((file) => relative(file)))('%s', (name) => {
    const expected = name.split('/', 2)[1]?.replace(/\.tsx?$/, '');
    const match = DEFAULT_EXPORT.exec(read(path.join(SRC, name)));

    expect(match, `${name} has no default export`).not.toBeNull();
    expect(match?.[1]).toBe(expected);
  });
});

// ------------------------------------------- the view model is tested in place
//
// Every top-level `.ts` module is a pure function of its input, so each has a
// test beside it.

describe('every top-level view-model module has a test beside it', () => {
  const modules = FILES.filter(
    (file) => /^[\w-]+\.ts$/.test(relative(file)) && relative(file) !== 'vite-env.d.ts',
  );

  it.each(modules.map((file) => relative(file)))('%s', (name) => {
    const spec = path.join(SRC, name.replace(/\.ts$/, '.test.ts'));
    expect(
      existsSync(spec),
      `${name} is a pure module at the top level of src/ with no ${name.replace(
        /\.ts$/,
        '.test.ts',
      )} beside it. It takes data and returns data, so the test needs no renderer — write it, ` +
        'or the file belongs in a hook or a component instead. See AGENTS.md > Layout.',
    ).toBe(true);
  });
});
