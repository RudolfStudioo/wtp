const { supabase, requireAdmin } = require('./lib/admin.cjs');

const MIN = 10000;
const MAX = 1000000;
const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try {
    const user = await requireAdmin(event);
    if (!user) return json(403, { error: 'Khusus admin' });

    const { deviceId, amount } = JSON.parse(event.body || '{}');
    const nominal = Number(amount);
    if (!Number.isInteger(nominal) || nominal < MIN || nominal > MAX) {
      return json(400, { error: `Nominal harus bilangan bulat Rp${MIN} - Rp${MAX}` });
    }
    if (!/^WM-\d{3}$/.test(deviceId || '')) return json(400, { error: 'Alat tidak valid' });

    const { data: dev, error: devErr } = await supabase
      .from('devices').select('device_id').eq('device_id', deviceId).maybeSingle();
    if (devErr) throw devErr;
    if (!dev) return json(400, { error: 'Alat belum terdaftar di database' });

    const orderId = `LKT-${deviceId}-${Date.now()}`;
    const { data, error } = await supabase.rpc('apply_midtrans_payment', {
      p_order_id: orderId,
      p_device_id: deviceId,
      p_nominal: nominal,
      p_payment_type: 'Tunai (loket)',
      p_user_email: user.email,
    });
    if (error) throw error;
    return json(200, { orderId, sisaLiter: data });
  } catch (e) {
    console.error('admin-loket:', e.message);
    return json(500, { error: 'Gagal mencatat pembayaran loket' });
  }
};
