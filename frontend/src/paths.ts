/** Every route in the app, built in one place so a link cannot drift from its route. */

const encode = encodeURIComponent;

export const paths = {
  home: '/',
  newPoll: '/polls/new',
  poll: (link: string) => `/polls/${encode(link)}`,
  results: (link: string) => `/polls/${encode(link)}/results`,
  share: (link: string) => `/polls/${encode(link)}/share`,
  simulator: '/simulator',
};

/** The route patterns `<Routes>` matches, alongside the builders above. */
export const PATTERNS = {
  poll: '/polls/:link',
  results: '/polls/:link/results',
  share: '/polls/:link/share',
};

/** An absolute URL for sharing, on whatever origin the app is served from. */
export function absoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).href;
}
