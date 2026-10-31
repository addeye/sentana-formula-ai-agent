---
name: git-workflow
description: Kelola commit, push, branch, dan pull request dengan Conventional Commits sesuai kebijakan proyek solo atau tim. Gunakan untuk commit, push, buat branch, atau buka PR.
---

# Git Workflow

Satu alur adaptif, tanpa memaksakan PR pada solo dev atau direct push pada tim. Skill mengarahkan agent; branch protection dan CI tetap enforcement utama.

## Alur

1. Baca instruksi proyek (AGENTS.md/CONTRIBUTING.md), permintaan user, status Git, branch, staged/unstaged diff, file untracked yang relevan, dan remote/upstream. Inspeksi read-only terlebih dahulu. Tanpa repo atau remote, jelaskan dan minta target/izin yang belum tersedia; jangan membuat repo publik otomatis.
2. Tentukan kebijakan dari aturan proyek dan pilihan eksplisit user. Mode team memakai feature branch dan PR; mode solo boleh commit pada branch aktif dan direct push jika kebijakan mengizinkan. Nama main, jumlah branch, atau permintaan commit saja TIDAK membuktikan proyek solo. Branch protection/ruleset yang berlaku tidak boleh dilewati. Jika kebijakan tidak diketahui dan akan push ke branch utama, tanyakan direct push atau branch/PR. Jangan menambah file konfigurasi mode hanya untuk pilihan sesi.
3. Batasi tindakan pada izin: "commit" tidak mengizinkan push/PR; "commit dan push" mengizinkan keduanya untuk target yang jelas. Izin membuat PR mencakup operasi pendukung yang jelas diperlukan, tetapi klarifikasi repo/base/head yang ambigu. Tidak perlu konfirmasi ulang pesan commit biasa setelah instruksi eksekusi yang jelas. Dalam plan/read-only, hanya tampilkan draft tanpa mutasi Git.
4. Review isi perubahan, termasuk staged diff dan file baru, bukan hanya nama file/statistik. Cari secret, data pelanggan, artefak sensitif, file sementara, dan perubahan tak terkait. Jangan mengklaim inspeksi sederhana sebagai security scan lengkap. Jika secret ditemukan, hentikan publikasi dan laporkan tanpa menampilkan nilainya; jika sudah terpapar, sarankan rotasi dan penanganan terpisah. Jangan otomatis menghapus pekerjaan pengguna atau menambah ignore yang menyembunyikan source sah.
5. Siapkan commit atomik dengan staging path/hunk terarah. Jangan git add . secara membabi buta. Pertahankan staging pengguna; jika perubahan staged mencampur tujuan atau kepemilikannya tidak jelas, klarifikasi sebelum unstage/commit. Jalankan git diff --cached --check dan gate proyek yang relevan jika diizinkan. Catat FAIL/BLOCKED/NOT RUN apa adanya. Commit WIP lokal tidak berarti siap merge/rilis; ikuti gate proyek dan jangan bypass hook.
6. Pada team mode, gunakan branch fitur yang sudah sesuai atau buat branch baru hanya bila diperlukan/diizinkan; jangan memaksa branch baru untuk setiap commit. Tentukan base dari kebijakan/target nyata, bukan asumsi main. Jangan memindahkan perubahan kotor antarbranch, pull, rebase, reset, stash, amend, cherry-pick, force push, menghapus branch, atau mengubah proteksi tanpa izin terpisah. Jika remote menolak push karena divergen, hentikan dan laporkan; jangan otomatis menulis ulang riwayat.
7. Commit dengan standar di bawah; push hanya ke remote/branch terkonfirmasi jika diminta. Untuk GitHub PR, periksa auth, repo, base/head, dan PR existing agar tidak duplikat. Isi PR dari diff dan bukti aktual: ringkasan, AC, seluruh status pemeriksaan termasuk gagal/belum diuji, risiko, dan kebutuhan reviewer. Gunakan draft bila belum siap dan sesuai izin; jangan menyamarkan WIP menjadi ready. Tidak otomatis merge, approve sendiri, menutup issue, atau menandai task Done.
8. Laporkan hasil aktual: commit hash, branch, remote/PR URL bila berhasil, hasil pemeriksaan, dan pekerjaan yang masih lokal. Push berhasil bukan bukti test lulus, CI selesai, approval diperoleh, atau deploy berhasil. Jangan mengubah HANDOFF/TASKS tanpa permintaan atau aturan proyek yang mengizinkan.

## Standar commit

Utamakan konvensi existing yang eksplisit; jangan diam-diam mengganti standar tim. Jika belum ada, gunakan Conventional Commits:

```text
<type>(<scope opsional>)< ! opsional>: <ringkasan imperatif>

<body opsional: alasan dan dampak>

Refs: <task/issue yang benar-benar terkait>
BREAKING CHANGE: <dampak dan migrasi bila relevan>
```

Tanda breaking ditulis menempel, misalnya `feat(api)!: change response schema`, bukan spasi literal dari placeholder. Type umum: feat, fix, refactor, test, docs, chore, build, ci, perf, revert. Gunakan type/scope huruf kecil; pertahankan kapitalisasi identifier/nama produk, tanpa titik akhir judul. Body dan bahasa mengikuti tim/user; tidak wajib seluruh deskripsi lowercase. Pilih type berdasarkan dampak, bukan ekstensi file semata.

Referensi task/issue hanya bila tersedia, jangan mengarang ID. Gunakan Refs untuk hubungan biasa; Closes/Fixes GitHub hanya bila penutupan issue memang dimaksudkan dan diizinkan. Atomic commit adalah satu tujuan logis, bukan harus satu file. Jangan mewajibkan estimasi atau log lengkap pada setiap commit; rujuk evidence yang tersedia.

## Keluaran

```text
Mode/kebijakan dan sumber: ...
Scope/file yang disertakan: ...
Pesan commit atau hash aktual: ...
Pemeriksaan: command/check | PASS/FAIL/BLOCKED/NOT RUN | hasil
Branch dan tujuan push: ...
PR: URL atau belum dibuat
Risiko / perubahan tersisa / langkah berikutnya: ...
```

## Integrasi

spec-contract/create-issues memberi scope dan ID; deterministic-verify/evidence-receipt memberi bukti; implement-task mengelola status task; project-handoff mengelola checkpoint. Skill ini tidak menduplikasi kepemilikan tersebut dan tidak mensyaratkan semuanya tersedia. Bukti tidak tersedia harus dinyatakan, bukan dibuat-buat. Tidak memasang hook, commitlint, CI, atau konfigurasi Git global tanpa permintaan.
