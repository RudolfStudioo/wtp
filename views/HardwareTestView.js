export function createHardwareTestView(container) {
  container.innerHTML = `
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 class="text-lg font-bold text-slate-800 mb-4">Tes Koneksi Hardware</h3>
      <div class="space-y-3">
        <div class="p-3 border rounded-lg"><span class="font-semibold">Web:</span> <span class="text-emerald-600">TERHUBUNG</span></div>
        <div class="p-3 border rounded-lg"><span class="font-semibold">Supabase:</span> <span class="text-slate-500">MEMERIKSA</span></div>
        <div class="p-3 border rounded-lg"><span class="font-semibold">Hardware:</span> <span class="text-slate-500">MEMERIKSA</span></div>
      </div>
    </div>
  `;
}
