---
name: spec-contract
description: Tetapkan intent, aturan bisnis, scope, risiko, dan acceptance criteria sebelum perubahan kode non-trivial. Gunakan untuk kunci kontrak, tentukan scope, fitur baru, bug kompleks, atau refactor.
---

# Spec Contract

Tujuan: memastikan implementasi mengejar kebutuhan yang dapat diperiksa, bukan asumsi AI. Modul Intent dalam Code Confidence Formula.

## Alur

1. Baca permintaan, instruksi proyek, spesifikasi yang tersedia, dan kode terkait. Telusuri pemanggil, dependensi, model data, serta test yang relevan. Jangan mengklaim memahami seluruh codebase dari beberapa file.
2. Pisahkan kebutuhan terkonfirmasi, asumsi, dan pertanyaan terbuka. Catat sumber berupa instruksi user atau lokasi dokumen/kode. Klarifikasi ambiguitas yang memengaruhi keamanan, data, aturan bisnis, atau kompatibilitas sebelum implementasi.
3. Tetapkan scope perilaku dan perkiraan file yang boleh berubah, konteks read-only, serta hal di luar scope. Daftar file bukan pengganti pemahaman dependensi. Jika perluasan ditemukan, jelaskan alasan dan minta persetujuan sebelum mengubahnya.
4. Beri acceptance criteria ID stabil `AC-01`, `AC-02`, dan seterusnya. Setiap kriteria memiliki kondisi, hasil yang diharapkan, dan rencana pemeriksaan. Cakup happy path, penolakan, serta batas yang relevan; jangan memaksakan jumlah tertentu.
5. Catat batas kepercayaan, aktor/hak akses, isolasi data, side effect, kompatibilitas, dan kebutuhan non-fungsional yang relevan. Jangan mengarang target performa atau persyaratan kepatuhan.
6. Tampilkan kontrak ringkas untuk konfirmasi. Permintaan implementasi dengan persyaratan yang sudah eksplisit dapat menjadi persetujuan; jangan meminta persetujuan ulang tanpa perubahan material. Hentikan bagian yang masih ambigu dan berisiko.

## Keluaran

```text
Intent: ...
Sumber kebutuhan: ...
Aturan bisnis: ...
Scope perilaku dan perkiraan file: ...
Konteks read-only: ...
Di luar scope: ...
Asumsi / pertanyaan terbuka: ...
Risiko dan batasan: ...
AC-01: kondisi | hasil yang diharapkan | cara memeriksa
AC-02: kondisi | hasil yang diharapkan | cara memeriksa
Keputusan / konfirmasi user: ...
```

Kontrak cukup di percakapan. Simpan ke file hanya jika diminta atau diwajibkan alur proyek; jangan menimpa dokumen pengguna. Tidak mensyaratkan TASKS.md, framework, atau tiga modul lain.

## Serah terima dan batas

- Berikan kontrak ke `guideline-guard` untuk panduan, `deterministic-verify` untuk pemetaan pengujian, dan `evidence-receipt` untuk pelaporan bila modul tersebut digunakan.
- Catat perubahan kontrak dan dampaknya terhadap test; jangan diam-diam mengubah expected result agar implementasi terlihat sesuai.
- Kontrak bukan bukti bahwa kode aman atau benar. Bukti memerlukan pemeriksaan aktual.
