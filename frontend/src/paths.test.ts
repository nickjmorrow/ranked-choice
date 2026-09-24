import { matchPath } from 'react-router';
import { describe, expect, it } from 'vitest';
import { absoluteUrl, paths, PATTERNS } from 'src/paths';

describe('paths', () => {
  it('builds links that their own patterns match', () => {
    expect(matchPath(PATTERNS.poll, paths.poll('abc'))?.params.link).toBe('abc');
    expect(matchPath(PATTERNS.results, paths.results('abc'))?.params.link).toBe('abc');
    expect(matchPath(PATTERNS.share, paths.share('abc'))?.params.link).toBe('abc');
  });

  it('escapes a link rather than letting it change the route', () => {
    expect(paths.results('a/b')).toBe('/polls/a%2Fb/results');
  });

  it('makes a shareable absolute URL', () => {
    expect(absoluteUrl(paths.poll('abc'), 'https://example.org')).toBe(
      'https://example.org/polls/abc',
    );
  });
});
