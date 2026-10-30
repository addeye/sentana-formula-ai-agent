---
name: deterministic-verify
description: Jalankan pengujian, compiler, linter, dan static analyzer independen untuk memvalidasi perubahan kode. Gunakan untuk run test, verifikasi fitur, jalankan test, cek linter, atau uji regresi.
---

# Deterministic Verify

Modul Independent Verification: validasi perilaku kode menggunakan tooling yang dapat diulang secara mekanis, bukan sekadar opini atau klaim AI bahwa kode "sudah benar".

## Alur

1. Baca kontrak/scope (`AC-*`) jika ada, spesifikasi target, dan dependensi terkait. Petakan setiap kriteria keberhasilan ke skenario pengujian konkret (happy path, edge case, error handling).
2. Deteksi tooling pengujian dan analisis yang tersedia di repositori:
   - Test runner (misal `phpunit`, `pest`, `vitest`, `jest`, `pytest`, `go test`, `cargo test`).
   - Compiler & type-checker (misal `tsc`, `mypy`, `go vet`).
   - Linter & static analyzer (misal `eslint`, `phpstan`, `pint`, `ruff`, `golangci-lint`).
   - Cek batasan eksekusi: jangan menjalankan perintah berbahaya atau berdampak pada basis data/service produksi.
3. Untuk perbaikan bug (regression testing):
   - Prioritaskan membuat skenario uji yang mereproduksi masalah (gagal sebelum perbaikan).
   - Pastikan uji tersebut berhasil (lulus) setelah perbaikan diterapkan tanpa merusak test lain.
4. Jika repositori belum memiliki test suite atau runner:
   - Tinggalkan minimal SATU runnable self-contained assert check atau skrip verifikasi minimal tanpa memasang framework testing berlebih jika tidak diminta.
   - Cantumkan cara menjalankan skrip verifikasi tersebut beserta expected output-nya.
5. Jalankan eksekusi verifikasi:
   - Jalankan tool secara terarah pada file/suite yang terdampak.
   - Catat command aktual, working directory, exit code, serta snapshot output/log kegagalan.
6. Evaluasi dan Integritas Pengujian:
   - Dilarang keras menghapus test yang gagal, melemahkan assertion, atau melakukan mock berlebihan semata-mata agar status terlihat hijau.
   - Jika terjadi kegagalan (FAIL): analisa akar masalah, perbaiki implementasi dalam batas scope, atau laporkan kendala ke user.
   - **Dilarang melakukan rollback otomatis** terhadap codebase atau file milik user tanpa persetujuan eksplisit.
7. Nyatakan status dengan jujur:
   - `PASS`: Tooling dieksekusi, exit code 0, dan assertion valid.
   - `FAIL`: Tooling dieksekusi, ada kegagalan assertion, compiler error, atau linter error.
   - `BLOCKED`: Eksekusi terhalang dependensi lingkungan, kredensial, atau izin user.
   - `NOT RUN`: Skenario atau kriteria yang belum/tidak dieksekusi (jangan diklaim PASS).

## Format Keluaran

```text
Target Verifikasi: [Fitur / Bug / Task / File]
Lingkungan / Tool Terdeteksi: [Runner / Compiler / Linter]

Hasil Eksekusi:
1. Command: `[perintah yang dijalankan]`
   - Status: PASS / FAIL / BLOCKED / NOT RUN
   - Exit Code: [0 / 1 / ...]
   - Log Ringkas: [Output eksekusi, runtime, assertion count]
   - Kriteria Terkait: [AC-01, AC-02]

2. Self-Check / Regression Test:
   - Lokasi: `[path/to/test_or_assert_check]`
   - Skenario: [Kasus yang diuji]
   - Hasil: [Reproduksi gagal -> Lulus setelah fix]

Ringkasan Hasil:
- Lolos: [Jumlah]
- Gagal: [Jumlah]
- Tidak Dijalankan: [Jumlah]
```

## Batas & Kejujuran Verifikasi

- Utamakan pemeriksaan yang dapat diulang; tidak semua tool deterministik. Catat versi tool, seed, layanan eksternal, timeout, dan flakiness yang memengaruhi hasil. Jangan mengulang hanya untuk menyembunyikan kegagalan.
- Exit code 0 saja tidak cukup: periksa test discovery, jumlah test, skip, dan assertion. Suite tanpa test yang relevan bukan PASS acceptance criteria. Linter/formatter tidak membuktikan perilaku bisnis.
- Baca script konfigurasi sebelum menjalankannya; gunakan mode check tanpa auto-fix untuk audit. Jangan memasang tool atau mengubah konfigurasi tanpa persetujuan. Dalam audit read-only, usulkan test tanpa menulis file.
- Bandingkan baseline jika tersedia untuk membedakan kegagalan lama dari regresi; baseline gagal tetap dilaporkan. Jangan mengklaim reproduksi sebelum fix bila tidak dijalankan.
- Tooling mekanis membantu independensi, tetapi test buatan AI dapat mengulang asumsi salah. Turunkan expected result dari kontrak atau contoh terkonfirmasi, bukan menyalin implementasi. Review manusia diperlukan untuk aturan berisiko tinggi.
- Test hijau membuktikan bahwa skenario yang diuji terpenuhi; test hijau **bukan** bukti mutlak bahwa kode 100% bebas dari celah keamanan, race condition, atau bug di luar cakupan test suite.
- Teruskan data eksekusi konkret ke modul `evidence-receipt` untuk kompilasi bukti akhir.
