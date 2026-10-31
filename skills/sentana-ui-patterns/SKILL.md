---
name: sentana-ui-patterns
description: Standar arsitektur antarmuka software house Sentana Teknologi untuk Web (Admin Panel & Landing Page), Mobile, dan Desktop. Gunakan saat: user meminta buat tampilan, admin panel, dashboard, landing page, UI mobile, UI desktop, atau standarisasi antarmuka.
---

# Sentana UI Patterns (Cross-Platform UI Standards)

Standar arsitektur antarmuka software house Sentana Teknologi untuk memastikan setiap produk (Web, Mobile, Desktop) memiliki kegunaan tinggi, struktur profesional, bebas tren AI slop, dan siap produksi.

## Batas Kerja dan Prinsip Dasar

- **Konteks Platform Nyata:** Sesuaikan arsitektur UI dengan target platform proyek (Web browser, Mobile tablet/phone, atau Desktop app) yang didefinisikan di Tech Spec atau brief proyek.
- **Bukan Styleguide Tertutup:** Skill ini tidak memaksakan satu warna atau font mutlak, melainkan menetapkan **standar pola arsitektur interaksi** dan fungsionalitas komponen.
- **Integrasi dengan Filter Anti-Slop:** Gunakan bersama `antislop-ui` untuk memfilter dekorasi AI berlebih (gradien ungu-biru default, bento grid template, border radius kapsul seragam).

---

## Alur Penerapan Pola Antarmuka

### 1. Identifikasi Target Platform & Archetype
Sebelum menulis kode antarmuka atau komponen, periksa tipe halaman yang dibangun:
1. **Web Admin Panel / Dashboard:** Baca referensi `references/web.md` bagian 1.
2. **Web Public / Landing Page:** Baca referensi `references/web.md` bagian 2.
3. **Mobile & Tablet App (Android / iOS / PWA):** Baca referensi `references/mobile.md`.
4. **Desktop App (Windows / macOS / POS Kasir):** Baca referensi `references/desktop.md`.

### 2. Standar Fondasi Komponen (Berlaku Lintas Platform)
Setiap antarmuka yang dibangun wajib memenuhi:
- **4 State Wajib:** Loading skeleton, Empty state informatif (dengan aksi), Error state ramah, dan Normal/Success state.
- **Tipografi & Keterbacaan:**
  - Body text minimal 14–16px (web/desktop) atau 14–16sp (mobile) dengan line-height proporsional.
  - Label form selalu berada di atas input (bukan sekadar placeholder yang hilang saat diketik).
- **Aksi & Kontras:**
  - Maksimal 1 tombol primary per view/section; tombol sekunder menggunakan varian outline/ghost.
  - Aksi destruktif (hapus permanen) wajib meminta konfirmasi dialog terpisah dengan indikator bahaya yang jelas.
  - Rasio kontras teks memenuhi standar minimal WCAG AA (minimal 4.5:1 untuk teks normal).

### 3. Pemilihan Framework & Adapter Teknis
- **Web dengan Tailwind CSS:** Terapkan standar utilitas, mobile-first, dan tabel responsive yang tercantum di `references/web.md#A-Tailwind-CSS`.
- **Web dengan Bootstrap / Laravel Blade:** Terapkan komponen native, helper class, dan modal dialog yang tercantum di `references/web.md#B-Bootstrap-5`.
- **Flutter / React Native / Compose:** Terapkan zona ibu jari (thumb-zone) dan safe-area insets sesuai `references/mobile.md`.
- **Desktop (Electron / Tauri / Native):** Terapkan shortcut keyboard (`F1`-`F12`, `Esc`) dan penanganan barcode/printer sesuai `references/desktop.md`.

---

## Format Keluaran Arsitektur UI

Saat merancang atau mengimplementasikan UI, sertakan ringkasan keputusan antarmuka berikut:

```text
Archetype & Platform : [Admin Panel Web / Landing Page / Mobile Kasir / Desktop App]
Framework Styling    : [Tailwind CSS / Bootstrap 5 / Flutter / Native]
Area Interaksi Utama :
- Shell Layout       : [Sidebar fixed + topbar + main / Bottom navigation / Split view]
- State Terpasang    : Loading (Skeleton) | Empty (CTA) | Error (Alert/Toast) | Success
- Navigasi Akses     : [Keyboard shortcut / Touch target >= 48px / Tab focus ring]
Pencegahan Slop      : [Bebas gradien generik, tombol fungsional murni, no fake claims]
```

## Integrasi Pipeline

- **`mini-prd` & `write-tech-spec`:** Menentukan jenis platform, peran pengguna, dan stack teknologi target.
- **`guideline-guard`:** Memvalidasi bahwa kode UI aman (sanitasi output cegah XSS, proteksi CSRF form).
- **`antislop-ui`:** Memfilter efek visual tren AI generik yang merusak profesionalitas desain.
- **`deterministic-verify`:** Menjalankan linter CSS, pemeriksaan a11y, dan uji E2E browser/platform.
