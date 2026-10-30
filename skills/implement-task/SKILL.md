---
name: implement-task
description: Kerjakan task .agents/TASKS.md dengan kontrak scope, panduan keamanan, verifikasi aktual, dan bukti sebelum Done. Gunakan untuk kerjakan task, lanjutkan implementasi, atau mulai coding task.
---

# Implement Task

Orkestrator implementasi, bukan definisi tandingan aturan bisnis atau gate kualitas.

## Alur

1. Baca instruksi proyek, seluruh .agents/TASKS.md, spesifikasi terkait, dan HANDOFF.md jika tersedia. Periksa kode, status repositori, dan perubahan pengguna sebelum memodifikasi file. Jika task list tidak ada, minta target atau tawarkan penyusunan task; jangan membuatnya atau memilih pekerjaan lain diam-diam.
2. Hormati task eksplisit user. Untuk permintaan task berikutnya, pilih task siap dikerjakan berdasarkan dependensi dan prioritas yang tercatat; klarifikasi jika pilihan ambigu. Jangan berpindah ke task lain ketika target terblokir tanpa izin. Periksa dependensi, blocker, dan approval yang diwajibkan sebelum mulai.
3. Gunakan spec-contract untuk menetapkan scope/AC dan guideline-guard untuk aturan arsitektur/security. Muat modul tersebut bila tersedia. Jangan mendefinisikan kontrak tandingan, mengarang path, atau menganggap daftar file awal lengkap. Klarifikasi ambiguitas berisiko dan minta persetujuan perluasan scope sebelum mengubahnya.
4. Set In Progress ketika implementasi benar-benar dimulai. Lakukan perubahan terarah dengan pola proyek, validasi pada batas kepercayaan, encoding sesuai konteks, otorisasi objek/tenant, query aman, dan konsistensi data sesuai risiko. Jangan menambahkan abstraksi/dependency atau mengubah kebijakan keamanan tanpa alasan dan persetujuan yang diperlukan.
5. Gunakan deterministic-verify untuk pemeriksaan aktual. Periksa command/script dan dampaknya sebelum menjalankan; command proposed/TBD bukan bukti kesiapan eksekusi. Jalankan gate wajib yang relevan dan petakan hasil ke AC. Jangan menghapus test, melemahkan assertion, atau menelan error agar hijau. Perbaiki kegagalan dalam scope atau laporkan; jangan rollback pekerjaan pengguna otomatis.
6. Gunakan evidence-receipt untuk mencatat command, direktori, hasil, exit code bila tersedia, identitas kode, cakupan AC, dan batas pemeriksaan. PASS memerlukan pemeriksaan relevan, bukan exit code 0 saja. FAIL, BLOCKED, dan NOT RUN tetap ditampilkan apa adanya. Setelah kode berubah, jalankan ulang pemeriksaan terdampak.
7. Perbarui hanya task/bukti terkait, pertahankan ID, dependensi, catatan, dan perubahan pengguna. Jangan melakukan commit/push atau melanjutkan task di luar izin. Saat sesi berakhir, tawarkan project-handoff bila diperlukan.

## Status dan gate

- Todo: belum dimulai. Jika dependensi belum siap, laporkan alasan; tandai Blocked bila memang menghalangi target aktif.
- In Progress: implementasi/perbaikan sedang berjalan; test gagal tidak otomatis berarti hambatan eksternal.
- Blocked: prasyarat, izin, lingkungan, atau keputusan menghalangi pekerjaan; catat cara membukanya.
- In Review: perubahan tersedia tetapi verifikasi atau approval wajib belum lengkap.
- Done: seluruh AC dan gate wajib relevan lulus, dependensi selesai, dan approval yang diwajibkan tersedia. Parent baru Done setelah seluruh anak wajib dan AC integrasinya terpenuhi.

Gate gagal atau belum dijalankan tidak boleh menjadi PASS. Jangan menurunkan requirement/gate untuk mengejar Done. Status implementasi dan status pemeriksaan berbeda: misalnya In Review dapat memiliki pemeriksaan NOT RUN. Laporkan Done lama tanpa bukti sebagai gap, jangan mengarang bukti.

## Keluaran

```text
Task dan status akhir: ...
Scope dan file berubah: ...
AC dan bukti: command/check | direktori | status | exit code | hasil aktual | versi kode
Gate belum terpenuhi / approval tertunda: ...
Risiko dan langkah berikutnya: ...
```

## Integrasi dan batas

Modul pendukung memiliki aturan rinci masing-masing; orkestrator merujuknya, bukan menyalin template lengkap. Jika modul tidak tersedia, laporkan keterbatasan dan tetap lakukan minimum: kontrak scope/AC yang jelas, inspeksi keamanan sesuai risiko, pemeriksaan aktual yang diizinkan, serta bukti jujur. Ketidaktersediaan tool/skill tidak menghapus gate wajib.

Patuhi mode sesi dan izin. Dalam plan/read-only, sajikan rencana tanpa menulis kode maupun status task. Tidak otomatis memasang tool, menjalankan migrasi atau operasi produksi, menghapus file, reset/stash/checkout, commit, atau push. Menulis task atau laporan bukan bukti bahwa implementasi selesai.
