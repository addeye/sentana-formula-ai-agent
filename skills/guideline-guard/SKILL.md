---
name: guideline-guard
description: Terapkan aturan arsitektur proyek dan security baseline selama perubahan kode atau audit diff. Gunakan untuk cek guideline, audit security, cek keamanan, review arsitektur, atau pastikan aman.
---

# Guideline Guard

Modul Guide Rails: arahkan implementasi dan temukan pelanggaran dengan bukti lokasi kode. Inspeksi AI bukan audit keamanan independen atau jaminan bebas celah.

## Alur

1. Baca scope/kontrak jika ada, instruksi proyek, konfigurasi tool, dan pola kode terkait. Jika kontrak tidak ada, nyatakan cakupan audit. Bedakan aturan tertulis dari pola yang hanya disimpulkan.
2. Ikuti arsitektur yang ada kecuali terbukti berisiko. Gunakan stdlib, fitur native, atau dependency terpasang; jangan otomatis menambahkan repository, factory, atau lapisan abstraksi. Laporkan konflik aturan dan keamanan sebelum melanjutkan.
3. Petakan input eksternal, data sensitif, aktor, batas tenant, penyimpanan, dan side effect yang disentuh. Pilih pemeriksaan berdasarkan risiko, bukan checklist OWASP sebagai klaim kelengkapan.
4. Periksa area relevan berikut:
   - Validasi tipe, ukuran, rentang, dan format pada batas kepercayaan. Gunakan encoding output sesuai konteks; sanitasi generik bukan pengganti validasi atau pertahanan XSS.
   - Parameter binding SQL, allowlist identifier dinamis, mass assignment, command injection, path traversal, upload, dan SSRF bila permukaan tersebut ada.
   - Authentication dan authorization pada operasi maupun objek, isolasi tenant, least privilege, serta penolakan default. ID valid atau user login tidak membuktikan izin.
   - Secret, data pribadi dalam log/response, konfigurasi produksi, sesi, CSRF, dan kriptografi sesuai konteks. Jangan menyalin secret ke laporan.
   - Error handling yang menjaga kegagalan terlihat tanpa membocorkan detail sensitif; transaksi, concurrency, idempotency, dan rollback migrasi bila relevan. Jangan menelan semua exception.
   - Dependency/lockfile, kompatibilitas, API publik, aksesibilitas UI, dan biaya query jika terdampak.
5. Periksa diff akhir, termasuk file baru dan perubahan di luar scope. Tanpa Git, gunakan perbandingan atau snapshot tersedia dan nyatakan keterbatasannya.
6. Laporkan temuan yang terbukti terpisah dari dugaan yang perlu diuji. Untuk audit saja, jangan memperbaiki kode tanpa izin. Dalam implementasi yang diizinkan, perbaiki dalam scope lalu jalankan pemeriksaan terkait.

## Keluaran

```text
Cakupan dan sumber aturan: ...
Pemeriksaan: aturan | PASS/FAIL/BLOCKED/NOT RUN | bukti lokasi | batas pemeriksaan
Temuan: ID | file:baris | severity | aturan | bukti | dampak | perbaikan
Dugaan yang perlu diuji: ...
Area tidak relevan dan alasan: ...
Risiko tersisa / tindak lanjut: ...
```

Severity CRITICAL/HIGH/MEDIUM/LOW berdasarkan dampak dan kemungkinan eksploitasi, bukan nama kelemahan saja. PASS hanya berarti aturan yang disebut telah diperiksa pada scope tersebut. FAIL berarti pelanggaran terbukti; BLOCKED berarti prasyarat/izin tidak tersedia; NOT RUN berarti belum diperiksa. Area tidak relevan harus beralasan, bukan PASS palsu.

## Batas

- Temuan HIGH/CRITICAL yang belum diselesaikan menghalangi rekomendasi rilis. Persetujuan risiko tidak mengubah hasil FAIL menjadi PASS.
- Jangan memasang tool/dependency, melemahkan konfigurasi keamanan, atau memperluas scope tanpa persetujuan.
- Jangan menjalankan eksploitasi terhadap produksi atau layanan pihak lain. Gunakan lingkungan uji yang diizinkan.
- Teruskan pemeriksaan executable ke `deterministic-verify` bila tersedia. Skill tidak menggantikan enforcement CI atau aturan merge.
