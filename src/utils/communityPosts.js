// Reader-submitted travel stories — stored in this browser's localStorage,
// same honest pattern as utils/saved.js and utils/auth.js. There's no
// backend, so these posts only exist on the device that wrote them; they
// are clearly labeled "Community story" everywhere they're shown so no one
// mistakes them for a synced, multi-device blog.

const POSTS_KEY = 'voyora:community-posts';
const POSTS_EVENT = 'voyora:community-posts-change';

function slugify(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base || 'story'}-${Date.now().toString(36)}`;
}

export function getCommunityPosts() {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getCommunityPostBySlug(slug) {
  return getCommunityPosts().find((p) => p.slug === slug) || null;
}

export function addCommunityPost({ title, author, body, coverImage, destinationName }) {
  const posts = getCommunityPosts();
  const post = {
    slug: slugify(title),
    title: title.trim(),
    author: author.trim(),
    body: body.trim(),
    coverImage: coverImage || null,
    destinationName: destinationName || null,
    isCommunity: true,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(POSTS_KEY, JSON.stringify([post, ...posts]));
  window.dispatchEvent(new Event(POSTS_EVENT));
  return post;
}

export function updateCommunityPost(slug, { title, author, body, coverImage, destinationName }) {
  const posts = getCommunityPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const updated = {
    ...posts[index],
    title: title.trim(),
    author: author.trim(),
    body: body.trim(),
    coverImage: coverImage !== undefined ? coverImage : posts[index].coverImage,
    destinationName: destinationName !== undefined ? destinationName : posts[index].destinationName,
  };
  posts[index] = updated;
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event(POSTS_EVENT));
  return updated;
}

export function removeCommunityPost(slug) {
  const posts = getCommunityPosts();
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts.filter((p) => p.slug !== slug)));
  window.dispatchEvent(new Event(POSTS_EVENT));
}

export function onCommunityPostsChange(callback) {
  window.addEventListener(POSTS_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(POSTS_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
