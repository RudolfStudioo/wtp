const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_EMAILS = ['admin@admin.com'];

// Mengembalikan user kalau token valid DAN emailnya admin, selain itu null
exports.requireAdmin = async (event) => {
  const h = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
  const token = h.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) return null;
  const email = (data.user.email || '').toLowerCase();
  return ADMIN_EMAILS.includes(email) ? data.user : null;
};

exports.supabase = supabase;
