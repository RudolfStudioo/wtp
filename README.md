# Smart Water Meter - Vanilla Web Version

Versi vanilla HTML, CSS, dan JavaScript dari aplikasi Smart Water Meter. 

## Fitur
- Dashboard dengan informasi sisa kuota air
- Halaman Monitoring status perangkat
- Integrasi pembayaran Midtrans
- Integrasi Supabase untuk data real-time

## Cara Penggunaan
1. Buka file `index.html` di browser
2. Atur konfigurasi Supabase di `js/config.js` atau melalui variabel global
3. Pastikan server Netlify functions berjalan untuk payment

## Struktur File
- `index.html` - Halaman utama
- `css/` - File CSS
- `js/` - File JavaScript
- `components/` - Komponen-komponen
- `views/` - Halaman-halaman
- `lib/` - Library/utilitas
- `functions/` - Netlify functions (disalin dari versi React)

## Catatan
Semua kode telah dikonversi dari React/Vite ke vanilla HTML, CSS, dan JavaScript tanpa mengubah logika bisnis.
