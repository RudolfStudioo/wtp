export function formatRupiah(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

export function formatNumber(n) {
  return Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 });
}

export function formatNumberFull(n) {
  return Number(n || 0).toLocaleString('id-ID');
}
