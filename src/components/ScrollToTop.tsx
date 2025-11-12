import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls window to top whenever the route path or query changes
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}
