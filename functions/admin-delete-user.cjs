const { supabase, requireAdmin } = require('./lib/admin.cjs');

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });
const ADMIN_EMAIL = 'admin@admin.com';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try {
    const user = await requireAdmin(event);
    if (!user) return json(403, { error: 'Khusus admin' });

    let body;
    try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Data tidak valid' }); }
    const deviceId = String(body.deviceId || '');
    if (!/^WM-\d{3}$/.test(deviceId)) return json(400, { error: 'Alat tidak valid' });

    const { data: dev, error: e1 } = await supabase
      .from('devices').select('device_id,user_email').eq('device_id', deviceId).maybeSingle();
    if (e1) throw e1;
    if (!dev || !dev.user_email) return json(404, { error: 'Alat ini belum punya pemilik' });
    if (dev.user_email.toLowerCase() === ADMIN_EMAIL) return json(400, { error: 'Akun admin tidak boleh dihapus' });

    // hapus akun login (kalau sudah tidak ada, lanjut saja)
    const { data: list, error: e2 } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (e2) throw e2;
    const au = list.users.find((u) => (u.email || '').toLowerCase() === dev.user_email.toLowerCase());
    if (au) {
      const { error: e3 } = await supabase.auth.admin.deleteUser(au.id);
      if (e3) return json(400, { error: 'Gagal menghapus akun: ' + e3.message });
    }

    // kosongkan alat; riwayat transaksi tetap disimpan
    const { error: e4 } = await supabase.from('devices')
      .update({ nama: null, user_email: null, sisa_liter: 0, last_ping: null })
      .eq('device_id', deviceId);
    if (e4) throw e4;

    return json(200, { deviceId });
  } catch (e) {
    console.error('admin-delete-user:', e.message);
    return json(500, { error: 'Gagal menghapus user' });
  }
};
