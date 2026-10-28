const { supabase, requireAdmin } = require('./lib/admin.cjs');

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method Not Allowed' });
  try {
    const user = await requireAdmin(event);
    if (!user) return json(403, { error: 'Khusus admin' });

    const q = event.queryStringParameters || {};
    const days = Math.min(Math.max(parseInt(q.days, 10) || 14, 1), 60);
    let offset = parseInt(q.offset, 10);
    if (!Number.isFinite(offset)) offset = 0;
    offset = Math.min(Math.max(offset, -720), 840);

    const { data, error } = await supabase.rpc('admin_chart', { p_days: days, p_offset_min: offset });
    if (error) throw error;
    return json(200, { days: data });
  } catch (e) {
    console.error('admin-chart:', e.message);
    return json(500, { error: 'Gagal memuat grafik' });
  }
};
