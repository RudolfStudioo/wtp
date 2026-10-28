const { supabase, requireAdmin } = require('./lib/admin.cjs');

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

async function findAuthUser(email) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase()) || null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try {
    const user = await requireAdmin(event);
    if (!user) return json(403, { error: 'Khusus admin' });

    let body;
    try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Data tidak valid' }); }
    const deviceId = String(body.deviceId || '');
    if (!/^WM-\d{3}$/.test(deviceId)) return json(400, { error: 'Alat tidak valid' });

    const hasNama = body.nama !== undefined && body.nama !== null && String(body.nama).trim() !== '';
    const hasPw = body.password !== undefined && body.password !== null && String(body.password) !== '';
    if (!hasNama && !hasPw) return json(400, { error: 'Tidak ada yang diubah' });

    const nama = hasNama ? String(body.nama).trim() : null;
    const password = hasPw ? String(body.password) : null;
    if (nama !== null && (nama.length < 1 || nama.length > 40)) return json(400, { error: 'Nama harus 1 sampai 40 karakter' });
    if (password !== null && (password.length < 8 || password.length > 72)) return json(400, { error: 'Password harus 8 sampai 72 karakter' });

    const { data: dev, error: e1 } = await supabase
      .from('devices').select('device_id,user_email').eq('device_id', deviceId).maybeSingle();
    if (e1) throw e1;
    if (!dev || !dev.user_email) return json(404, { error: 'Alat ini belum punya pemilik' });

    if (password !== null) {
      const au = await findAuthUser(dev.user_email);
      if (!au) return json(404, { error: 'Akun login tidak ditemukan' });
      const { error: e2 } = await supabase.auth.admin.updateUserById(au.id, { password });
      if (e2) return json(400, { error: 'Gagal ganti password: ' + e2.message });
    }
    if (nama !== null) {
      const { error: e3 } = await supabase.from('devices').update({ nama }).eq('device_id', deviceId);
      if (e3) throw e3;
    }
    return json(200, { deviceId, nama, passwordDiubah: password !== null });
  } catch (e) {
    console.error('admin-edit-user:', e.message);
    return json(500, { error: 'Gagal mengubah user' });
  }
};
