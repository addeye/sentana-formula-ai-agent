---
name: create-issues
description: 'Buat atau perbarui daftar tugas lokal di .agents/TASKS.md dari Tech Spec atau brief bug/perubahan. Gunakan saat user meminta buat task, tambah task, pecah task, breakdown pekerjaan, atau detailkan task; bukan untuk mengeksekusi implementasi.'
---

# Create Issues

## Batas kerja dan keamanan file
- Output kanonis: `.agents/TASKS.md`, bukan issue remote. Permintaan baca/load hanya membaca dan merangkum.
- Baca seluruh file tujuan sebelum mengubahnya. Append atau update terarah; pertahankan ID, status, dependensi, bukti, dan catatan kerja user. Jangan menomori ulang, memakai ulang ID, atau menggandakan pekerjaan yang sudah terdaftar.
- Minta persetujuan sebelum penggantian destruktif, penghapusan pekerjaan, atau perubahan requirement. Jika status lama tidak dikenal, pertahankan dan tanyakan pemetaannya.
- Tulis hanya jika diminta dan diizinkan. Dalam plan mode/read-only yang melarang penulisan, sajikan draft di percakapan.
- Skill ini hanya menghasilkan task. Jangan menjalankan implementasi, setup, migrasi, atau pengujian; jangan menandai pekerjaan selesai karena task sudah ditulis.
- Serahkan daftar dan blocker untuk review/persetujuan. Persetujuan daftar bukan izin otomatis coding; tunggu permintaan implementasi.

## Alur
1. Baca `.agents/TASKS.md`, spec `.agents/TECH-SPEC.md`, PRD dan aturan repo yang relevan jika tersedia. Brief bug/perubahan terbatas boleh langsung menjadi acuan. Jika sumber kosong atau bertentangan, tanyakan scope, jangan mengarang requirement.
2. Periksa kode, manifest, konfigurasi, test, dan tooling terkait secara read-only. Pertahankan arsitektur. Jangan menganggap proyek kosong karena satu manifest tidak ada; setup ditambahkan hanya bila memang diperlukan.
3. Susun vertical feature slices dengan hasil end-to-end, bukan daftar lapisan teknis tanpa hasil teruji. Task infrastruktur, setup, migrasi, backend, CLI, dokumentasi, dan non-UI tetap sah bila diperlukan oleh scope.
4. Pecah slice menjadi langkah atomik. Berhenti ketika tindakan, batas perubahan, prasyarat, dan hasil lulus sudah jelas: bisa dikerjakan setelah dependensinya terpenuhi dan dicek secara terpisah. Jangan memecah tanpa akhir atau membuat file/function task hanya demi kuota.
5. Gunakan ID hierarkis stabil, misalnya `T-01` dan `T-01.1`, melanjutkan konvensi existing. Parent mengelompokkan hasil; relasi parent bukan dependensi siklik. Parent baru selesai setelah seluruh anak wajib dan AC integrasinya terpenuhi.
6. Bangun dependency DAG: setiap referensi menunjuk ID yang ada, tanpa duplikasi ID/pekerjaan, self-dependency, atau siklus. Urutkan sesuai prasyarat; bila DAG existing rusak, laporkan dan minta keputusan sebelum mengubah hubungan yang sudah disepakati.
7. Validasi cakupan requirement dan AC. Pisahkan fakta, asumsi, dan TBD. Keputusan kritis belum terjawab menjadi blocker dengan pertanyaan dan bagian terdampak, bukan estimasi waktu rekaan. Estimasi opsional hanya dari user, dengan sumbernya.

## Isi setiap task
- **ID dan judul:** tindakan konkret serta hasilnya.
- **Scope:** deskripsi, batas perubahan, target file/modul yang diketahui; path usulan ditandai usulan.
- **Sumber:** referensi scoped seperti `FR-01/AC-01`, `SPEC-01/AC-01`, atau section spec existing. Untuk brief tanpa dokumen hulu gunakan ID lokal seperti `BR-01`, jangan mengarang FR hulu.
- **Acceptance criteria task:** ID scoped seperti `T-01.1/AC-01`, kondisi sukses/gagal yang teramati dan pemetaannya ke AC sumber. Task pendukung infra merujuk kebutuhan/slice yang dibantu, bukan FR fiktif.
- **Dependensi:** ID prasyarat eksplisit; prasyarat eksternal dan keputusan terbuka dicatat sebagai blocker, bukan ID task palsu.
- **Verifikasi:** perintah nyata beserta direktori kerja dan sumber script/konfigurasi; label `Terkonfirmasi dari proyek, belum dijalankan`. Perintah belum tersedia diberi `[Proposed, belum dijalankan]` atau TBD. Jangan menyajikan perintah contoh sebagai fakta. Sertakan langkah manual, input/prasyarat, hasil yang diharapkan, dan gate wajib yang relevan.
- **Status dan bukti:** status, alasan blocker bila ada, serta tempat mencatat hasil aktual/rujukan bukti. Pada task baru, bukti tetap `Belum dijalankan`.

## Status dan gate Done
- `Todo`: belum dikerjakan; eksekusi menunggu prasyarat terpenuhi.
- `In Progress`: implementasi benar-benar sedang berjalan, bukan sedang menyusun daftar.
- `Blocked`: ada hambatan; catat penyebab, dampak, dan keputusan/tindakan untuk membukanya.
- `In Review`: perubahan tersedia tetapi verifikasi atau approval masih menunggu.
- `Done`: semua AC task dan gate wajib yang relevan lulus, dependensi selesai, dan approval yang diwajibkan diperoleh.

Bukti Done wajib memuat perintah/check yang benar-benar dijalankan, hasil aktual dan exit code bila tersedia, cakupan AC yang dibuktikan, serta rujukan hasil/approval. Test, build, lint, security check, atau manual check wajib tidak dapat saling menggantikan hanya karena salah satunya lulus. Gate gagal atau belum dijalankan tidak boleh dinyatakan lulus. Pengecualian membutuhkan keputusan eksplisit atas requirement/gate, tercatat bersama risiko; jangan menurunkan gate diam-diam. Pertahankan status existing tanpa memalsukan bukti; laporkan Done lama yang belum memiliki bukti sebagai gap review.

## Integrasi opsional, tanpa duplikasi
Skill ini mandiri; jangan memasang atau mewajibkan skill lain.
- `spec-contract` memiliki baseline scope/AC; task merujuk baseline, tidak mendefinisikan kontrak tandingan.
- `guideline-guard` memiliki audit arsitektur/keamanan; cantumkan gate relevan untuk fase implementasi, bukan klaim audit saat task generation.
- `deterministic-verify` memiliki eksekusi verifikasi; task hanya merencanakan check dan kondisi lulus.
- `evidence-receipt` memiliki laporan bukti serah terima; task menyediakan rujukan AC dan tempat bukti, tanpa laporan hasil fiktif.
- `task-board` menyediakan visualisasi Kanban lokal (.agents/board.html) untuk review status task dan catatan reviewer.
