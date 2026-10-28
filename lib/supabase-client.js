// Supabase client untuk vanilla JS
// Menggunakan Supabase JS dari CDN

let supabase = null;

if (typeof window !== 'undefined' && window.supabase) {
  // Ambil konfigurasi dari window atau localStorage/env
  const supabaseUrl = window.SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || '';
  const supabaseAnonKey = window.SUPABASE_ANON_KEY || localStorage.getItem('SUPABASE_ANON_KEY') || '';
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  }
}

export { supabase };
