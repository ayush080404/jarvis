import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly and early instead of a confusing runtime error deep in a
  // Supabase call — this almost always means .env.local is missing or the
  // dev server wasn't restarted after adding it (Vite only reads env files
  // on startup).
  throw new Error(
    'Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the dev server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
