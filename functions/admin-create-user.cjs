const { supabase, requireAdmin } = require('./lib/admin.cjs');

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try {
    const user = await requireAdmin(event);
    if (!user) return json(403, { error: 'Khusus admin' });

    let body;
    try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Data tidak valid' }); }
    const nama = String(body.nama || '').trim();
    const password = String(body.password || '');
    if (nama.length < 1 || nama.length > 40) return json(400, { error: 'Nama harus 1 sampai 40 karakter' });
    if (password.length < 8 || password.length > 72) return json(400, { error: 'Password harus 8 sampai 72 karakter' });

    // slot kosong pertama (alat yang belum punya pemilik)
    const { data: free, error: e1 } = await supabase
      .from('devices').select('device_id').is('user_email', null).order('device_id').limit(1);
    if (e1) throw e1;
    if (!free || !free.length) return json(409, { error: 'Semua alat sudah terpakai' });
    const deviceId = free[0].device_id;
    const email = deviceId.toLowerCase() + '@wtp.local';

    const { data: created, error: e2 } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    });
    if (e2) return json(400, { error: 'Gagal membuat akun: ' + e2.message });

    // klaim alat; hanya berhasil kalau masih kosong
    const { data: claimed, error: e3 } = await supabase
      .from('devices').update({ nama, user_email: email })
      .eq('device_id', deviceId).is('user_email', null).select('device_id');
    if (e3 || !claimed || !claimed.length) {
      await supabase.auth.admin.deleteUser(created.user.id);
      return json(409, { error: 'Alat baru saja dipakai, coba lagi' });
    }

    return json(200, { deviceId, email, nama });
  } catch (e) {
    console.error('admin-create-user:', e.message);
    return json(500, { error: 'Gagal membuat user' });
  }
};
