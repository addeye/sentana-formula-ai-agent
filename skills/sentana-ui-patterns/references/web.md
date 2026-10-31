# Web Architecture Reference (sentana-ui-patterns)

Panduan arsitektur antarmuka web untuk aplikasi bisnis (admin panel, internal tool) dan situs publik (landing page).

---

## 1. Admin Panel & Web Dashboard

### Layout Structure
- **Root Shell:** Gunakan layout semantik: `<aside>` (sidebar navigasi), `<header>` (topbar ringkas), `<main>` (area kerja data).
- **Navigation:**
  - Sidebar fixed atau collapsible dengan link aktif terlihat jelas (`aria-current="page"`).
  - Topbar memuat: tenant/outlet switcher (jika multi-tenant), profil user/logout, dan breadcrumb navigasi.
- **Data Table Standard:**
  - Toolbar atas: Input pencarian (debounce 300ms) + filter dropdown status + tombol primary action ("Tambah Data").
  - Table element: Gunakan `<table>` murni dengan `<thead>`, `<tbody>`, `<th>` bertipe teks kontras tinggi, dan text truncation jika field melebihi batas kolom.
  - Pagination bar: Tampilkan jumlah total baris ("Menampilkan 1-10 dari 150 data"), kontrol halaman (Previous/Next), dan selector ukuran halaman.
- **Form & Actions:**
  - Form create/edit ringan: Gunakan drawer (offcanvas) atau modal dialog dengan tombol Escape untuk keluar.
  - Aksi destruktif (Hapus/Arsipkan): Wajib konfirmasi modal dialog dengan label bahaya yang jelas, BUKAN alert browser mentah.

### State Minimum yang Wajib Ada
1. **Loading State:** Skeleton table rows saat data diambil (hindari layar putih kosong).
2. **Empty State:** Ilustrasi/ikon minimalis + teks informatif + CTA ("Belum ada data transaksi. [Buat Transaksi Pertama]").
3. **Error State:** Banner peringatan di atas tabel atau toast notifikasi dengan opsi "Coba Lagi" saat network/API gagal.

---

## 2. Public Site & Landing Page

### Narrative Flow (Bukan Template Slop)
1. **Hero Section:**
   - 1 Headline jelas yang menyatakan masalah yang diselesaikan (tanpa buzzword seperti "Revolutionary AI").
   - 1 Sub-headline penjelasan singkat (maksimal 2 kalimat).
   - 1 Tombol CTA spesifik ("Mulai Uji Coba Gratis", "Hubungi Sales", "Lihat Demo").
   - Visual konkret: Screenshot aplikasi asli atau preview interaktif nyata, bukan skeleton atau terminal palsu.
2. **Social Proof & Bukti Nyata:**
   - Testimonial atau logo klien hanya jika real. Dilarang menampilkan avatar kartun atau data statistik rekaan (misal: "10K+ Users").
3. **Feature in Context:**
   - Jelaskan fitur dalam konteks operasional bisnis klien (bagaimana fitur memotong waktu, mencegah kebocoran kasir, dll).
4. **Header & Footer:**
   - Header sticky dengan navigasi bersih + mobile hamburger menu yang bisa diakses via keyboard.
   - Footer dengan hak cipta, legal/privacy policy asli, dan kontak perusahaan.

---

## 3. Framework Translators (Gunakan Sesuai Stack Proyek)

### A. Tailwind CSS (Jika Proyek Menggunakan Tailwind)
- **Tabel:** `min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden`
- **Header Tabel:** `bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`
- **Cell Tabel:** `px-4 py-3 text-sm text-gray-900 whitespace-nowrap`
- **Button Primary:** `inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-h-[44px]`
- **Responsive:** Selalu gunakan mobile-first (`w-full md:w-auto`, `hidden md:block`).

### B. Bootstrap 5 (Jika Proyek Menggunakan Bootstrap / Blade)
- **Tabel:** `<div class="table-responsive"><table class="table table-hover table-bordered align-middle">`
- **Header Tabel:** `<thead class="table-light text-uppercase fs-7 text-muted">`
- **Card Container:** `<div class="card shadow-sm border-0 mb-4"><div class="card-body">`
- **Modal Konfirmasi:** Gunakan komponen native `.modal` dengan `.btn-danger` untuk tombol destruktif.
- Hindari inline style (`style="..."`) jika class utility Bootstrap tersedia (`d-flex`, `gap-2`, `align-items-center`).
