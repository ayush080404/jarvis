import { supabase } from '../lib/supabase';

const POSTS_EVENT = 'voyora:community-posts-change';

function notifyChange() {
  window.dispatchEvent(new Event(POSTS_EVENT));
}

function slugify(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base || 'story'}-${Date.now().toString(36)}`;
}

function mapRow(row) {
  return {
    slug: row.slug,
    title: row.title,
    author: row.author_name,
    body: row.body,
    coverImage: row.cover_image,
    destinationName: row.destination_name,
    isCommunity: true,
    createdAt: row.created_at,
    userId: row.user_id,
  };
}

export async function getCommunityPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data.map(mapRow);
}

export async function getCommunityPostBySlug(slug) {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}

// Posting now requires a real account — the author name comes from the
// logged-in user's profile, not a free-text field, since a post's identity
// is tied to who can edit/delete it later.
export async function addCommunityPost({ title, body, coverImage, destinationName }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Log in to share a story.' };

  const slug = slugify(title);
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      slug,
      user_id: user.id,
      author_name: user.user_metadata?.name || user.email.split('@')[0],
      title: title.trim(),
      body: body.trim(),
      cover_image: coverImage || null,
      destination_name: destinationName || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  notifyChange();
  return { post: mapRow(data) };
}

export async function updateCommunityPost(slug, { title, body, coverImage, destinationName }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Log in to edit your story.' };

  const { data, error } = await supabase
    .from('community_posts')
    .update({
      title: title.trim(),
      body: body.trim(),
      cover_image: coverImage ?? null,
      destination_name: destinationName ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return { error: error.message };
  notifyChange();
  return { post: mapRow(data) };
}

export async function removeCommunityPost(slug) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('community_posts').delete().eq('slug', slug).eq('user_id', user.id);
  notifyChange();
}

export function onCommunityPostsChange(callback) {
  window.addEventListener(POSTS_EVENT, callback);
  return () => window.removeEventListener(POSTS_EVENT, callback);
}
