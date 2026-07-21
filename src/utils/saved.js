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

  if (error) {
    console.error('getSavedSlugs failed:', error.message, error);
    return [];
  }
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
// error is set if nobody's logged in, or if the database write itself
// failed (this used to be assumed successful without checking, which
// could report "saved" in the UI even when nothing was actually written).
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
    const { error } = await supabase
      .from('saved_destinations')
      .delete()
      .eq('id', existing.id);
    if (error) {
      console.error('toggleSaved (remove) failed:', error.message, error);
      return { saved: true, error: error.message };
    }
    notifyChange();
    return { saved: false };
  }

  const { error } = await supabase
    .from('saved_destinations')
    .insert({ user_id: user.id, destination_slug: slug });

  if (error) {
    console.error('toggleSaved (insert) failed:', error.message, error);
    return { saved: false, error: error.message };
  }
  notifyChange();
  return { saved: true };
}

export async function removeSaved(slug) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('saved_destinations')
    .delete()
    .eq('user_id', user.id)
    .eq('destination_slug', slug);

  if (error) {
    console.error('removeSaved failed:', error.message, error);
    return;
  }
  notifyChange();
}

export function onSavedChange(callback) {
  window.addEventListener(SAVED_EVENT, callback);
  return () => window.removeEventListener(SAVED_EVENT, callback);
}
