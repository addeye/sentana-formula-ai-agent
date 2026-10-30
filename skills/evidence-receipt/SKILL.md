---
name: evidence-receipt
description: Laporkan bukti eksekusi, scope perubahan, status acceptance criteria, dan risiko tersisa. Gunakan untuk cetak bukti, audit hasil, bukti verifikasi, atau serah terima pekerjaan.
---

# Evidence Receipt

Modul Evidence. Laporkan hanya bukti yang tersedia, bukan perkiraan hasil atau persetujuan rilis.

## Alur

1. Kumpulkan scope/kontrak jika tersedia dan hasil pemeriksaan aktual. Tidak memerlukan TASKS.md atau tiga modul lain. Tanpa kontrak atau baseline perubahan, nyatakan keterbatasan; jangan mengarang scope.
2. Identifikasi kode yang diperiksa: commit beserta dirty diff dan file untracked yang relevan. Tanpa Git gunakan manifest hash SHA-256 file terkait. Timestamp saja bukan identitas konten; bila identitas tidak tersedia, nyatakan keterbatasannya.
3. Bandingkan perubahan aktual dengan scope yang disetujui. Laporkan deviasi dan persetujuannya, bukan otomatis menganggap semua perubahan dibuat agent.
4. Beri setiap bukti ID, waktu, lingkungan/versi tool, command, working directory, exit code, dan lokasi log jika tersedia. Bedakan eksekusi tool, observasi manual aktual, dan inspeksi AI. Jangan mengklaim klik atau test yang tidak dilakukan.
5. Petakan setiap AC ke bukti dan cakupannya. Exit code 0 tidak cukup jika test tidak ditemukan, di-skip, atau tidak memeriksa kriteria tersebut. Mock bukan bukti integrasi riil.
6. Sensor secret dan data pribadi dari command maupun log. Jangan memalsukan atau mengubah hasil. Simpan log sensitif hanya di lokasi yang diizinkan.
7. Laporkan risiko tersisa, pemeriksaan yang belum dijalankan, area tidak relevan beserta alasan, dan keputusan manusia yang diperlukan. Bukti tidak mencakup perubahan setelah pemeriksaan; jalankan ulang pemeriksaan terdampak.

## Status

- PASS: pemeriksaan aktual lulus untuk cakupan yang disebut.
- FAIL: pemeriksaan menemukan kegagalan.
- BLOCKED: prasyarat atau izin menghalangi pemeriksaan.
- NOT RUN: belum diperiksa.

Status akhir pemeriksaan wajib: FAIL jika ada kegagalan; selain itu BLOCKED jika terhalang; selain itu NOT RUN jika belum lengkap; PASS hanya jika semua pemeriksaan wajib lulus. Tetap tampilkan seluruh status parsial. Penerimaan risiko tidak mengubah FAIL menjadi PASS. Inspeksi AI tidak menggantikan eksekusi yang diwajibkan.

## Keluaran

```text
Target dan scope: ...
Identitas kode / waktu: ...
Lingkungan: ...
Perubahan aktual / deviasi: ...
Bukti E-01: jenis sumber | command/observasi | direktori | exit code | hasil | lokasi log
AC-01: PASS/FAIL/BLOCKED/NOT RUN | bukti | batas cakupan
Status akhir: ...
Risiko tersisa / belum diuji: ...
Keputusan manusia yang diperlukan: ...
```

Template bukan bukti aktual. Isi yang tidak diketahui ditulis tidak tersedia. Tampilkan receipt di percakapan; simpan ke file hanya jika diminta atau diwajibkan alur proyek, tanpa menimpa laporan pengguna. Skill bukan enforcement CI, audit independen lengkap, atau jaminan kode bebas kerentanan.
