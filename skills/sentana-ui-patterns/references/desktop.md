# Desktop Architecture Reference (sentana-ui-patterns)

Panduan antarmuka untuk aplikasi desktop (Electron, Tauri, Flutter Desktop, WinUI/WPF) yang beroperasi di Windows, macOS, atau Linux.

---

## 1. Navigasi & Kontrol Keyboard (Keyboard-First)

### Shortcut & Input Cepat
- Aplikasi desktop operasional (seperti POS Kasir, ERP, Logistik) harus bisa dioperasikan **tanpa mouse**:
  - `F1` - `F12`: Shortcut fungsi kasir (misal `F2` Cari Produk, `F9` Bayar Tunai, `Esc` Batal).
  - Tampilkan petunjuk tombol pintas secara visual di label tombol (contoh: `[F9] Bayar`).
  - Barcode scanner input: Pastikan cursor otomatis fokus ke field input pencarian barcode setelah transaksi selesai.

### Focus Management
- Indikator fokus (`outline` atau ring highlight) harus terlihat jelas dengan kontras tinggi saat berpindah antar input menggunakan tombol `Tab` atau panah keyboard.
- Dilarang menghilangkan outline fokus keyboard tanpa pengganti visual.

---

## 2. Window Management & Scaling

### Resolusi & Multi-Monitor
- Dukung berbagai skala display (DPI scaling 100%, 125%, 150%) tanpa teks pecah atau tata letak bergeser.
- Tetapkan ukuran window minimum (misal: 1024x768) agar layout tidak collapse saat window diubah ukurannya oleh pengguna.
- Tangani state offline dan status konektivitas periferal (printer struk USB/Bluetooth, barcode scanner) secara visual di header/footer aplikasi.
