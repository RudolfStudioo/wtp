const { supabase, requireAdmin } = require('./lib/admin.cjs');

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method Not Allowed' });
  try {
    const user = await requireAdmin(event);
    if (!user) return json(403, { error: 'Khusus admin' });

    const hist = event.queryStringParameters && event.queryStringParameters.history;
    if (hist) {
      if (!/^WM-\d{3}$/.test(hist)) return json(400, { error: 'Alat tidak valid' });
      const [u, t] = await Promise.all([
        supabase.from('usage_log').select('liter,created_at').eq('device_id', hist)
          .order('created_at', { ascending: false }).limit(2000),
        supabase.from('transactions')
          .select('created_at,nominal,liter_diperoleh,metode_pembayaran,user_email')
          .eq('device_id', hist).order('created_at', { ascending: false }).limit(50),
      ]);
      if (u.error) throw u.error;
      if (t.error) throw t.error;
      // gabungkan per menit supaya tidak berisi ratusan baris kecil
      const buckets = new Map();
      for (const r of u.data) {
        const k = String(r.created_at).slice(0, 16);
        const b = buckets.get(k);
        if (b) b.liter += r.liter;
        else buckets.set(k, { waktu: r.created_at, liter: r.liter });
      }
      return json(200, { usage: [...buckets.values()].slice(0, 60), transactions: t.data });
    }

    const [d, s] = await Promise.all([
      supabase.from('devices').select('*').order('device_id'),
      supabase.rpc('admin_summary'),
    ]);
    if (d.error) throw d.error;
    if (s.error) throw s.error;
    return json(200, { devices: d.data, summary: s.data });
  } catch (e) {
    console.error('admin-data:', e.message);
    return json(500, { error: 'Gagal memuat data admin' });
  }
};
