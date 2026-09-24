import { useEffect } from 'react';

/** Sets the tab's title, so history and screen readers can tell pages apart. */
export default function useDocumentTitle(title: null | string) {
  useEffect(() => {
    document.title = title === null ? 'Ranked Choice' : `${title} · Ranked Choice`;
  }, [title]);
}
