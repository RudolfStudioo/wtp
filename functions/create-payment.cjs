const midtransClient = require('midtrans-client');

const MIN = 10000;
const MAX = 1000000;
const DEVICES = ['WM-001', 'WM-002', 'WM-003'];
const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try {
    const { amount, deviceId, userEmail } = JSON.parse(event.body || '{}');
    const nominal = Number(amount);

    if (!Number.isInteger(nominal) || nominal < MIN || nominal > MAX) {
      return json(400, { error: `Nominal harus bilangan bulat Rp${MIN} - Rp${MAX}` });
    }
    if (!DEVICES.includes(deviceId)) return json(400, { error: 'Perangkat tidak dikenal' });

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail || '');
    const orderId = `WTP-${deviceId}-${Date.now()}`;
    const trx = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: nominal },
      customer_details: { email: emailOk ? userEmail : 'customer@example.com' },
    });
    return json(200, { token: trx.token, orderId });
  } catch (e) {
    console.error('create-payment:', e.message);
    return json(500, { error: 'Gagal membuat transaksi' });
  }
};