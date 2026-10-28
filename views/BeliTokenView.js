export function createBeliTokenView(container) {
  container.innerHTML = `
    <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <h3 class="text-xl font-bold text-slate-800 mb-1">Beli Token Air</h3>
      <p class="text-slate-500 text-sm mb-6">Pilih nominal untuk menambah kuota air Anda</p>
      <div class="space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button class="py-2 px-3 rounded-lg border border-slate-200 hover:bg-sky-50 hover:border-sky-300">Rp 20.000</button>
          <button class="py-2 px-3 rounded-lg border border-slate-200 hover:bg-sky-50 hover:border-sky-300">Rp 50.000</button>
          <button class="py-2 px-3 rounded-lg border border-slate-200 hover:bg-sky-50 hover:border-sky-300">Rp 100.000</button>
          <button class="py-2 px-3 rounded-lg border border-slate-200 hover:bg-sky-50 hover:border-sky-300">Rp 200.000</button>
        </div>
        <button class="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700">Bayar</button>
      </div>
    </div>
  `;
}
