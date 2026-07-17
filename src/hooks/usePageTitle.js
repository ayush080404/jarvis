import { useEffect } from 'react';

const SITE_NAME = 'Voyora';

export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} \u2014 ${SITE_NAME}` : `${SITE_NAME} \u2014 Explore Beyond Borders`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
