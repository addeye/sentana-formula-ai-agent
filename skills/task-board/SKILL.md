---
name: task-board
description: Visualisasikan dan kelola task .agents/TASKS.md secara interaktif via Kanban board lokal (.agents/board.html) untuk review, feedback manusia, dan instruksi agent. Gunakan saat user minta buka board, task board, kanban, lihat task, atau review task interaktif.
---

# Task Board (Interactive Kanban & Review Interface)

Antarmuka Kanban visual berbasis file HTML lokal (`.agents/board.html`) untuk memantau status task, meninjau bukti verifikasi pada task `In Review`, memberikan catatan revisi manusia, dan menyusun instruksi terarah bagi agent tanpa membebani memori chat.

## Batas Kerja dan Keamanan File

- **Single Source of Truth:** File kanonis tetap `.agents/TASKS.md`. Antarmuka `board.html` hanya membaca, memvisualisasikan, dan memperbarui status serta field `Reviewer Feedback` pada task yang bersangkutan.
- **Zero Background Overhead:** Berjalan murni di sisi browser pengguna tanpa database, server background terpisah, atau dependensi npm.
- **Integritas Task:** Dilarang menghapus task secara sepihak dari board. Perubahan status dari `In Review` ke `Done` atau kembali ke `In Progress` dicatat secara transparan bersama catatan feedback.

---

## Alur

### 1. Inisialisasi / Pengecekan Board
1. Periksa apakah `.agents/board.html` sudah ada di direktori kerja proyek.
2. Jika belum ada:
   - Salin file template dari `templates/board.html` yang berada di dalam direktori skill ini ke `.agents/board.html`.
3. Informasikan ke user jalur file lokal tersebut agar dapat langsung dibuka di browser (Chrome / Edge / Firefox):
   - Contoh: `D:\projectskills\sentana-formula\.agents\board.html` (atau cukup klik dua kali pada file tersebut).

### 2. Membaca & Memperbarui dari Browser (Sisi Manusia)
1. Buka `.agents/board.html` di browser.
2. Klik tombol **"📂 Buka .agents/TASKS.md"** untuk memuat daftar task terkini via File System Access API atau pemilih file standar.
3. Reviewer melihat kolom Kanban: `Todo`, `In Progress`, `Blocked`, `In Review`, `Done`.
4. Pada task `In Review`:
   - Buka kartu task untuk memeriksa Acceptance Criteria dan Bukti Verifikasi.
   - **Jika Disetujui:** Klik tombol *Setujui (Done)*.
   - **Jika Ditolak / Butuh Revisi:** Tulis instruksi perbaikan pada kolom *Reviewer Feedback*, lalu klik *Minta Revisi (In Progress)*.
5. Klik **"💾 Simpan ke TASKS.md"** untuk memperbarui file secara langsung di disk.

### 3. Handoff Instruksi ke Agent
1. User dapat mengklik tombol **"📋 Salin Instruksi Agent"** pada board untuk menyalin draf prompt terstruktur ke clipboard.
2. Saat user menempelkan prompt tersebut ke chat agent:
   - Agent membaca `.agents/TASKS.md`.
   - Mengidentifikasi task yang memiliki catatan `Reviewer Feedback`.
   - Menjalankan modul `implement-task` untuk memperbaiki kekurangan sesuai catatan manusia.

---

## Format Keluaran

Saat skill ini dijalankan atau direferensikan dalam percakapan:

```text
Status Board        : Tersedia di .agents/board.html
Sumber Data         : .agents/TASKS.md
Ringkasan Task      :
- Todo              : [Jumlah]
- In Progress       : [Jumlah]
- Blocked           : [Jumlah]
- In Review         : [Jumlah] (Memerlukan review manual)
- Done              : [Jumlah]

Petunjuk Akses      :
1. Buka file `.agents/board.html` di browser Anda.
2. Muat `.agents/TASKS.md` untuk melihat kartu Kanban interaktif.
3. Berikan catatan perbaikan pada task 'In Review' jika diperlukan.
```

---

## Integrasi Pipeline

- **`create-issues`:** Menghasilkan task awal di `.agents/TASKS.md` yang kemudian divisualisasikan oleh `task-board`.
- **`deterministic-verify` & `evidence-receipt`:** Menyediakan bukti eksekusi dan ringkasan pengujian yang ditampilkan pada kartu task saat berstatus `In Review`.
- **`implement-task`:** Membaca field `- **Reviewer Feedback:**` pada task yang dikembalikan ke `In Progress` untuk dieksekusi perbaikannya.
- **`project-handoff`:** Merujuk status task aktif yang telah diperbarui melalui board.
