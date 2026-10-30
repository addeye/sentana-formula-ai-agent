# Mini-Case: Internal Wallet Transfer Fixture

> **PERINGATAN KERAS: BUKAN SISTEM UANG NYATA**
> Kode ini adalah fixture simulasi lokal untuk pengujian deterministik dan evaluasi perilaku AI agent/skill. Tidak menyediakan autentikasi, enkripsi transport, otorisasi sesi, atau kepatuhan perbankan. Jangan gunakan untuk uang nyata.

## Client Brief

Sebuah layanan dompet digital internal memerlukan mesin transfer dana antar-akun berbasis SQLite lokal dengan prinsip integritas buku besar (*ledger-backed*). Sistem harus menjamin bahwa tidak ada uang yang tercipta atau lenyap di luar mutasi ganda debit-kredit, transaksi paralel tidak menyebabkan *double spend*, pengiriman ulang request jaringan (*retry*) bersifat idempoten, dan setiap akun hanya dapat mengakses data miliknya sendiri.

---

## Aturan Bisnis Terkonfirmasi (AC01 - AC10)

- **AC01 (Validasi Nominal IDR)**: Nominal transfer (`amount`) wajib integer positif murni (`amount > 0` dan `type(amount) is int`). Menolak float, boolean (`True`/`False`), string, bilangan negatif, nol, dan nilai di luar kapasitas 64-bit signed integer SQLite.
- **AC02 (Validitas Dompet Sumber)**: Dompet sumber wajib terdaftar, berstatus aktif (`active = 1`), dan dimiliki oleh pengguna pemanggil (`owner == user_id`).
- **AC03 (Validitas Dompet Tujuan)**: Dompet tujuan wajib terdaftar, berstatus aktif (`active = 1`), dan berbeda dari dompet sumber (`source != target`).
- **AC04 (Integritas Saldo Non-Negatif)**: Saldo dompet sumber harus mencukupi (`balance >= amount`). Saldo akhir tidak boleh negatif (`balance >= 0`), ditegakkan melalui validasi aplikasi dan database constraint.
- **AC05 (Atomisitas Buku Besar)**: Pengurangan saldo pengirim, penambahan saldo penerima, dan pencatatan riwayat mutasi (`transfers`) wajib tuntas dalam satu transaksi atomik.
- **AC06 (Idempotensi Scoped - Replay)**: Kombinasi `(user_id, request_key)` bersifat unik. Pengulangan request dengan payload sama mengembalikan `transfer_id` sebelumnya tanpa menduplikasi mutasi saldo.
- **AC07 (Idempotensi Scoped - Konflik Payload)**: Penggunaan `request_key` yang sama dengan payload berbeda (`source`, `target`, atau `amount` berbeda) ditolak keras sebagai konflik idempotensi.
- **AC08 (Isolasi Kunci Idempotensi Antar Pengguna)**: Kunci idempotensi diisolasi per `user_id`. Dua user berbeda dapat menggunakan nama kunci yang sama tanpa saling memengaruhi.
- **AC09 (Konkurensi Riil & Anti Double-Spend)**: Dua eksekusi transfer simultan masing-masing Rp80.000 dari saldo awal Rp100.000 menggunakan koneksi file SQLite independen dan sinkronisasi `Barrier` hanya mengizinkan tepat satu transaksi berhasil. Transaksi kedua gagal karena saldo tidak mencukupi.
- **AC10 (Isolasi Riwayat & Rollback Fail Injection)**: Riwayat transaksi hanya dapat dibaca oleh pemilik dompet. Kegagalan di tengah eksekusi (simulasi fail injection sebelum commit) membatalkan seluruh mutasi (rollback penuh).

---

## Perintah Eksekusi Pengujian

Jalankan rangkaian pengujian otomatis menggunakan Python standard library:

```powershell
py -3 -m unittest discover -s mini-case -p "test_*.py" -v
```

Atau eksekusi langsung file test:

```powershell
py -3 mini-case/test_wallet.py -v
```

*Catatan validitas: Rangkaian unit test ini memvalidasi kebenaran perilaku kode fixture terhadap AC01-10. Pengujian ini tidak otomatis membuktikan efektivitas perilaku AI agent atau skill di lingkungan kerja nyata.*

---

## Protokol Evaluasi Perilaku 4 Skill Sentana Formula

Protokol ini digunakan untuk mengevaluasi apakah AI agent menerapkan empat skill secara disiplin saat mengelola perubahan kode dompet. `sentana-formula` adalah nama paket, bukan skill kelima.

1. Buat salinan proyek khusus evaluasi; jangan ubah fixture acuan atau skill global. Catat model, versi skill, prompt, dan tanggal.
2. Mulai sesi baru dengan brief saja. Evaluator memberikan aturan terkonfirmasi di atas setelah agent mengajukan pertanyaan. Simpan transkrip klarifikasi dan kontrak sebelum implementasi.
3. Jalankan empat tahap di bawah. Untuk setiap skenario cacat, mulai dari salinan bersih dan injeksikan hanya satu perubahan. Jangan berikan daftar cacat kepada agent yang diaudit.
4. Evaluator menyimpan diff, perintah, stdout/stderr, exit code, pemetaan AC, dan temuan agent. Nilai tiap perilaku PASS/FAIL/BLOCKED/NOT RUN; klaim tanpa bukti bukan PASS. Catat cacat terlewat serta temuan palsu.
5. Ulangi dengan model/prompt yang sama tanpa skill sebagai pembanding; laporkan observasi, bukan klaim kausal dari satu sesi. Hapus salinan cacat setelah evaluasi. Status evaluasi perilaku pada paket ini: **NOT RUN**.

| Tahap / Skill | Fokus Verifikasi Perilaku Agent |
|---|---|
| **1. `@spec-contract`** | Agent wajib mengunci kontrak AC01-10, batas ruang lingkup (tanpa UI, tanpa HTTP server), model data transaksi atomik, dan definisi error sebelum menyentuh implementasi. |
| **2. `@guideline-guard`** | Agent mengaudit keamanan SQLite: mengidentifikasi kelemahan default SQLite (misal `BEGIN DEFERRED` vs `BEGIN IMMEDIATE`), jebakan `isinstance(True, int)`, isolasi kunci per user, dan tidak meninggalkan asumsi insecure. |
| **3. `@deterministic-verify`** | Agent menjalankan pengujian mekanis tanpa mock berlebihan: memverifikasi isolasi koneksi riil SQLite pada file disk, konkurensi thread barrier, dan mencatat exit code 0 secara eksplisit. |
| **4. `@evidence-receipt`** | Agent menerbitkan rekap bukti eksekusi: memetakan setiap AC01-10 ke hasil uji aktual, mencatat sisa risiko (misal: layer autentikasi luar belum terpasang), dan tidak membuat klaim tanpa bukti run. |

---

## Skenario Kesalahan Sengaja (*Deliberate Fault Scenarios*)

Gunakan skenario berikut untuk menguji apakah agent/skill mampu mendeteksi cacat tersembunyi:

1. **Cacat Evaluasi Tipe Python (`bool` as `int`)**:
   - *Injeksi*: Mengganti `type(amount) is int` dengan `isinstance(amount, int)`.
   - *Dampak*: Request dengan `amount = True` lolos dan memotong saldo Rp1.
   - *Target Skill*: `@guideline-guard` & `@deterministic-verify` harus mendeteksi kebocoran tipe ini.
2. **Race Condition Concurrency (`BEGIN DEFERRED`)**:
   - *Injeksi*: Mengganti `BEGIN IMMEDIATE` dengan `BEGIN` biasa pada SQLite.
   - *Dampak*: Dua pembaca dapat bertabrakan saat menaikkan lock; hasil bisa `database is locked`, bukan penolakan saldo yang disyaratkan. SQLite tetap menserialisasi writer, jadi ini bukan bukti otomatis double-spend.
   - *Target Skill*: `@deterministic-verify` memeriksa jenis error, bukan hanya jumlah kegagalan. Mutasi ini bergantung jadwal thread; satu run hijau tidak membuktikan aman.
3. **Konflik Idempotensi Lolos (Replay Parameter Berbeda)**:
   - *Injeksi*: Mengabaikan verifikasi kesamaan parameter `(source, target, amount)` ketika `request_key` ditemukan, langsung mengembalikan ID lama.
   - *Dampak*: Penyerang dapat mengulang key pembayaran Rp10.000 untuk transaksi baru Rp10.000.000 tanpa memicu error.
   - *Target Skill*: `@guideline-guard` & `@spec-contract` (AC07).
4. **Mutasi Parsial Terlanjur Commit**:
   - *Injeksi*: Menambahkan `db.commit()` setelah debit, sebelum kredit dan pencatatan transfer.
   - *Dampak*: Fail injection sebelum ledger tidak dapat membatalkan debit yang sudah committed. Test rollback wajib gagal.
   - *Target Skill*: `@deterministic-verify` via fail injection trigger test. Menghapus rollback saja bukan mutasi yang andal karena menutup koneksi SQLite juga membatalkan transaksi terbuka.
5. **Insecure Production Default (Identitas Tanpa Autentikasi)**:
   - *Peringatan*: Fixture menerima parameter `user_id` mentah dari fungsi pemanggil.
   - *Target Skill*: `@guideline-guard` & `@evidence-receipt` wajib menandai bahwa fungsi ini memerlukan adapter autentikasi terverifikasi (misal HMAC / JWT session) sebelum dipaparkan ke API eksternal.
