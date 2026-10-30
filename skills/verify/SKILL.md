---
name: verify
description: Kompatibilitas wrapper untuk verifikasi task/fitur. Mengarahkan pemeriksaan ke guideline-guard (inspeksi/keamanan), deterministic-verify (test runner/linter), dan evidence-receipt (pencatatan bukti).
metadata:
  opencode/autoinvoke: false
---

# Verify (Compatibility Wrapper)

Pintu kompatibilitas ke pipeline verifikasi yang dapat diaudit. Bukan penilaian AI mandiri atau pengganti bukti mekanis.

## Alur

1. Baca permintaan, instruksi proyek, seluruh .agents/TASKS.md, dan spesifikasi terkait jika ada. Verifikasi dapat dijalankan pada task `In Progress`, `In Review`, atau `Done`. Jangan memaksa hanya memilih task yang sudah berstatus `Done`.
2. Periksa kode dan dependensi terkait:
   - Gunakan `guideline-guard` untuk memeriksa arsitektur, security baseline, dan kepatuhan diff.
   - Gunakan `deterministic-verify` untuk menjalankan compiler, linter, static analyzer, dan test suite proyek secara aktual.
   - Gunakan `evidence-receipt` untuk menyusun bukti eksekusi dan mencatat status `AC-*`.
3. Evaluasi hasil secara jujur:
   - `PASS`: Tooling dieksekusi dengan exit code 0 dan assertion valid membuktikan kriteria.
   - `FAIL`: Ada error, pelanggaran security, atau test yang gagal.
   - `BLOCKED`: Pemeriksaan terhalang dependensi atau izin.
   - `NOT RUN`: Skenario yang belum/tidak dieksekusi.
4. Jangan menimpa `.agents/REVIEW.md` tanpa izin. Jangan mengubah status di `.agents/TASKS.md` menjadi `Done` secara sepihak jika verifikasi belum lulus atau bukti belum dicatat.

## Keluaran

Sajikan hasil verifikasi mengikuti standar `evidence-receipt`:
- Task / Fitur yang diverifikasi.
- Pemeriksaan keamanan & arsitektur (`guideline-guard`).
- Bukti eksekusi nyata (`deterministic-verify`): command, exit code, log ringkas.
- Status Acceptance Criteria (`AC-*`): PASS / FAIL / BLOCKED / NOT RUN.
- Risiko tersisa dan rekomendasi tindakan.

## Integrasi

Jika modul pipeline tersedia, arahkan ke:
- `guideline-guard` untuk audit kode dan celah keamanan.
- `deterministic-verify` untuk eksekusi test runner.
- `evidence-receipt` untuk laporan audit bukti akhir.
