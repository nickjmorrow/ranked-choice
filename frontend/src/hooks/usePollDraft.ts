import { useEffect, useState } from 'react';
import { emptyDraft, isBlank, parseDraft, type PollDraft } from 'src/pollForm';

const STORAGE_KEY = 'poll-draft';

function load(): PollDraft {
  try {
    return parseDraft(localStorage.getItem(STORAGE_KEY)) ?? emptyDraft();
  } catch {
    return emptyDraft();
  }
}

/**
 * The create-poll form's state, kept in this browser as it is typed, so a
 * reload or a wrong click does not throw a half-written poll away.
 */
export default function usePollDraft() {
  const [draft, setDraft] = useState(load);

  useEffect(() => {
    try {
      if (isBlank(draft)) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage blocked: the form still works, it just forgets on reload.
    }
  }, [draft]);

  const clear = () => {
    setDraft(emptyDraft());
  };

  return { clear, draft, setDraft };
}
