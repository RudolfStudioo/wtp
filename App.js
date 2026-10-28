// Main App untuk vanilla JS - versi yang lebih lengkap
import { useDevice } from './js/useDevice.js';
import { formatNumber } from './js/utils.js';

const DEVICES = ['WM-001', 'WM-002', 'WM-003'];
const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'monitoring', label: 'Monitoring' },
];

let currentTab = 'dashboard';
let currentDeviceId = DEVICES[0];
let deviceData = null;

export function initApp(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-slate-100 text-slate-800">
      <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <h1 class="text-lg font-bold text-sky-700">Smart Water Meter</h1>
          <select id="app-device-select" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm">
            ${DEVICES.map(d => `<option value="${d}" ${d === currentDeviceId ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>
        <nav class="mx-auto flex max-w-5xl gap-1 px-4">
          ${TABS.map(t => `
            <button data-tab="${t.id}" class="tab-app-btn border-b-2 px-4 py-2 text-sm font-medium transition ${t.id === currentTab ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              ${t.label}
            </button>
          `).join('')}
        </nav>
      </header>

      <main class="mx-auto max-w-5xl px-4 py-6">
        <div id="app-content"></div>
      </main>
    </div>
  `;
  
  const deviceSelect = container.querySelector('#app-device-select');
  const tabBtns = container.querySelectorAll('.tab-app-btn');
  const contentDiv = container.querySelector('#app-content');
  
  deviceSelect.addEventListener('change', (e) => {
    currentDeviceId = e.target.value;
    loadContent();
  });
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      tabBtns.forEach(b => {
        if (b === btn) {
          b.classList.add('border-sky-600', 'text-sky-700');
          b.classList.remove('border-transparent', 'text-slate-500');
        } else {
          b.classList.remove('border-sky-600', 'text-sky-700');
          b.classList.add('border-transparent', 'text-slate-500');
        }
      });
      loadContent();
    });
  });
  
  function loadContent() {
    if (currentTab === 'dashboard') {
      loadDashboard(contentDiv);
    } else if (currentTab === 'monitoring') {
      loadMonitoring(contentDiv);
    }
  }
  
  async function loadDashboard(el) {
    el.innerHTML = `
      <div class="grid gap-4 lg:grid-cols-5">
        <section class="rounded-2xl bg-sky-600 p-6 text-white lg:col-span-2">
          <p class="text-sm text-sky-100">Sisa kuota ${currentDeviceId}</p>
          <p class="mt-2 text-5xl font-bold">
            ${deviceData ? formatNumber(deviceData.sisa_liter) : '...'}
            <span class="ml-2 text-xl font-medium text-sky-100">liter</span>
          </p>
        </section>
        <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
          <h2 class="text-lg font-semibold text-slate-800">Isi ulang token</h2>
          <p class="mt-4 text-sm text-slate-500">Lihat halaman utama untuk pembelian token.</p>
        </section>
      </div>
    `;
  }
  
  function loadMonitoring(el) {
    el.innerHTML = `
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Koneksi alat</p>
          <p class="mt-2 text-2xl font-bold text-slate-800">...</p>
        </div>
      </div>
    `;
  }
  
  // Load device data
  useDevice(currentDeviceId, (result) => {
    deviceData = result.device;
    loadContent();
  });
  
  loadContent();
}
