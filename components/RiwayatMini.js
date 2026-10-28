export function createRiwayatMini(container, { transactions = [] }) {
  container.innerHTML = `
    <div class="mt-4 pt-3 border-t border-slate-100">
      <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
        Riwayat Pengisian Token
      </span>
      ${transactions.length === 0 ? 
        '<p class="text-xs text-slate-400 py-4 text-center">Belum ada transaksi.</p>' :
        `<div class="max-h-40 overflow-auto">
          <table class="w-full text-left text-[11px] text-slate-700">
            <thead class="sticky top-0 bg-white text-[10px] uppercase tracking-wide text-slate-400">
              <tr>
                <th class="py-1 pr-3 font-bold">Waktu pengisian</th>
                <th class="py-1 pr-3 font-bold">Perangkat</th>
                <th class="py-1 pr-3 font-bold">Metode</th>
                <th class="py-1 pr-3 font-bold">Nominal</th>
                <th class="py-1 font-bold">Kuota</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${transactions.slice(0, 10).map(tx => `
                <tr class="cursor-pointer hover:bg-slate-50">
                  <td class="py-1.5 pr-3 whitespace-nowrap text-slate-500">${tx.waktu}</td>
                  <td class="py-1.5 pr-3 font-mono">${tx.device_id}</td>
                  <td class="py-1.5 pr-3 whitespace-nowrap">${tx.metode}</td>
                  <td class="py-1.5 pr-3 font-semibold whitespace-nowrap">Rp ${tx.nominal.toLocaleString('id-ID')}</td>
                  <td class="py-1.5 font-bold text-sky-600 whitespace-nowrap">+${tx.liter} L (${tx.m3} m³)</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`
      }
    </div>
  `;
}
