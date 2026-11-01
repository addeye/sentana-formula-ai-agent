# Web Architecture Reference (sentana-ui-patterns)

Panduan arsitektur antarmuka web untuk aplikasi bisnis (admin panel, internal tool), halaman autentikasi (login/register), dan situs publik (landing page).

---

## 1. Admin Panel & Web Dashboard (Proposional & Rapi)

### A. Root App Shell Proportions
Layout admin yang berantakan biasanya disebabkan oleh tidak adanya batas lebar (*unbounded width*), sidebar yang tidak terkunci, atau kontainer data yang meluber.
- **Sidebar Navigasi:**
  - Lebar terkunci desktop: **240px – 260px** (`w-60` atau `w-64`). Tidak boleh fleksibel melebar mengikuti teks.
  - Ketinggian: `h-screen`, `sticky` atau `fixed` dengan scroll mandiri (`overflow-y-auto`).
  - Mobile (< 768px): Sidebar tersembunyi secara default; dibuka menggunakan hamburger button sebagai drawer/offcanvas dengan overlay backdrop gelap.
- **Topbar Header:**
  - Ketinggian terkunci: **56px – 64px** (`h-14` atau `h-16`).
  - Posisi: `sticky top-0 z-20`, border bawah tipis, background solid atau semi-solid (bukan glassmorphism berlebihan).
  - Elemen: Hamburger toggle (mobile), Breadcrumbs aktif, Tenant/Outlet switcher, Profil & Logout dropdown.
- **Main Workspace Content:**
  - Container utama: `flex-1 min-w-0 overflow-y-auto min-h-screen`.
  - Padding area kerja: **16px – 24px pada mobile (`p-4`), 24px – 32px pada desktop (`p-6` atau `p-8`)**.
  - Batas maksimal: Bungkus konten dalam `max-w-7xl mx-auto w-full` agar tidak membentang ekstrem di monitor ultra-wide (27"+).

### B. Proposi Form Input di Admin Panel
- **Dilarang keras membentangkan 1 input melintasi seluruh lebar layar monitor.**
- **Batas Form:** Form admin dibatasi maksimal lebar `max-w-3xl` (768px) atau `max-w-4xl` (896px).
- **Multi-Column Grid:**
  - Gunakan grid 2 kolom di desktop (`grid grid-cols-1 md:grid-cols-2 gap-5`) untuk field berpasangan (misal: Nama Depan & Belakang, Email & No HP, Kategori & Satuan).
  - Gunakan `col-span-full` untuk field deskripsi panjang, textarea, upload berkas, atau tabel detail.
- **Input Field Dimensions:**
  - Tinggi input: **40px – 44px** (nyaman untuk diklik dan discan mata).
  - Padding dalam: `px-3.5 py-2.5`.
  - Label: Selalu di atas input (`mb-1.5`), font 13px–14px, semi-bold (`font-medium`).
  - Jarak antar baris form: **16px – 20px**.
  - Action footer: Terpisah dengan garis pembatas tipis (`border-t pt-5 mt-6`), tombol Simpan (Primary) dan Batal (Secondary) dikelompokkan rapi di kanan atau kiri.

### C. Data Table Standard
- **Toolbar Atas:** Layout flex responsive (`flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3`).
  - Input pencarian: Lebar terkunci `w-full sm:w-64 md:w-80`, BUKAN 100% penuh yang mendorong tombol aksi hilang dari layar.
  - Aksi grup (Filter + Tambah): Tombol aksi primer terlihat jelas.
- **Table Container:** Wajib dibungkus `<div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">` untuk mencegah horizontal scroll merusak layout seluruh halaman.
- **Pagination Bar:** Jumlah data di kiri ("Menampilkan 1-10 dari 150"), navigasi halaman di kanan.

---

## 2. Halaman Autentikasi (Login, Register, Forgot Password)

Halaman login yang tidak proporsional biasanya terjadi karena field input dibiarkan melebar 100% mengikuti lebar viewport layar, atau ketiadaan card boundary yang jelas.

### A. Pola Tata Letak (Layout Bounds)
Pilih salah satu dari 2 pola resmi Sentana:
1. **Centered Single Card (Standar):**
   - Layar penuh `min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950`.
   - Card container dibatasi ketat: **maksimal lebar 380px – 420px (`max-w-md w-full`)**.
   - Input dan tombol berada di dalam kartu dengan padding nyaman (`p-6 sm:p-8`).
2. **Split Screen (Enterprise / Modern):**
   - Sisi Kiri (40% - 50%): Visual branding, testimonial klien nyata, atau mockup produk (tersembunyi di mobile).
   - Sisi Kanan: Area form dengan container internal yang tetap dibatasi **`max-w-md w-full mx-auto`**, terpusat vertikal.

### B. Proposi Elemen Login
- **Brand Header:**
  - Logo aplikasi / Sentana: Tinggi 32px – 40px.
  - Judul: 22px – 26px (`font-bold text-slate-900 dark:text-white`), contoh: "Masuk ke Akun Anda".
  - Sub-judul: 13px – 14px (`text-slate-500 dark:text-slate-400 mb-6`), contoh: "Masukkan kredensial Anda untuk mengakses dashboard".
- **Input Fields:**
  - Tinggi field: **44px** (sesuai standar tap target & kenyamanan ketik).
  - Font size input: **14px – 16px** (16px mencegah auto-zoom paksa di peramban mobile Safari/iOS).
  - Spacing vertikal: Jarak antar field **16px – 18px** (`space-y-4.5`).
  - Field Password: Sertakan tombol toggle show/hide mata (eye icon) di sisi kanan dalam input.
- **Aksi & Link:**
  - Baris "Ingat Saya" (checkbox) sejajar horizontal dengan "Lupa Password?" (link 13px warna primary).
  - Tombol Submit (Login): **Lebar penuh 100% kartu (`w-full`)**, tinggi **44px – 48px**, teks tebal & jelas ("Masuk ke Dashboard").
  - Loading State: Tombol submit menampilkan spinner halus saat memproses autentikasi, disabled dari klik ganda.

---

## 3. Public Site & Landing Page

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

## 4. Framework Translators (Kode Proposional Siap Pakai)

**Preview interaktif:** Baca [`../templates/README.md`](../templates/README.md). Tailwind: [`login.html`](../templates/tailwind/login.html), [`admin.html`](../templates/tailwind/admin.html). Bootstrap 5: [`login.html`](../templates/bootstrap5/login.html), [`admin.html`](../templates/bootstrap5/admin.html). Masing-masing mencakup validasi, toggle password, navigasi mobile, pencarian lokal, form create/edit, dan state demo. Memerlukan internet untuk CDN; bukan produksi. Navigasi mobile preview menerapkan drawer modal native `<dialog>` dengan backdrop overlay (Escape, focus trap, dismissal backdrop) dan fallback disclosure in-flow bila script tidak aktif, tanpa menduplikasi link navigasi. Cuplikan di bawah hanya contoh proporsi statis, bukan halaman lengkap dengan perilaku.

### A. Tailwind CSS (Modern Utility)

#### 1. Proportional Login Card
```html
<div class="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
  <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 sm:p-8">
    <div class="text-center mb-6">
      <img src="/logo.svg" alt="Logo" class="h-9 mx-auto mb-3" />
      <h1 class="text-xl font-bold text-slate-900 dark:text-white">Masuk ke Sistem</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Silakan masukkan email dan password Anda</p>
    </div>
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
        <input type="email" placeholder="nama@perusahaan.com" class="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
      </div>
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <a href="/forgot" class="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Lupa password?</a>
        </div>
        <input type="password" placeholder="••••••••" class="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
      </div>
      <div class="flex items-center">
        <input id="remember" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        <label for="remember" class="ml-2 block text-sm text-slate-600 dark:text-slate-400">Ingat saya di perangkat ini</label>
      </div>
      <button type="submit" class="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition flex items-center justify-center">
        Masuk
      </button>
    </form>
  </div>
</div>
```

#### 2. Proportional Admin Layout Shell
```html
<div class="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
  <!-- Sidebar Desktop (Fixed Width) -->
  <aside class="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <div class="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 font-bold text-lg">
      Sentana App
    </div>
    <nav class="flex-1 overflow-y-auto p-4 space-y-1">
      <a href="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">Dashboard</a>
      <a href="/orders" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Transaksi</a>
    </nav>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Topbar (Fixed Height) -->
    <header class="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
      <div class="font-semibold text-sm sm:text-base">Ringkasan Operasional</div>
      <div class="flex items-center gap-3">
        <span class="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">Outlet Utama</span>
        <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">A</div>
      </div>
    </header>

    <!-- Workspace Scrollable -->
    <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Content here -->
      </div>
    </main>
  </div>
</div>
```

#### 3. Proportional Admin Form Grid
```html
<form class="max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
  <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-5">Informasi Produk</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Produk</label>
      <input type="text" class="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Kopi Susu Aren" />
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kategori</label>
      <select class="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
        <option>Minuman</option>
        <option>Makanan</option>
      </select>
    </div>
    <div class="col-span-full">
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi Lengkap</label>
      <textarea rows="3" class="w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Deskripsi opsional..."></textarea>
    </div>
  </div>
  <div class="border-t border-slate-200 dark:border-slate-800 pt-5 mt-6 flex justify-end gap-3">
    <button type="button" class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Batal</button>
    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">Simpan Produk</button>
  </div>
</form>
```

---

### B. Bootstrap 5 (Blade & Framework Klasik)

#### 1. Proportional Login Card
```html
<div class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
  <div class="card shadow-sm border-0" style="max-width: 420px; width: 100%;">
    <div class="card-body p-4 p-sm-5">
      <div class="text-center mb-4">
        <h4 class="fw-bold mb-1">Masuk ke Sistem</h4>
        <p class="text-muted small">Masukkan kredensial Anda untuk melanjutkan</p>
      </div>
      <form>
        <div class="mb-3">
          <label class="form-label small fw-semibold">Email</label>
          <input type="email" class="form-control" style="height: 44px;" placeholder="nama@perusahaan.com" required>
        </div>
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label small fw-semibold mb-0">Password</label>
            <a href="/forgot" class="small text-decoration-none">Lupa password?</a>
          </div>
          <input type="password" class="form-control" style="height: 44px;" placeholder="••••••••" required>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="rememberMe">
          <label class="form-check-label small text-muted" for="rememberMe">Ingat saya di perangkat ini</label>
        </div>
        <button type="submit" class="btn btn-primary w-100 fw-semibold" style="height: 44px;">Masuk</button>
      </form>
    </div>
  </div>
</div>
```

#### 2. Proportional Admin Shell
```html
<div class="d-flex vh-100 overflow-hidden bg-light">
  <!-- Sidebar Desktop (250px) -->
  <aside class="bg-white border-end d-none d-md-flex flex-column" style="width: 250px; flex-shrink: 0;">
    <div class="d-flex align-items-center px-4 border-bottom" style="height: 60px;">
      <span class="fw-bold fs-5">Sentana Admin</span>
    </div>
    <div class="p-3 overflow-y-auto flex-grow-1">
      <ul class="nav nav-pills flex-column gap-1">
        <li class="nav-item"><a href="/dashboard" class="nav-link active">Dashboard</a></li>
        <li class="nav-item"><a href="/orders" class="nav-link link-dark">Transaksi</a></li>
      </ul>
    </div>
  </aside>

  <!-- Main Container -->
  <div class="d-flex flex-column flex-grow-1 min-w-0 overflow-hidden">
    <!-- Topbar Header -->
    <header class="bg-white border-bottom px-4 d-flex align-items-center justify-content-between" style="height: 60px;">
      <span class="fw-semibold">Ringkasan Penjualan</span>
      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-secondary-subtle text-secondary-emphasis">Outlet Pusat</span>
      </div>
    </header>

    <!-- Scrollable Workspace -->
    <main class="flex-grow-1 overflow-y-auto p-4 p-lg-5">
      <div class="container-fluid" style="max-width: 1300px;">
        <!-- Data Table / Forms Here -->
      </div>
    </main>
  </div>
</div>
```
