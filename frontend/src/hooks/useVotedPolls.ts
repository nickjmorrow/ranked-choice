import { useCallback, useState } from 'react';

const STORAGE_KEY = 'voted-polls';

function read(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * The polls this browser has voted on. A courtesy, not a control: it lets the
 * ballot page say "you have already voted here", and nothing stops a second
 * ballot — there are no accounts to hang one on. See README > What's
 * deliberately not here.
 */
export default function useVotedPolls() {
  const [links, setLinks] = useState(read);

  const markVoted = useCallback((link: string) => {
    setLinks((current) => {
      const next = current.includes(link) ? current : [...current, link].slice(-100);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Not remembering is a worse session, not a broken one.
      }
      return next;
    });
  }, []);

  const hasVoted = useCallback((link: string) => links.includes(link), [links]);

  return { hasVoted, markVoted };
}
