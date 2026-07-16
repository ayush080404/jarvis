// Demo-only auth: stores a user record in this browser's localStorage.
// There is no backend, no password hashing, and no real security here —
// it exists so Login/Signup have real, working state to react to instead
// of dead buttons, until a real auth backend is wired up.

const USER_KEY = 'voyora:user';
const AUTH_EVENT = 'voyora:auth-change';

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function signup({ name, email, password }) {
  if (!name?.trim()) return { error: 'Enter your name.' };
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return { error: 'Enter a valid email address.' };
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters.' };

  const user = { name: name.trim(), email: email.trim().toLowerCase() };
  setCurrentUser(user);
  return { user };
}

export function login({ email, password }) {
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return { error: 'Enter a valid email address.' };
  if (!password) return { error: 'Enter your password.' };

  // No real credential check exists yet — any password "works" against a
  // locally-remembered email, which is fine for a demo but must not be
  // treated as real authentication.
  const existing = getCurrentUser();
  const name = existing?.email === email.trim().toLowerCase() ? existing.name : email.split('@')[0];
  const user = { name, email: email.trim().toLowerCase() };
  setCurrentUser(user);
  return { user };
}

export function logout() {
  setCurrentUser(null);
}

export function onAuthChange(callback) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
