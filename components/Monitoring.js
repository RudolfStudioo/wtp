const BATAS_ONLINE_DETIK = 15;

function Kartu({ judul, nilai, catatan, warna = 'text-slate-800' }) {
  return `
    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p class="text-xs font-medium uppercase tracking-wide text-slate-500">${judul}</p>
      <p class="mt-2 text-2xl font-bold ${warna}">${nilai}</p>
      ${catatan ? `<p class="mt-1 text-xs text-slate-500">${catatan}</p>` : ''}
    </div>
  `;
}

export function createMonitoring(container, props) {
  const { device } = props;
  
  function render() {
    if (!device) {
      container.innerHTML = '<p class="text-sm text-slate-500">Memuat data alat…</p>';
      return;
    }
    
    const now = Date.now();
    const umur = device.last_ping ? Math.max(0, Math.round((now - new Date(device.last_ping).getTime()) / 1000)) : null;
    const online = umur !== null && umur <= BATAS_ONLINE_DETIK;
    
    let catatanPing = 'Belum pernah ping';
    if (umur !== null) {
      catatanPing = umur < 60 ? 'Ping terakhir ' + umur + ' detik lalu'
        : umur < 3600 ? 'Ping terakhir ' + Math.round(umur / 60) + ' menit lalu'
        : 'Ping terakhir ' + Math.round(umur / 3600) + ' jam lalu';
    }
    
    container.innerHTML = `
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${Kartu({ judul: 'Koneksi alat', nilai: online ? 'Online' : 'Offline', catatan: catatanPing, warna: online ? 'text-emerald-600' : 'text-red-600' })}
        ${Kartu({ judul: 'Katup', nilai: device.status_katup ? 'Terbuka' : 'Tertutup', warna: device.status_katup ? 'text-sky-600' : 'text-slate-700' })}
        ${Kartu({ judul: 'Debit', nilai: Number(device.debit_realtime || 0).toFixed(2) + ' L/mnt' })}
        ${Kartu({ judul: 'Sisa kuota', nilai: Number(device.sisa_liter).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' L' })}
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:col-span-2 lg:col-span-4">
          <h2 class="text-lg font-semibold text-slate-800">Grafik debit</h2>
          <p class="mt-2 text-sm text-slate-500">Menyusul setelah alat mengirim data.</p>
        </div>
      </div>
    `;
  }
  
  render();
  setInterval(render, 1000);
}
