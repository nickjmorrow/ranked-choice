import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';

/** Shared with the inline script in index.html. Both read it; only this writes. */
const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    // Throws when site data is blocked; follow the OS.
    return 'system';
  }
}

function subscribeToSystem(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
}

/**
 * The theme preference: "light", "dark", or "system" (stored as no key at all), so
 * a visitor who never chose follows their OS, live.
 *
 * The resolved theme goes on `<html>`. The inline script in index.html repeats
 * this rule before React loads; keep the two in step. Assumes a single consumer.
 */
export default function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);

  const isSystemDark = useSyncExternalStore(
    subscribeToSystem,
    () => window.matchMedia(DARK_QUERY).matches,
  );

  const resolved = preference === 'system' ? (isSystemDark ? 'dark' : 'light') : preference;

  // Idempotent on mount: the inline script already set this.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  const choose = useCallback((next: ThemePreference) => {
    setPreference(next);
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not remembering the choice is a worse session, not a broken one.
    }
  }, []);

  return { choose, preference, resolved };
}
