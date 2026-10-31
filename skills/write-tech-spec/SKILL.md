---
name: write-tech-spec
description: 'Buat atau tinjau technical specification di .agents/TECH-SPEC.md dari PRD, bug report, atau brief terbatas. Gunakan saat user meminta tech spec, spesifikasi teknis, implementation plan, atau perencanaan teknis sebelum coding.'
---

# Write Tech Spec

## Batas kerja dan keamanan file
- Output kanonis: `.agents/TECH-SPEC.md`. Permintaan baca/load hanya membaca dan merangkum.
- Baca file tujuan yang sudah ada secara penuh. Pertahankan ID, keputusan, dan pekerjaan user; minta persetujuan sebelum penggantian destruktif, perubahan requirement, atau perubahan arsitektur.
- Tulis hanya jika diminta dan diizinkan. Dalam plan mode/read-only yang melarang penulisan, sajikan draft di percakapan.
- Pembuatan spec bukan eksekusi: jangan menjalankan setup, migrasi, build, test, atau deployment. Inspeksi repo read-only diperbolehkan sesuai izin lingkungan.
- Akhiri dengan status draft, blocker, dan permintaan review/persetujuan. Jangan otomatis membuat task atau kode; persetujuan spec saja bukan permintaan tahap berikutnya.
- Tidak ada kuota bab, stack default, atau kata wajib untuk melanjutkan.

## Alur
1. Baca `.agents/PRD.md` jika tersedia; PRD diutamakan. Bug atau perubahan terbatas boleh memakai brief langsung yang cukup jelas tanpa mewajibkan PRD baru. Jika acuan tidak cukup atau saling bertentangan, tanyakan scope yang berlaku.
2. Temukan konteks repo: instruksi proyek, manifest/lockfile, konfigurasi, kode terkait, pola arsitektur, penyimpanan, test, dan CI. Catat path sumber. Tidak adanya satu jenis manifest bukan bukti proyek kosong.
3. Terapkan protokol versi berikut sebelum menetapkan stack:
   - Proyek yang sudah ada: baca manifest/lockfile dan pertahankan versi yang berjalan, kecuali upgrade diminta eksplisit.
   - Proyek baru atau user meminta teknologi tanpa versi spesifik: dilarang menebak nomor versi dari ingatan (knowledge cutoff). Periksa rilis latest stable resmi melalui registry atau dokumentasi bila tool tersedia (`composer show <pkg> --available`, `npm view <pkg> version`, PyPI, websearch).
   - Bila tool registry/network tidak tersedia atau verifikasi tidak meyakinkan: catat versi sebagai `[Versi target: TBD; latest stable belum terverifikasi]` dan tanyakan versi target ke user, bukan berasumsi.
   - Gunakan pencarian untuk menemukan sumber, bukan sebagai bukti tunggal. Konfirmasi versi pada release notes/support policy resmi dan registry. Bedakan framework dari template scaffolding; jangan salah menganggap versi skeleton sebagai versi framework. Kecualikan alpha/beta/RC/dev kecuali diminta. Dist-tag seperti latest adalah petunjuk, bukan bukti dukungan atau kompatibilitas.
   - Catat paket, versi kandidat eksak, URL sumber, tanggal pemeriksaan, status stable/support, serta kebutuhan runtime dan dependency utama. Cocokkan dengan hosting, runtime, DB/driver, plugin kritis, dan batasan user. Latest stable belum tentu kompatibel; bila konflik, tampilkan kandidat dan trade-off untuk persetujuan, jangan diam-diam downgrade atau upgrade.
   - Pemeriksaan hanya read-only: jangan install/update dependency atau mengubah lockfile. Command contoh harus disesuaikan dengan tool tersedia; jangan mengklaim sudah dijalankan. Jika sumber bertentangan, tandai TBD dan blocker bagian terdampak; spec lain boleh tetap disusun.
   - Versi yang sudah dipilih user dihormati, tetapi status dukungan dan kompatibilitas tetap diperiksa bila memungkinkan. Pemilihan versi lama/EOL harus disertai risiko dan keputusan eksplisit, bukan diberi label latest.
   - Bedakan pilihan yang disetujui dari usulan; jangan mengarang stack, auth, hosting, atau target NFR.
4. Bedakan observasi terkonfirmasi, keputusan disetujui, asumsi, dan TBD. Klarifikasi hanya ketidakpastian penting. Risiko yang memengaruhi scope, keamanan, integritas data, atau kompatibilitas memblokir persetujuan bagian terdampak; jangan menyamarkan asumsi sebagai solusi final.
5. Rancang core vertical slice terkecil yang memberi hasil end-to-end. Gunakan bagian berikut secukupnya; bagian tidak relevan boleh dihilangkan dengan alasan.

## Isi spec
- **Scope dan sumber:** intent, perilaku saat ini/yang diharapkan, aturan bisnis, MVP/out of scope, FR/AC hulu atau ID brief lokal seperti `BR-01`. Pertahankan ID lama; jangan menciptakan FR seolah berasal dari PRD yang tidak ada.
- **Desain minimal:** komponen/file terdampak, alur utama dan kegagalan, batas integrasi, keputusan serta alasan singkat. Hindari lapisan, layanan, atau dependency yang tidak diperlukan.
- **Kontrak interface:** input/output, validasi trust boundary, format error dan perilaku kompatibilitas untuk API, CLI, library, UI, atau event yang relevan. Detail yang menentukan implementasi tidak ditunda tanpa penanda TBD.
- **Data dan state bila relevan:** model, constraint/invariant, transisi state, batas transaksi dan kegagalan parsial. Bahas konkurensi, urutan operasi, retry, dan idempotensi bila ada risiko aksi ganda/race; pilih kontrol yang sesuai, bukan lock wajib. Migrasi mencakup kompatibilitas data lama, rollout, rollback atau restore, dan cara memeriksa pemulihan.
- **Keamanan:** ancaman sesuai trust boundary dan aset nyata, kontrol input, akses/kepemilikan data, rahasia, serta kegagalan kontrol yang perlu diuji. Auth/tenant hanya jika relevan. Jangan menghilangkan pembahasan ancaman hanya karena tidak ada transaksi atau backend.
- **Risiko dan blocker:** pertanyaan terbuka, dampak, bagian terdampak, keputusan yang dibutuhkan, dan mitigasi. NFR terukur hanya mengikuti target yang disepakati; lainnya TBD.
- **Peta verifikasi:** gunakan ID spec stabil seperti `SPEC-01` dan AC scoped `SPEC-01/AC-01`. Petakan FR/AC atau brief ke desain, skenario sukses/gagal, metode uji, dan kondisi lulus yang teramati. Sertakan pemeriksaan regresi, keamanan, konkurensi, serta pemulihan hanya bila relevan.
- **Perintah:** tulis perintah setup/verifikasi beserta direktori kerja dan sumber script/konfigurasinya. Label `Terkonfirmasi dari proyek, belum dijalankan` atau `[Proposed, belum dijalankan]`; gunakan TBD jika perintah belum diketahui. Jangan mengklaim keberadaan script berarti pengujian sudah lulus. Sertakan langkah manual konkret bila otomatisasi belum tersedia.

## Integrasi opsional, tanpa duplikasi
Skill ini mandiri; jangan memasang atau mewajibkan skill lain.
- `spec-contract` memiliki kontrak intent/scope; rujuk kontrak dan FR/AC yang ada, jangan membuat baseline tandingan.
- `guideline-guard` memiliki audit guideline arsitektur dan keamanan; spec mencatat aturan relevan dan konflik untuk diselesaikan, bukan mengklaim audit sudah lulus.
- `deterministic-verify` memiliki eksekusi verifikasi saat implementasi; spec hanya menyediakan peta uji dan perintah.
- `evidence-receipt` memiliki laporan bukti hasil; spec menetapkan kriteria lulus, bukan bukti eksekusi.
