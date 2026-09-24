/* global document, localStorage, matchMedia */
// Runs before the bundle, and before anything paints — loaded by a plain,
// blocking <script src> in index.html. Without it the page renders light,
// then React mounts, `useTheme` resolves the preference and it flips: a white
// flash on every load for anyone using dark, which is the one thing a theme
// toggle must not do.
//
// A file rather than an inline <script> so the production Content-Security-
// Policy can say `script-src 'self'` and mean it — an inline block would need
// a hash that silently goes stale the next time anyone edits a character here.
//
// It cannot import `useTheme`, so it repeats that hook's rule: an absent key
// means "follow the OS". Keep the two in step.
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const dark =
      stored === 'dark' ||
      (stored !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  } catch {
    document.documentElement.dataset.theme = 'light';
  }
})();
