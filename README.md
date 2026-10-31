# Sentana Formula

Paket skill OpenCode untuk membangun perangkat lunak berkualitas, aman, dan dapat dipercaya dari ide produk sampai verifikasi kode. Rancangan mengombinasikan alur perencanaan modular (`mini-prd`, `write-tech-spec`, `create-issues`), empat pilar Code Confidence Formula (`spec-contract`, `guideline-guard`, `deterministic-verify`, `evidence-receipt`), serta skill pendamping sesi (`project-handoff`).

## Daftar Skills Lengkap (12 Modul Aktif + 1 Wrapper Kompatibilitas)

### Fase 1: Perencanaan & Breakdown
| Modul | Tanggung jawab |
|---|---|
| [mini-prd](skills/mini-prd/SKILL.md) | Susun kebutuhan bisnis, batasan MVP, dan acceptance criteria tingkat produk (`.agents/PRD.md`). |
| [write-tech-spec](skills/write-tech-spec/SKILL.md) | Rancang arsitektur, skema data, transaksi atomik, dan rencana verifikasi teknis (`.agents/TECH-SPEC.md`). |
| [create-issues](skills/create-issues/SKILL.md) | Pecah spesifikasi menjadi vertical feature slices ber-ID dengan kriteria uji konkret (`.agents/TASKS.md`). |

### Fase 2: Standar Desain & Arsitektur UI
| Modul | Tanggung jawab |
|---|---|
| [sentana-ui-patterns](skills/sentana-ui-patterns/SKILL.md) | Blueprint antarmuka software house Sentana untuk Web (Admin & Landing), Mobile, dan Desktop. |

### Fase 3: Code Confidence Formula & Eksekusi Task
| Modul | Elemen | Tanggung jawab |
|---|---|---|
| [implement-task](skills/implement-task/SKILL.md) | **Orkestrator** | Eksekusi task `.agents/TASKS.md` dengan menghubungkan seluruh guardrails dan gate Done berbukti. |
| [spec-contract](skills/spec-contract/SKILL.md) | **Intent** | Kunci ruang lingkup (scope lock), file whitelist, dan acceptance criteria sebelum coding. |
| [guideline-guard](skills/guideline-guard/SKILL.md) | **Guide Rails** | Pandu perubahan dan audit diff terhadap security baseline (OWASP), arsitektur eksisting, dan anti-pattern. |
| [deterministic-verify](skills/deterministic-verify/SKILL.md) | **Independent Verification** | Eksekusi test runner, compiler, dan linter independen (bukan sekadar opini AI). |
| [evidence-receipt](skills/evidence-receipt/SKILL.md) | **Evidence** | Terbitkan audit trail bukti eksekusi nyata, status AC, dan batas verifikasi sebelum serah terima. |

### Fase 4: Sesi, Review Visual & Kolaborasi
| Modul | Tanggung jawab |
|---|---|
| [task-board](skills/task-board/SKILL.md) | Antarmuka Kanban visual lokal (`.agents/board.html`) untuk review task, catatan revisi manusia, dan instruksi agent. |
| [project-handoff](skills/project-handoff/SKILL.md) | Simpan atau lanjutkan checkpoint sesi kerja (`.agents/HANDOFF.md`) lintas hari dan perangkat. |
| [git-workflow](skills/git-workflow/SKILL.md) | Kelola commit, push, branch, dan PR adaptif (Conventional Commits) untuk solo dev maupun tim. |

### Modul Kompatibilitas
| Modul | Tanggung jawab |
|---|---|
| [verify](skills/verify/SKILL.md) | Wrapper kompatibilitas lama (autoinvoke nonaktif) yang mengarahkan verifikasi ke pipeline berbukti. |

## Alur Pipeline End-to-End

```
[Ide / Permintaan Klien]
          │
          ▼
    1. mini-prd                  --> PRD, batasan MVP, & aturan bisnis
          │
          ▼
    2. write-tech-spec           --> Arsitektur, konsistensi data, & skema verifikasi
          │
          ▼
    3. create-issues             --> Task list ber-ID (vertical slices)
          │
          ▼
    [task-board]                 --> Visualisasi Kanban lokal (.agents/board.html)
          │
          ▼
    4. spec-contract             --> Kunci scope & acceptance criteria per task
          │
          ▼
    5. guideline-guard           --> Terapkan security & konvensi saat menulis kode
          │
          ▼
    6. deterministic-verify      --> Jalankan test runner & compiler mekanis
          │
          ▼
    7. evidence-receipt          --> Cetak bukti eksekusi nyata & batas risiko
          │
          ▼
    [project-handoff]            --> Simpan checkpoint saat berganti hari/perangkat
```

## Penggunaan

Setiap modul dapat digunakan secara mandiri maupun terangkai dalam pipeline. Contoh perintah:

```text
Gunakan @mini-prd untuk merancang PRD fitur ini.
Gunakan @write-tech-spec untuk menyusun rencana teknis dari PRD.
Gunakan @create-issues untuk memecah spesifikasi menjadi task yang actionable.
Gunakan @task-board untuk membuka atau memperbarui board Kanban interaktif.
Gunakan @sentana-ui-patterns untuk merancang antarmuka admin panel atau landing page.
Gunakan @spec-contract untuk mengunci scope task T-01 sebelum mulai coding.
Gunakan @guideline-guard untuk memeriksa keamanan diff ini.
Gunakan @deterministic-verify untuk menjalankan pengujian fitur ini.
Gunakan @evidence-receipt untuk merangkum bukti eksekusi nyata.
Gunakan @project-handoff untuk menyimpan checkpoint sebelum saya berganti perangkat.
Gunakan @git-workflow untuk membuat commit rapi atau membuka PR berbasis bukti.
```

Semua modul terpasang secara global di `C:\Users\USER\.config\opencode\skills\<id>\SKILL.md`. Folder `skills/` pada repositori ini berisi salinan lengkap sehingga siap di-commit dan dikelola melalui GitHub.

Status pemeriksaan verifikasi: **PASS**, **FAIL**, **BLOCKED**, dan **NOT RUN**. Review AI bukan bukti independen tunggal; test hijau bukan jaminan kode bebas celah. Selalu tegakkan gate rilis di CI dan aturan branch protection.

## Mini-Case Evaluasi

Fixture dompet digital minimal untuk latihan penerapan dan evaluasi pipeline:
- Detail brief, aturan bisnis AC01-10, protokol evaluasi, dan skenario kesalahan: [mini-case/README.md](mini-case/README.md).
- Perintah uji deterministik: `py -3 -m unittest discover -s mini-case -p "test_*.py" -v`.

> **Peringatan**: Fixture ini hanya simulasi lokal untuk pengujian dan evaluasi, bukan sistem uang nyata.

## Pemeriksaan Paket

Jalankan dari direktori proyek pada PowerShell:

```powershell
.\check-skills.ps1
```

Pemeriksaan memastikan seluruh modul memiliki metadata dan struktur inti yang valid, tautan lokal README berfungsi, serta salinan di repositori identik dengan instalasi global OpenCode.
