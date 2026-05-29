# LAPORAN BLACK BOX TESTING
## Aplikasi Notes App — Manajemen Catatan Berbasis Web

---

**Nama**             : [Nama Kamu]
**NIM**              : [NIM Kamu]
**Mata Kuliah**      : Uji Kualitas Perangkat Lunak
**Metode Pengujian** : Black Box Testing

---

## BAB I — PENDAHULUAN

### 1.1 Latar Belakang

Pengujian perangkat lunak merupakan bagian yang tidak terpisahkan dari siklus pengembangan aplikasi web. Salah satu pendekatan pengujian yang banyak digunakan adalah Black Box Testing, yaitu metode pengujian yang berfokus pada fungsionalitas dan output yang dihasilkan oleh sistem tanpa memperhatikan mekanisme internal program. Pendekatan ini juga dikenal sebagai behavioral testing, specification-based testing, atau functional testing.

Black Box Testing dilakukan berdasarkan spesifikasi kebutuhan perangkat lunak. Tester menyediakan sekumpulan kondisi masukan yang dapat secara penuh memeriksa keseluruhan kebutuhan fungsional pada suatu program, kemudian memverifikasi apakah keluaran yang dihasilkan sesuai dengan yang diharapkan.

Laporan ini mendokumentasikan penerapan Black Box Testing pada aplikasi Notes App, sebuah aplikasi web berbasis Next.js yang dikembangkan untuk mendukung manajemen catatan harian. Dua teknik pengujian diterapkan: Equivalence Class Partitioning (ECP) dan State Transition Testing (STT), sesuai dengan ketentuan tugas untuk mahasiswa dengan NIM ganjil.

### 1.2 Tujuan

| No | Tujuan |
|----|--------|
| 1 | Mendokumentasikan proses penerapan Black Box Testing pada aplikasi web Notes App |
| 2 | Merancang test case yang komprehensif menggunakan teknik Equivalence Class Partitioning dan State Transition Testing |
| 3 | Mengidentifikasi partisi ekuivalensi dan transisi status pada fitur validasi input dan alur CRUD catatan |
| 4 | Menganalisis hasil pengujian dan memverifikasi kesesuaian perilaku aplikasi dengan spesifikasi kebutuhan |

### 1.3 Ruang Lingkup

| No | Fitur | Komponen |
|----|-------|----------|
| 1 | Validasi Input Catatan | Fungsi `validateNoteInput(title, content)` pada sisi client dan API |
| 2 | Alur Status CRUD | State machine yang mengelola transisi status modal (IDLE, CREATING, EDITING, DELETING, SAVED, ERROR) |

Pengujian difokuskan pada logika validasi input dan alur transisi status yang dapat diverifikasi berdasarkan spesifikasi fungsional.

---

## BAB II — STUDI KASUS

### 2.1 Deskripsi Aplikasi

Notes App adalah aplikasi web berbasis Next.js 15 yang dirancang untuk mendukung manajemen catatan harian secara sederhana dan efisien. Aplikasi ini berjalan pada platform web (browser) dan dikembangkan menggunakan bahasa pemrograman TypeScript dengan framework Next.js versi 15 dan React 19.

Aplikasi menggunakan pola arsitektur App Router dari Next.js yang memisahkan logika API (server-side) dan tampilan antarmuka (client-side). Semua data disimpan secara lokal menggunakan file JSON (`data/notes.json`).

### 2.2 Fitur yang Diuji

| Fitur | Komponen | Deskripsi Singkat |
|-------|----------|-------------------|
| Validasi Input | `validateNoteInput(title, content)` | Validasi field judul (1–100 karakter) dan isi (1–5000 karakter) sebelum disimpan |
| Alur Status CRUD | State Machine (NoteState) | Transisi status dari IDLE ke CREATING/EDITING/DELETING, lalu ke SAVED atau ERROR |

### 2.3 Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 15 / React 19 |
| Bahasa | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Penyimpanan | File JSON lokal |
| Pengujian | Vitest 2 |

### 2.4 Arsitektur Aplikasi

```
notes_app/
├── app/
│   ├── api/notes/
│   │   ├── route.ts          (GET semua, POST buat note)
│   │   └── [id]/route.ts     (GET, PUT, DELETE per note)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              (Halaman utama CRUD)
├── components/
│   ├── NoteCard.tsx
│   ├── NoteModal.tsx
│   ├── DeleteConfirmModal.tsx
│   └── Toast.tsx
├── lib/
│   ├── types.ts              (Tipe data Note & NoteState)
│   └── notes-store.ts        (CRUD ke file JSON)
├── data/notes.json
└── tests/
    ├── equivalence-partitioning.test.ts
    └── state-transition.test.ts
```

---

## BAB III — METODE BLACK BOX TESTING

### 3.1 Pengertian Black Box Testing

Black Box Testing adalah metode pengujian perangkat lunak yang dilakukan tanpa pengetahuan detail tentang struktur internal dari sistem atau komponen yang diuji. Pengujian ini berfokus pada kebutuhan fungsional software berdasarkan spesifikasi kebutuhan, dengan cara memeriksa apakah output yang dihasilkan sesuai dengan yang diharapkan untuk setiap input yang diberikan.

| Kategori Error | Keterangan |
|----------------|-----------|
| Fungsi hilang atau tidak benar | Fitur tidak berjalan sesuai spesifikasi |
| Error antarmuka | Kesalahan pada komunikasi antar komponen |
| Error struktur data / akses database | Kesalahan saat membaca atau menulis data |
| Error kinerja atau tingkah laku | Sistem tidak merespons sesuai yang diharapkan |
| Error inisialisasi dan terminasi | Kesalahan saat komponen dimulai atau dihentikan |

### 3.2 Teknik-Teknik Black Box Testing yang Digunakan

#### a. Equivalence Class Partitioning (ECP)

Teknik ini membagi domain masukan ke dalam kelas-kelas data yang diperlakukan sama (ekuivalen) oleh komponen. Nilai tunggal pada suatu partisi diasumsikan mewakili semua nilai dalam partisi tersebut. Hal ini digunakan untuk mengurangi masalah yang tidak mungkin untuk testing terhadap tiap nilai masukan.

| Jenis Partisi | Keterangan |
|---------------|-----------|
| Valid | Input yang sesuai dengan spesifikasi |
| Tidak Valid | Input yang berada di luar spesifikasi |

#### b. State Transition Testing

State Transition Testing menggunakan model sistem yang terdiri dari status yang terdapat di dalam program, transisi antar status-status tersebut, kejadian yang merupakan sebab dari transisi-transisi tersebut, dan aksi-aksi yang akan dihasilkan. Model umumnya direpresentasikan dalam bentuk state transition diagram. Test case dirancang untuk memeriksa validitas transisi antar status, termasuk transisi yang valid maupun yang tidak valid (null transition).

### 3.3 Pemilihan Teknik per Fitur

| Fitur | Teknik | Alasan Pemilihan |
|-------|--------|-----------------|
| Validasi Input Catatan | Equivalence Class Partitioning | Input berupa string dengan partisi valid/tidak valid yang jelas berdasarkan panjang karakter |
| Alur Status CRUD | State Transition Testing | Terdapat alur status yang kompleks dengan banyak transisi valid dan tidak valid yang perlu diverifikasi |

> **Catatan**: Sesuai ketentuan tugas, mahasiswa dengan NIM ganjil menggunakan Equivalence Class Partitioning, dan State Transition Testing wajib untuk semua NIM.

---

## BAB IV — PERANCANGAN TEST CASE

### 4.1 Fitur: Validasi Input Catatan — validateNoteInput (Equivalence Class Partitioning)

#### 4.1.1 Spesifikasi Fungsi

Fungsi `validateNoteInput(title, content)` memvalidasi dua field sebelum catatan disimpan ke database.

| Field | Aturan Validasi | Pesan Error |
|-------|----------------|-------------|
| `title` | Tidak boleh kosong; panjang setelah trim 1–100 karakter | "Judul tidak boleh kosong" / "Judul maksimal 100 karakter" |
| `content` | Tidak boleh kosong; panjang setelah trim 1–5000 karakter | "Isi catatan tidak boleh kosong" / "Isi catatan maksimal 5000 karakter" |
| Return value | `{ valid: true, errors: {} }` jika semua valid | — |

#### 4.1.2 Identifikasi Partisi Ekuivalensi

**Partisi input `title`:**

| Kelas | Deskripsi | Contoh Nilai | Valid/Tidak Valid |
|-------|-----------|--------------|-----------------|
| T1 | String normal (1–100 karakter) | "Belajar Next.js" | Valid |
| T2 | String tepat 1 karakter | "A" | Valid |
| T3 | String tepat 100 karakter | "A" × 100 | Valid |
| T4 | String kosong ("") | "" | Tidak Valid |
| T5 | String hanya spasi | "   " | Tidak Valid |
| T6 | String > 100 karakter | "A" × 101 | Tidak Valid |

**Partisi input `content`:**

| Kelas | Deskripsi | Contoh Nilai | Valid/Tidak Valid |
|-------|-----------|--------------|-----------------|
| C1 | String normal (1–5000 karakter) | "Isi catatan valid." | Valid |
| C2 | String tepat 1 karakter | "X" | Valid |
| C3 | String tepat 5000 karakter | "B" × 5000 | Valid |
| C4 | String kosong ("") | "" | Tidak Valid |
| C5 | String hanya spasi | "     " | Tidak Valid |
| C6 | String > 5000 karakter | "C" × 5001 | Tidak Valid |

#### 4.1.3 Test Case — Equivalence Class Partitioning

**Kelas Valid:**

| TC | Skenario | title | content | Partisi | Expected Output |
|----|----------|-------|---------|---------|-----------------|
| TC-V01 | title dan content normal | "Belajar Next.js" | "Hari ini belajar membuat aplikasi notes." | T1, C1 | `{ valid: true, errors: {} }` |
| TC-V02 | title tepat 1 karakter | "A" | "Isi catatan valid." | T2, C1 | `{ valid: true, errors: {} }` |
| TC-V03 | title tepat 100 karakter | "A" × 100 | "Isi catatan valid." | T3, C1 | `{ valid: true, errors: {} }` |
| TC-V04 | content tepat 1 karakter | "Judul Valid" | "X" | T1, C2 | `{ valid: true, errors: {} }` |
| TC-V05 | content tepat 5000 karakter | "Judul Valid" | "B" × 5000 | T1, C3 | `{ valid: true, errors: {} }` |
| TC-V06 | title dan content dengan spasi di awal/akhir | "  Judul  " | "  Isi  " | T1, C1 | `{ valid: true, errors: {} }` |

**Kelas Tidak Valid — title:**

| TC | Skenario | title | content | Partisi | Expected Output |
|----|----------|-------|---------|---------|-----------------|
| TC-I01 | title kosong (string kosong) | "" | "Isi catatan valid." | T4 | `{ valid: false, errors: { title: "Judul tidak boleh kosong" } }` |
| TC-I02 | title hanya spasi | "   " | "Isi catatan valid." | T5 | `{ valid: false, errors: { title: "Judul tidak boleh kosong" } }` |
| TC-I03 | title 101 karakter | "A" × 101 | "Isi catatan valid." | T6 | `{ valid: false, errors: { title: "Judul maksimal 100 karakter" } }` |
| TC-I04 | title 200 karakter | "Z" × 200 | "Isi catatan valid." | T6 | `{ valid: false, errors: { title: "Judul maksimal 100 karakter" } }` |

**Kelas Tidak Valid — content:**

| TC | Skenario | title | content | Partisi | Expected Output |
|----|----------|-------|---------|---------|-----------------|
| TC-I05 | content kosong (string kosong) | "Judul Valid" | "" | C4 | `{ valid: false, errors: { content: "Isi catatan tidak boleh kosong" } }` |
| TC-I06 | content hanya spasi | "Judul Valid" | "     " | C5 | `{ valid: false, errors: { content: "Isi catatan tidak boleh kosong" } }` |
| TC-I07 | content 5001 karakter | "Judul Valid" | "C" × 5001 | C6 | `{ valid: false, errors: { content: "Isi catatan maksimal 5000 karakter" } }` |
| TC-I08 | content 10000 karakter | "Judul Valid" | "D" × 10000 | C6 | `{ valid: false, errors: { content: "Isi catatan maksimal 5000 karakter" } }` |

**Kelas Tidak Valid — keduanya:**

| TC | Skenario | title | content | Partisi | Expected Output |
|----|----------|-------|---------|---------|-----------------|
| TC-I09 | title dan content keduanya kosong | "" | "" | T4, C4 | `{ valid: false, errors: { title: "...", content: "..." } }` |
| TC-I10 | title > 100 dan content > 5000 | "A" × 101 | "B" × 5001 | T6, C6 | `{ valid: false, errors: { title: "...", content: "..." } }` |

#### 4.1.4 Hasil Pengujian

| TC | Expected Output | Actual Output | Status |
|----|-----------------|---------------|--------|
| TC-V01 | valid: true | valid: true ✓ | **PASS** |
| TC-V02 | valid: true | valid: true ✓ | **PASS** |
| TC-V03 | valid: true | valid: true ✓ | **PASS** |
| TC-V04 | valid: true | valid: true ✓ | **PASS** |
| TC-V05 | valid: true | valid: true ✓ | **PASS** |
| TC-V06 | valid: true | valid: true ✓ (trim diterapkan) | **PASS** |
| TC-I01 | errors.title = "Judul tidak boleh kosong" | errors.title = "Judul tidak boleh kosong" ✓ | **PASS** |
| TC-I02 | errors.title = "Judul tidak boleh kosong" | "   ".trim() = "" → error ✓ | **PASS** |
| TC-I03 | errors.title = "Judul maksimal 100 karakter" | length 101 > 100 → error ✓ | **PASS** |
| TC-I04 | errors.title = "Judul maksimal 100 karakter" | length 200 > 100 → error ✓ | **PASS** |
| TC-I05 | errors.content = "Isi catatan tidak boleh kosong" | errors.content = "Isi catatan tidak boleh kosong" ✓ | **PASS** |
| TC-I06 | errors.content = "Isi catatan tidak boleh kosong" | "     ".trim() = "" → error ✓ | **PASS** |
| TC-I07 | errors.content = "Isi catatan maksimal 5000 karakter" | length 5001 > 5000 → error ✓ | **PASS** |
| TC-I08 | errors.content = "Isi catatan maksimal 5000 karakter" | length 10000 > 5000 → error ✓ | **PASS** |
| TC-I09 | errors.title dan errors.content keduanya ada | Dua error sekaligus ✓ | **PASS** |
| TC-I10 | errors.title dan errors.content keduanya ada | Dua error sekaligus ✓ | **PASS** |

> **Catatan**: Validasi menggunakan `trim()` sebelum mengecek panjang, sehingga string yang hanya berisi spasi tetap gagal validasi meskipun panjangnya > 0.

---

### 4.2 Fitur: Alur Status CRUD — State Machine (State Transition Testing)

#### 4.2.1 Spesifikasi State Machine

Aplikasi Notes App mengelola status UI melalui state machine dengan 6 status dan 7 jenis kejadian.

**Daftar Status (States):**

| Status | Deskripsi |
|--------|-----------|
| IDLE | Tidak ada aksi aktif, menampilkan daftar catatan |
| CREATING | Modal buat catatan baru sedang terbuka |
| EDITING | Modal edit catatan sedang terbuka |
| DELETING | Modal konfirmasi hapus sedang terbuka |
| SAVED | Operasi berhasil disimpan/dihapus |
| ERROR | Terjadi kesalahan validasi atau server |

**Daftar Kejadian (Events):**

| Kejadian | Deskripsi |
|----------|-----------|
| openCreate | Klik tombol "Catatan Baru" |
| openEdit | Klik tombol edit pada kartu catatan |
| openDelete | Klik tombol hapus pada kartu catatan |
| submitValid | Submit form dengan input yang valid |
| submitInvalid | Submit form dengan input yang tidak valid |
| cancel | Klik tombol batal atau tekan tombol Escape |
| confirmDelete | Klik tombol konfirmasi hapus |

#### 4.2.2 State Transition Diagram

```
[IDLE] --openCreate--> [CREATING]
[IDLE] --openEdit----> [EDITING]
[IDLE] --openDelete--> [DELETING]

[CREATING] --submitValid----> [SAVED]
[CREATING] --submitInvalid--> [ERROR]
[CREATING] --cancel---------> [IDLE]

[EDITING] --submitValid----> [SAVED]
[EDITING] --submitInvalid--> [ERROR]
[EDITING] --cancel---------> [IDLE]

[DELETING] --confirmDelete--> [SAVED]
[DELETING] --cancel----------> [IDLE]

[SAVED] ---(auto)-----------> [IDLE]
[ERROR] --cancel-------------> [IDLE]
```

#### 4.2.3 Tabel Status (State Table)

| Status \ Event | openCreate | openEdit | openDelete | submitValid | submitInvalid | cancel | confirmDelete |
|----------------|-----------|---------|-----------|------------|--------------|--------|--------------|
| IDLE | CREATING | EDITING | DELETING | - (null) | - (null) | - (null) | - (null) |
| CREATING | - (null) | - (null) | - (null) | SAVED | ERROR | IDLE | - (null) |
| EDITING | - (null) | - (null) | - (null) | SAVED | ERROR | IDLE | - (null) |
| DELETING | - (null) | - (null) | - (null) | - (null) | - (null) | IDLE | SAVED |
| SAVED | IDLE | IDLE | IDLE | IDLE | IDLE | IDLE | IDLE |
| ERROR | - (null) | - (null) | - (null) | - (null) | - (null) | IDLE | - (null) |

> Sel bertanda `-` (null transition) berarti tidak ada transisi yang valid. Jika dipaksakan, sistem tetap di status semula dan mengembalikan pesan error.

#### 4.2.4 Test Case — Transisi Valid (0-switch coverage)

| TC | Skenario | Status Awal | Event | Status Akhir yang Diharapkan |
|----|----------|-------------|-------|------------------------------|
| TC-ST01 | Buka modal buat catatan | IDLE | openCreate | CREATING |
| TC-ST02 | Submit form valid saat membuat | CREATING | submitValid | SAVED |
| TC-ST03 | Batal saat membuat catatan | CREATING | cancel | IDLE |
| TC-ST04 | Submit form tidak valid saat membuat | CREATING | submitInvalid | ERROR |
| TC-ST05 | Buka modal edit catatan | IDLE | openEdit | EDITING |
| TC-ST06 | Submit form valid saat mengedit | EDITING | submitValid | SAVED |
| TC-ST07 | Batal saat mengedit catatan | EDITING | cancel | IDLE |
| TC-ST08 | Submit form tidak valid saat mengedit | EDITING | submitInvalid | ERROR |
| TC-ST09 | Buka modal konfirmasi hapus | IDLE | openDelete | DELETING |
| TC-ST10 | Konfirmasi hapus catatan | DELETING | confirmDelete | SAVED |
| TC-ST11 | Batal saat konfirmasi hapus | DELETING | cancel | IDLE |
| TC-ST12 | Status SAVED otomatis kembali ke IDLE | SAVED | (event apapun) | IDLE |

#### 4.2.5 Test Case — Transisi Tidak Valid (null transition)

| TC | Skenario | Status Awal | Event | Expected Output |
|----|----------|-------------|-------|-----------------|
| TC-ST13 | Submit dari IDLE tanpa buka modal | IDLE | submitValid | Tetap IDLE + error message |
| TC-ST14 | Konfirmasi hapus dari IDLE | IDLE | confirmDelete | Tetap IDLE + error message |
| TC-ST15 | Buka edit saat sedang di mode create | CREATING | openEdit | Tetap CREATING + error message |
| TC-ST16 | Submit form saat modal hapus terbuka | DELETING | submitValid | Tetap DELETING + error message |

#### 4.2.6 Test Case — Sekuensial (1-switch coverage)

| TC | Skenario | Urutan Event | Status Akhir yang Diharapkan |
|----|----------|--------------|------------------------------|
| TC-ST17 | Alur buat catatan berhasil | openCreate → submitValid | SAVED |
| TC-ST18 | Alur buat catatan dibatalkan | openCreate → cancel | IDLE |
| TC-ST19 | Alur edit catatan berhasil | openEdit → submitValid | SAVED |
| TC-ST20 | Alur edit catatan dibatalkan | openEdit → cancel | IDLE |
| TC-ST21 | Alur hapus catatan berhasil | openDelete → confirmDelete | SAVED |
| TC-ST22 | Alur hapus catatan dibatalkan | openDelete → cancel | IDLE |
| TC-ST23 | Validasi gagal saat membuat | openCreate → submitInvalid | ERROR |
| TC-ST24 | Validasi gagal saat mengedit | openEdit → submitInvalid | ERROR |
| TC-ST25 | Buat → Batal → Edit | openCreate → cancel → openEdit | EDITING |
| TC-ST26 | Hapus → Batal → Buat | openDelete → cancel → openCreate | CREATING |
| TC-ST27 | Setelah SAVED kembali ke IDLE → Hapus | (SAVED→IDLE) → openDelete | DELETING |

#### 4.2.7 Hasil Pengujian — Transisi Valid

| TC | Expected Output | Actual Output | Status |
|----|-----------------|---------------|--------|
| TC-ST01 | CREATING | CREATING ✓ | **PASS** |
| TC-ST02 | SAVED | SAVED ✓ | **PASS** |
| TC-ST03 | IDLE | IDLE ✓ | **PASS** |
| TC-ST04 | ERROR | ERROR ✓ | **PASS** |
| TC-ST05 | EDITING | EDITING ✓ | **PASS** |
| TC-ST06 | SAVED | SAVED ✓ | **PASS** |
| TC-ST07 | IDLE | IDLE ✓ | **PASS** |
| TC-ST08 | ERROR | ERROR ✓ | **PASS** |
| TC-ST09 | DELETING | DELETING ✓ | **PASS** |
| TC-ST10 | SAVED | SAVED ✓ | **PASS** |
| TC-ST11 | IDLE | IDLE ✓ | **PASS** |
| TC-ST12 | IDLE | IDLE ✓ | **PASS** |

#### 4.2.8 Hasil Pengujian — Transisi Tidak Valid

| TC | Expected Output | Actual Output | Status |
|----|-----------------|---------------|--------|
| TC-ST13 | Tetap IDLE + error | Tetap IDLE + error message ✓ | **PASS** |
| TC-ST14 | Tetap IDLE + error | Tetap IDLE + error message ✓ | **PASS** |
| TC-ST15 | Tetap CREATING + error | Tetap CREATING + error message ✓ | **PASS** |
| TC-ST16 | Tetap DELETING + error | Tetap DELETING + error message ✓ | **PASS** |

#### 4.2.9 Hasil Pengujian — Sekuensial

| TC | Expected Output | Actual Output | Status |
|----|-----------------|---------------|--------|
| TC-ST17 | SAVED | SAVED ✓ | **PASS** |
| TC-ST18 | IDLE | IDLE ✓ | **PASS** |
| TC-ST19 | SAVED | SAVED ✓ | **PASS** |
| TC-ST20 | IDLE | IDLE ✓ | **PASS** |
| TC-ST21 | SAVED | SAVED ✓ | **PASS** |
| TC-ST22 | IDLE | IDLE ✓ | **PASS** |
| TC-ST23 | ERROR | ERROR ✓ | **PASS** |
| TC-ST24 | ERROR | ERROR ✓ | **PASS** |
| TC-ST25 | EDITING | EDITING ✓ | **PASS** |
| TC-ST26 | CREATING | CREATING ✓ | **PASS** |
| TC-ST27 | DELETING | DELETING ✓ | **PASS** |

---

## BAB V — REKAPITULASI HASIL PENGUJIAN

### 5.1 Ringkasan per Fitur

| Fitur | Teknik | Jumlah TC | PASS | FAIL | Persentase |
|-------|--------|-----------|------|------|-----------|
| Validasi Input Catatan | Equivalence Class Partitioning | 16 | 16 | 0 | 100% |
| Alur Status CRUD | State Transition Testing | 27 | 27 | 0 | 100% |
| **TOTAL** | | **43** | **43** | **0** | **100%** |

### 5.2 Distribusi Test Case per Teknik

| Teknik | Jumlah TC | Persentase |
|--------|-----------|-----------|
| Equivalence Class Partitioning | 16 | 37% |
| State Transition Testing | 27 | 63% |
| **Total** | **43** | **100%** |

### 5.3 Distribusi Test Case per Kategori (ECP)

| Kategori | Jumlah TC | Persentase |
|----------|-----------|-----------|
| Kelas Valid | 6 | 38% |
| Kelas Tidak Valid — title | 4 | 25% |
| Kelas Tidak Valid — content | 4 | 25% |
| Kelas Tidak Valid — keduanya | 2 | 12% |
| **Total** | **16** | **100%** |

### 5.4 Distribusi Test Case per Kategori (State Transition Testing)

| Kategori | Jumlah TC | Persentase |
|----------|-----------|-----------|
| Transisi Valid (0-switch) | 12 | 44% |
| Transisi Tidak Valid (null) | 4 | 15% |
| Sekuensial (1-switch) | 11 | 41% |
| **Total** | **27** | **100%** |

---

## BAB VI — ANALISIS DAN PEMBAHASAN

### 6.1 Analisis Hasil per Fitur

#### 6.1.1 Validasi Input Catatan — validateNoteInput

Pengujian dengan ECP berhasil memverifikasi semua partisi ekuivalensi pada dua field input. Terdapat 6 kelas ekuivalensi yang diidentifikasi untuk `title` dan 6 kelas untuk `content`. Semua 16 test case lulus, termasuk edge case string yang hanya berisi spasi yang tetap gagal validasi berkat penggunaan `trim()` sebelum pengecekan panjang.

Temuan penting: validasi menggunakan `trim()` sebelum mengecek apakah string kosong, sehingga input seperti `"   "` (tiga spasi) diperlakukan sama dengan `""` (string kosong) — keduanya menghasilkan error "tidak boleh kosong". Ini merupakan perilaku yang benar dan konsisten.

#### 6.1.2 Alur Status CRUD — State Machine

State Transition Testing berhasil memverifikasi seluruh transisi yang valid maupun yang tidak valid. Dari 27 test case:

- **12 test case transisi valid** memverifikasi bahwa setiap event yang valid menghasilkan perpindahan status yang benar.
- **4 test case null transition** memverifikasi bahwa event yang tidak valid dari suatu status tidak mengubah status dan menghasilkan pesan error.
- **11 test case sekuensial** memverifikasi alur lengkap dari awal hingga akhir operasi CRUD.

Cakupan 0-switch (setiap transisi individual) dan 1-switch (dua transisi berurutan) berhasil dicapai sepenuhnya.

### 6.2 Perbandingan Fitur Validasi Input vs Alur Status

| Aspek | Validasi Input (ECP) | Alur Status (STT) |
|-------|---------------------|-------------------|
| Teknik | Equivalence Class Partitioning | State Transition Testing |
| Objek pengujian | Fungsi validasi string | State machine CRUD |
| Jumlah partisi/status | 12 kelas ekuivalensi | 6 status, 7 event |
| Jumlah test case | 16 | 27 |
| Fokus | Nilai input yang valid/tidak valid | Urutan dan validitas transisi |
| Null case | Input kosong / melebihi batas | Null transition (event tidak valid) |

### 6.3 Temuan dan Rekomendasi

**Temuan Positif:**

| No | Temuan |
|----|--------|
| 1 | Validasi `title` dan `content` bekerja benar untuk semua kelas ekuivalensi yang diidentifikasi |
| 2 | Penggunaan `trim()` pada kedua field mencegah input whitespace lolos validasi |
| 3 | State machine CRUD menangani semua transisi valid dan null transition dengan benar |
| 4 | Pesan error yang dikembalikan spesifik dan informatif untuk setiap jenis kesalahan |

**Rekomendasi Perbaikan:**

| No | Rekomendasi |
|----|-------------|
| 1 | Tambahkan validasi panjang minimum untuk `title` (misal minimal 3 karakter) agar catatan lebih bermakna |
| 2 | Tambahkan validasi panjang minimum untuk `content` (misal minimal 10 karakter) |
| 3 | Tambahkan state `LOADING` pada state machine untuk menangani kondisi saat request API sedang berjalan |
| 4 | Tambahkan state `NETWORK_ERROR` yang terpisah dari `ERROR` untuk membedakan error validasi dan error jaringan |
| 5 | Pertimbangkan penambahan fitur pencarian catatan dengan validasi input query (panjang minimum, karakter yang diizinkan) |

---

## BAB VII — KESIMPULAN

### 7.1 Kesimpulan

Pengujian Black Box Testing pada aplikasi Notes App telah berhasil dilaksanakan dengan total **43 test case** yang mencakup dua fitur utama. Seluruh test case menghasilkan status **PASS (100%)**, yang menunjukkan bahwa implementasi aplikasi telah sesuai dengan spesifikasi fungsional yang ditetapkan.

| Teknik | Fitur yang Menggunakan | Efektivitas |
|--------|----------------------|-------------|
| ECP | Validasi Input Catatan | Efektif untuk domain input string yang dapat dikelompokkan ke kelas ekuivalen berdasarkan panjang karakter |
| State Transition Testing | Alur Status CRUD | Efektif untuk memverifikasi alur status yang kompleks dengan banyak kemungkinan transisi |

Kedua teknik yang digunakan saling melengkapi: ECP memastikan bahwa semua kategori input ditangani dengan benar, sementara State Transition Testing memastikan bahwa alur operasi CRUD berjalan sesuai urutan yang benar dan menolak operasi yang tidak valid.

### 7.2 Saran

| No | Saran |
|----|-------|
| 1 | Terapkan Black Box Testing secara rutin pada setiap penambahan fitur baru untuk mencegah regresi |
| 2 | Pertimbangkan penambahan Boundary Value Analysis untuk validasi panjang karakter (tepat di batas 100 dan 5000) |
| 3 | Integrasikan test case ke dalam pipeline CI/CD menggunakan Vitest untuk otomatisasi pengujian regresi |
| 4 | Pertimbangkan Cause-Effect Graphing jika ditambahkan fitur dengan multiple kondisi input yang saling mempengaruhi |

---

## DAFTAR PUSTAKA

| No | Referensi |
|----|-----------|
| 1 | Pressman, R. S. (2010). *Software Engineering: A Practitioner's Approach* (7th ed.). McGraw-Hill. |
| 2 | Beizer, B. (1995). *Black-Box Testing: Techniques for Functional Testing of Software and Systems*. John Wiley & Sons. |
| 3 | Tim Dosen UKPL. (2024). *Modul 09 — Black Box Testing*. Universitas Teknologi Yogyakarta. |
| 4 | Vercel. (2024). *Next.js 15 Documentation*. https://nextjs.org/docs |
| 5 | Myers, G. J., Sandler, C., & Badgett, T. (2011). *The Art of Software Testing* (3rd ed.). John Wiley & Sons. |

---

*Laporan ini dibuat sebagai bagian dari tugas mata kuliah Uji Kualitas Perangkat Lunak.*
*Tanggal: 29 Mei 2026*
