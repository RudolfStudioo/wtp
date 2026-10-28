// Supabase client untuk vanilla JS (supabase-js dari CDN di index.html)
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let supabase = null;

if (typeof window !== 'undefined' && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase };
