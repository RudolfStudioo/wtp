const crypto = require('crypto');
const { applyIfPaid } = require('./lib/apply.cjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const n = JSON.parse(event.body || '{}');
    const expected = crypto
      .createHash('sha512')
      .update(`${n.order_id}${n.status_code}${n.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');
    if (expected !== n.signature_key) return { statusCode: 403, body: 'Invalid signature' };

    const result = await applyIfPaid(n);
    console.log('webhook', n.order_id, n.transaction_status, JSON.stringify(result));
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('webhook error:', e);
    return { statusCode: 500, body: 'Error' };
  }
};
