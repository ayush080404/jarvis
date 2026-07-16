// Shared "saved destinations" store — localStorage-backed, same pattern as
// utils/auth.js, so DestinationDetail's bookmark button and the /saved page
// always agree on state and stay in sync via a custom event.

const SAVED_KEY = 'voyora:saved-destinations';
const SAVED_EVENT = 'voyora:saved-change';

export function getSavedSlugs() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isSaved(slug) {
  return getSavedSlugs().includes(slug);
}

export function toggleSaved(slug) {
  const current = getSavedSlugs();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(SAVED_EVENT));
  return next.includes(slug);
}

export function removeSaved(slug) {
  const current = getSavedSlugs();
  localStorage.setItem(SAVED_KEY, JSON.stringify(current.filter((s) => s !== slug)));
  window.dispatchEvent(new Event(SAVED_EVENT));
}

export function onSavedChange(callback) {
  window.addEventListener(SAVED_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(SAVED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
