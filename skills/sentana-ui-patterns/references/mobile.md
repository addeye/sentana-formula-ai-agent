# Mobile & Tablet Architecture Reference (sentana-ui-patterns)

Panduan antarmuka untuk aplikasi mobile (Android/iOS via Flutter, React Native, Jetpack Compose, Swift) dan web responsif pada tablet/phone.

---

## 1. Ergonomi & Layar Sentuh (Touch-First)

### Tap Target & Spacing
- **Minimum Tap Area:** Semua tombol, ikon navigasi, dan baris daftar yang bisa diklik wajib berukuran minimal **48x48 dp/px** (atau 44x44 pt di iOS) dengan padding sentuh yang cukup.
- **Thumb Zone Design:**
  - Letakkan aksi primer (tombol "Bayar", "Simpan", "Lanjut") di bagian bawah layar (*bottom sheet*, *bottom app bar*, atau *floating action button*).
  - Navigasi utama berada di *Bottom Navigation Bar* (maksimal 4-5 item), bukan di hamburger menu yang sulit dijangkau satu tangan.

### Safe Area & Layar Fisik
- Hormati **Safe Area Insets** (notch kamera, dynamic island, home indicator bar, dan status bar). Jangan biarkan tombol atau teks tertutup oleh bilah navigasi OS.
- Tangani keyboard virtual: input form otomatis scroll ke area pandang saat keyboard muncul (*avoid keyboard collision*).

---

## 2. Pola Layar Aplikasi Bisnis (Contoh: POS & Kurir Mobile)

### Layar Kasir / Order (Tablet Landscape & Phone Portrait)
- **Katalog Produk:** Grid atau list dengan gambar/inisial ringkas, harga jelas, dan tombol tambah cepat (+/-).
- **Cart Summary:** 
  - Pada Tablet: Panel samping (split view) selalu terlihat di sebelah kanan.
  - Pada Phone: Bottom bar ringkas yang menampilkan total item dan nominal, yang bisa di-expand menjadi modal sheet untuk pembayaran.
- **Pembayaran:** Pilihan metode pembayaran (Tunai, QRIS, Transfer) dalam bentuk tombol besar (tile) yang mudah ditekan tanpa salah ketik.

### State & Feedback Sentuh
- Berikan **haptic feedback** atau visual ripple/active state instan saat tombol ditekan agar kasir/pengguna yakin perintah telah terdaftar.
- **Offline Indicator:** Jika koneksi terputus, tampilkan badge/banner di status bar ("Mode Offline - Transaksi tersimpan lokal").
