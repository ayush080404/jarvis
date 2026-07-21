import { supabase } from '../lib/supabase';

const SAVED_EVENT = 'voyora:saved-change';

function notifyChange() {
  window.dispatchEvent(new Event(SAVED_EVENT));
}

export async function getSavedSlugs() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_destinations')
    .select('destination_slug')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data.map((row) => row.destination_slug);
}

export async function isSaved(slug) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('saved_destinations')
    .select('id')
    .eq('user_id', user.id)
    .eq('destination_slug', slug)
    .maybeSingle();

  return Boolean(data);
}

// Toggles saved state for the current user. Returns { saved, error } —
// error is set (and saved stays false) if nobody's logged in, so the UI can
// prompt someone to log in instead of silently failing.
export async function toggleSaved(slug) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { saved: false, error: 'Log in to save destinations.' };
  }

  const { data: existing } = await supabase
    .from('saved_destinations')
    .select('id')
    .eq('user_id', user.id)
    .eq('destination_slug', slug)
    .maybeSingle();

  if (existing) {
    await supabase.from('saved_destinations').delete().eq('id', existing.id);
    notifyChange();
    return { saved: false };
  }

  await supabase
    .from('saved_destinations')
    .insert({ user_id: user.id, destination_slug: slug });
  notifyChange();
  return { saved: true };
}

export async function removeSaved(slug) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('saved_destinations')
    .delete()
    .eq('user_id', user.id)
    .eq('destination_slug', slug);
  notifyChange();
}

export function onSavedChange(callback) {
  window.addEventListener(SAVED_EVENT, callback);
  return () => window.removeEventListener(SAVED_EVENT, callback);
}
