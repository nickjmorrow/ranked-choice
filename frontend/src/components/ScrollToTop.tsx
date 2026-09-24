import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Back to the top of the page on every new address. `BrowserRouter` does not
 * do this, so without it a long form's submit button lands you halfway down
 * the page that follows.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
