const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// order_id formatnya WTP-<deviceId>-<timestamp>
const deviceFromOrder = (orderId) => {
  const m = /^WTP-(.+)-\d+$/.exec(orderId || '');
  return m ? m[1] : null;
};

// n = notifikasi webhook atau respons get-status dari Midtrans
exports.applyIfPaid = async (n) => {
  const paid =
    n.transaction_status === 'settlement' ||
    (n.transaction_status === 'capture' && n.fraud_status === 'accept');
  if (!paid) return { applied: false, reason: n.transaction_status };

  const deviceId = deviceFromOrder(n.order_id);
  if (!deviceId) return { applied: false, reason: 'order_id tidak dikenal' };

  const { data, error } = await supabase.rpc('apply_midtrans_payment', {
    p_order_id: n.order_id,
    p_device_id: deviceId,
    p_nominal: Math.round(Number(n.gross_amount)),
    p_payment_type: n.payment_type || 'midtrans',
    p_user_email: null,
  });
  if (error) throw error;
  return { applied: data !== null, sisaLiter: data };
};
