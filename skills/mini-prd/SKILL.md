---
name: mini-prd
description: 'Buat atau tinjau PRD di .agents/PRD.md untuk produk atau fitur. Gunakan saat user meminta PRD, ringkasan produk, spesifikasi produk, atau ingin memulai aplikasi.'
---

# Mini PRD

## Batas kerja dan keamanan file
- Output kanonis: `.agents/PRD.md`. Permintaan baca/load hanya membaca dan merangkum.
- Baca file tujuan yang sudah ada secara penuh sebelum mengubahnya. Pertahankan requirement, ID, keputusan, dan pekerjaan user; minta persetujuan sebelum penggantian destruktif atau perubahan requirement.
- Tulis hanya jika diminta dan diizinkan. Dalam plan mode/read-only yang melarang penulisan, sajikan draft di percakapan.
- Selesaikan draft tanpa kuota bagian, persona, cerita, atau pertanyaan; tidak perlu meminta user mengetik kata tertentu untuk melanjutkan.
- Akhiri dengan status draft, pertanyaan tersisa, dan permintaan review/persetujuan. Persetujuan PRD bukan izin otomatis membuat spec, task, atau kode.

## Alur
1. Baca brief, PRD lama, dan sumber relevan yang tersedia. Catat sumber setiap keputusan: pesan user atau path/bagian dokumen. Bedakan fakta terkonfirmasi, observasi repo, asumsi belum disetujui, dan TBD.
2. Klarifikasi sesuai risiko, bukan daftar pertanyaan tetap. Dahulukan masalah, pengguna, batas MVP, aturan bisnis, dan dampak kegagalan yang ambigu. Jangan tanyakan ulang informasi yang sudah ada.
3. Ketidakpastian yang mengubah scope, akses, kehilangan data, atau keberhasilan produk adalah blocker persetujuan bagian terkait. Draft bagian yang aman boleh diteruskan; jangan mengisi kekosongan dengan keputusan rekaan.
4. Susun dokumen berikut secukupnya. Bagian tidak relevan dapat dihilangkan dengan alasan singkat.

## Isi PRD
- **Masalah dan hasil:** pengguna/aktor, kebutuhan nyata, manfaat, indikator keberhasilan serta cara menilainya. Target angka hanya jika disepakati; jika belum, TBD dengan pertanyaan/pemilik keputusan.
- **Scope:** MVP yang disepakati, out of scope, prioritas dan dependensi nyata.
- **Peran dan kepemilikan:** jelaskan hak akses, kepemilikan data, batas organisasi/tenant hanya bila relevan. Jangan menganggap semua proyek SaaS, multi-tenant, memiliki akun, atau perlu autentikasi.
- **Alur dan kegagalan bisnis:** hasil sukses dan ekspektasi saat input salah, konflik, operasi dibatalkan, integrasi gagal, atau aksi diulang jika relevan. Nyatakan apa yang boleh/tidak boleh terjadi bagi pengguna atau bisnis, bukan pilihan database, lock, token, atau stack.
- **Functional requirements:** ID stabil seperti `FR-01`; jangan menomori ulang atau memakai ulang ID lama. Setiap FR memiliki sumber, perilaku/aturan bisnis, input dan hasil yang relevan, serta acceptance criteria teramati dengan ID scoped seperti `FR-01/AC-01`. Sertakan skenario sukses dan kegagalan penting serta kondisi lulusnya.
- **NFR:** hanya kebutuhan relevan. Target terukur harus disepakati beserta kondisi pengukuran dan cara verifikasi; yang belum disepakati ditandai TBD, bukan SLA/latency/kapasitas bawaan. Jangan mengarang auth, keamanan, stack, hosting, atau fitur tambahan.
- **Keputusan terbuka:** asumsi, risiko, blocker, sumber konfirmasi, dan status persetujuan. Asumsi bukan requirement yang sudah disetujui.

## Integrasi opsional, tanpa duplikasi
Skill ini tetap mandiri; jangan memasang atau mewajibkan skill lain.
- `spec-contract` memiliki kontrak scope dan aturan bisnis lintas pekerjaan; gunakan FR/AC PRD sebagai masukan, rujuk kontrak yang ada tanpa membuat versi bersaing.
- `guideline-guard` memiliki pemeriksaan guideline dan baseline keamanan; catat konflik sebagai pertanyaan, jangan diam-diam mengubah requirement.
- `deterministic-verify` memiliki eksekusi verifikasi pada fase implementasi; PRD hanya menyediakan hasil yang harus diuji.
- `evidence-receipt` memiliki laporan bukti hasil; PRD menyediakan kriteria keberhasilan, bukan klaim pengujian sudah lulus.
