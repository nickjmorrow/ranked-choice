import { useCallback, useEffect, useState } from 'react';

/**
 * Copies text to the clipboard and says whether it worked, for two seconds.
 * The Clipboard API needs a secure context and permission; when it refuses,
 * the caller shows the text selected instead.
 */
export default function useCopy() {
  const [state, setState] = useState<'copied' | 'failed' | 'idle'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = setTimeout(() => {
      setState('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
  }, []);

  return { copy, state };
}
