export function createRiwayatView(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-base font-bold text-slate-800 mb-4">Riwayat Transaksi Token</h3>
        <p class="text-sm text-slate-400 py-8 text-center">Belum ada transaksi.</p>
      </div>
    </div>
  `;
}
