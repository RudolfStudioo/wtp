const midtransClient = require('midtrans-client');
const { applyIfPaid } = require('./lib/apply.cjs');

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try {
    const { orderId } = JSON.parse(event.body || '{}');
    if (!/^WTP-.+-\d+$/.test(orderId || '')) return json(400, { error: 'orderId tidak valid' });

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // status ditanyakan langsung ke Midtrans, bukan dipercaya dari browser
    const status = await snap.transaction.status(orderId);
    const result = await applyIfPaid(status);
    return json(200, { status: status.transaction_status, ...result });
  } catch (e) {
    console.error('confirm-payment:', e.message);
    return json(500, { error: 'Gagal memeriksa pembayaran' });
  }
};
