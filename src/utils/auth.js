import { supabase } from '../lib/supabase';

// Real authentication now — accounts are created and verified by Supabase,
// not just remembered in this browser. Sessions persist across devices as
// long as you log in with the same email.

function mapUser(supabaseUser) {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Traveler',
  };
}

export async function signup({ name, email, password }) {
  if (!name?.trim()) return { error: 'Enter your name.' };
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return { error: 'Enter a valid email address.' };
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters.' };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name: name.trim() } },
  });

  if (error) return { error: error.message };

  // Supabase's default project settings require confirming your email
  // before a session exists — data.session is null in that case even
  // though the account was created successfully.
  const needsEmailConfirmation = !data.session;
  return { user: mapUser(data.user), needsEmailConfirmation };
}

export async function login({ email, password }) {
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return { error: 'Enter a valid email address.' };
  if (!password) return { error: 'Enter your password.' };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) return { error: error.message };
  return { user: mapUser(data.user) };
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return mapUser(data.user);
}

// Fires immediately with the current auth state, then again on every future
// login/logout/token refresh — so a component can just do:
//   useEffect(() => onAuthChange(setUser), [])
// and always stay in sync without a separate initial fetch.
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}
