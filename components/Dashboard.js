import { supabase } from '../lib/supabase-client.js';
import { formatRupiah } from '../js/utils.js';

const TARIF_PER_LITER = 5;
const MIN = 10000;
const MAX = 1000000;
const CEPAT = [20000, 50000, 100000, 200000];

export function createDashboard(container, props) {
  const { deviceId, device, error } = props;
  const [nominal, setNominal] = [20000, () => {}];
  
  container.innerHTML = `
    <div class="grid gap-4 lg:grid-cols-5">
      <section class="rounded-2xl bg-sky-600 p-6 text-white lg:col-span-2">
        <p class="text-sm text-sky-100">Sisa kuota ${deviceId}</p>
        <p class="mt-2 text-5xl font-bold">
          ${device ? Number(device.sisa_liter).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '...'}
          <span class="ml-2 text-xl font-medium text-sky-100">liter</span>
        </p>
        <p class="mt-3 text-sm text-sky-100">
          ${error ? 'Gagal membaca data: ' + error : 'Tarif Rp5.000 per m³ (Rp5 per liter)'}
        </p>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
        <h2 class="text-lg font-semibold text-slate-800">Isi ulang token</h2>

        <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          ${CEPAT.map(n => `
            <button data-nominal="${n}" class="quick-btn rounded-xl px-3 py-2 text-sm font-medium ring-1 transition ${n === 20000 ? 'bg-sky-600 text-white ring-sky-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'}">
              ${formatRupiah(n)}
            </button>
          `).join('')}
        </div>

        <label class="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Nominal (Rp)
        </label>
        <input id="dash-nominal" type="number" inputMode="numeric" value="20000" class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-sky-400" />
        <p id="dash-nominal-msg" class="mt-1 text-xs text-slate-500">Min ${formatRupiah(MIN)}, maks ${formatRupiah(MAX)}</p>

        <div class="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span class="text-sm text-slate-600">Kuota yang didapat</span>
          <span id="dash-liter" class="text-lg font-semibold text-sky-700">+4000 L</span>
        </div>

        <button id="dash-pay" class="mt-4 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50">
          Bayar & isi token
        </button>

        <p id="dash-msg" class="mt-3 rounded-xl px-4 py-3 text-sm hidden"></p>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-5">
        <h2 class="text-lg font-semibold text-slate-800">Riwayat transaksi</h2>
        <p class="mt-3 text-sm text-slate-500">Belum tersambung ke database.</p>
      </section>
    </div>
  `;
  
  // Add event listeners
  let currentNominal = 20000;
  const quickBtns = container.querySelectorAll('.quick-btn');
  const nominalInput = container.querySelector('#dash-nominal');
  const nominalMsg = container.querySelector('#dash-nominal-msg');
  const literEl = container.querySelector('#dash-liter');
  const payBtn = container.querySelector('#dash-pay');
  const msgEl = container.querySelector('#dash-msg');
  
  function update() {
    const valid = Number.isInteger(currentNominal) && currentNominal >= MIN && currentNominal <= MAX;
    if (valid) {
      literEl.textContent = '+' + (currentNominal / TARIF_PER_LITER).toLocaleString('id-ID') + ' L';
      nominalMsg.textContent = 'Min ' + formatRupiah(MIN) + ', maks ' + formatRupiah(MAX);
      nominalMsg.className = 'mt-1 text-xs text-slate-500';
      payBtn.disabled = false;
    } else {
      literEl.textContent = '+0 L';
      nominalMsg.textContent = 'Nominal harus bilangan bulat ' + formatRupiah(MIN) + ' – ' + formatRupiah(MAX);
      nominalMsg.className = 'mt-1 text-xs text-red-600';
      payBtn.disabled = true;
    }
  }
  
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentNominal = parseInt(btn.dataset.nominal);
      nominalInput.value = currentNominal;
      quickBtns.forEach(b => {
        b.className = 'quick-btn rounded-xl px-3 py-2 text-sm font-medium ring-1 transition bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';
      });
      btn.className = 'quick-btn rounded-xl px-3 py-2 text-sm font-medium ring-1 transition bg-sky-600 text-white ring-sky-600';
      update();
    });
  });
  
  nominalInput.addEventListener('input', (e) => {
    currentNominal = parseInt(e.target.value) || 0;
    quickBtns.forEach(b => {
      b.className = 'quick-btn rounded-xl px-3 py-2 text-sm font-medium ring-1 transition bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';
    });
    update();
  });
  
  payBtn.addEventListener('click', async () => {
    if (!Number.isInteger(currentNominal) || currentNominal < MIN || currentNominal > MAX) return;
    payBtn.disabled = true;
    payBtn.textContent = 'Memproses…';
    msgEl.classList.add('hidden');
    
    try {
      const r = await fetch('/.netlify/functions/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: currentNominal, deviceId, userEmail: 'unknown' }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.token) throw new Error(j.error || 'Gagal membuat transaksi (' + r.status + ')');
      if (!window.snap) throw new Error('snap.js belum termuat');
      window.snap.pay(j.token, {
        onSuccess: () => {
          fetch('/.netlify/functions/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: j.orderId }),
          }).then(() => {
            msgEl.textContent = 'Pembayaran dikonfirmasi server. Kuota akan ter-update sebentar lagi.';
            msgEl.className = 'mt-3 rounded-xl px-4 py-3 text-sm bg-emerald-50 text-emerald-800';
            msgEl.classList.remove('hidden');
          }).catch(e => {
            msgEl.textContent = e.message;
            msgEl.className = 'mt-3 rounded-xl px-4 py-3 text-sm bg-red-50 text-red-800';
            msgEl.classList.remove('hidden');
          }).finally(() => {
            payBtn.disabled = false;
            payBtn.textContent = 'Bayar & isi token';
          });
        },
        onPending: () => {
          msgEl.textContent = 'Menunggu pembayaran kamu selesai.';
          msgEl.className = 'mt-3 rounded-xl px-4 py-3 text-sm bg-sky-50 text-sky-800';
          msgEl.classList.remove('hidden');
          payBtn.disabled = false;
          payBtn.textContent = 'Bayar & isi token';
        },
        onError: () => {
          msgEl.textContent = 'Pembayaran gagal.';
          msgEl.className = 'mt-3 rounded-xl px-4 py-3 text-sm bg-red-50 text-red-800';
          msgEl.classList.remove('hidden');
          payBtn.disabled = false;
          payBtn.textContent = 'Bayar & isi token';
        },
        onClose: () => {
          payBtn.disabled = false;
          payBtn.textContent = 'Bayar & isi token';
        },
      });
    } catch (e) {
      msgEl.textContent = e.message;
      msgEl.className = 'mt-3 rounded-xl px-4 py-3 text-sm bg-red-50 text-red-800';
      msgEl.classList.remove('hidden');
      payBtn.disabled = false;
      payBtn.textContent = 'Bayar & isi token';
    }
  });
  
  update();
}
