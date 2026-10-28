// Configuration for Supabase - update with your own values
// You can also set these via environment variables if using a build tool
export const SUPABASE_URL = window.SUPABASE_URL || 'https://layiqqvtgxfqiumqxqec.supabase.co';
export const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_EUunAjYYibF2lWCgLZch9Q_J_f3Uekt';

export const DEVICES = ['WM-001', 'WM-002', 'WM-003'];
export const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'monitoring', label: 'Monitoring' },
];

export const TARIF_PER_LITER = 5; // Rp5.000 / m3
export const MIN_NOMINAL = 10000;
export const MAX_NOMINAL = 1000000;
export const QUICK_NOMINALS = [20000, 50000, 100000, 200000];
