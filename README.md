# LMS Pesantren Teknologi Majapahit

Sebuah Learning Management System (LMS) modern dan ringan yang dirancang untuk Pesantren Teknologi Majapahit. Platform ini memfasilitasi kegiatan belajar mengajar dengan antarmuka yang bersih dan fitur yang komprehensif untuk Siswa, Instruktur, dan Administrator.

## 🚀 Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi web modern dengan fokus pada performa dan kemudahan pengembangan (Low-Overhead):

### Frontend
- **HTML5**: Struktur dasar aplikasi.
- **Tailwind CSS**: Framework CSS utility-first untuk desain antarmuka yang responsif dan modern.
- **DaisyUI**: Komponen UI berbasis Tailwind untuk elemen interaktif.
- **Alpine.js**: Framework JavaScript ringan untuk reaktivitas dan state management di sisi klien.
- **Ionicons**: Set ikon premium untuk antarmuka pengguna.

### Backend & Database
- **Supabase**: Platform Backend-as-a-Service (BaaS) yang menyediakan:
    - **Authentication**: Manajemen user dan role (Siswa, Instruktur, Admin).
    - **PostgreSQL Database**: Penyimpanan data relasional yang kuat.
    - **Storage**: Penyimpanan file untuk materi kursus dan tugas.
    - **Realtime**: Fitur real-time (jika diaktifkan).

## ✨ Fitur Utama

### 1. Multi-Role Dashboard
Sistem membedakan akses dan antarmuka berdasarkan peran pengguna:
- **Siswa**: Melihat kursus yang diikuti, progres belajar, dan tugas yang harus dikerjakan.
- **Instruktur**: Membuat dan mengelola kursus, modul, pelajaran, serta menilai tugas.
- **Admin**: Mengelola pengguna dan pengaturan sistem secara keseluruhan.

### 2. Manajemen Kursus (Course Management)
- Instruktur dapat membuat kursus baru dengan detail lengkap (judul, deskripsi, thumbnail).
- Struktur kursus terorganisir dalam **Modul** dan **Pelajaran (Lessons)**.
- Dukungan konten multimedia (Video, Dokumen, Teks).

### 3. Pembelajaran Siswa (Lesson Delivery)
- Antarmuka belajar yang fokus dan bebas gangguan.
- Pelacakan progres otomatis saat siswa menyelesaikan materi.
- Navigasi mudah antar modul dan pelajaran.

### 4. Sistem Tugas (Assignments)
- Instruktur dapat memberikan tugas dengan tenggat waktu.
- Siswa dapat mengunggah hasil pengerjaan tugas.
- Fitur penilaian oleh instruktur.

### 5. Profil Pengguna
- Manajemen profil siswa dan instruktur.
- Personalisasi akun (Avatar, Nama Lengkap).

## 🗄️ Skema Database

Aplikasi menggunakan skema database relasional di Supabase dengan tabel utama:

- `profiles`: Data pengguna dan role (extends `auth.users`).
- `courses`: Data kursus.
- `modules`: Pengelompokan materi dalam kursus.
- `lessons`: Konten materi belajar.
- `enrollments`: Data pendaftaran siswa ke kursus dan progresnya.
- `assignments`: Data tugas yang diberikan instruktur.
- `lesson_completions`: Pencatatan penyelesaian materi oleh siswa.

## 🛠️ Cara Menjalankan Project

Karena aplikasi ini menggunakan arsitektur **Client-Side** (tanpa backend server Node.js/PHP sendiri) dan mengandalkan Supabase, Anda cukup menggunakan statis file server.

1.  **Clone Repository** ini.
2.  Buka project di code editor (VS Code disarankan).
3.  Pastikan Anda memiliki koneksi internet (untuk memuat CDN Tailwind, Alpine, dan koneksi Supabase).
4.  Gunakan ekstensi **Live Server** (atau sejenisnya) untuk menjalankan `index.html` atau file HTML lainnya.
5.  Aplikasi akan berjalan di browser lokal Anda.

> **Catatan**: Pastikan file `assets/js/utils/supabase-client.js` sudah terkonfigurasi dengan URL dan Anon Key project Supabase Anda.

## 📱 Struktur Direktori

```
project/
├── .agent/              # Konfigurasi Agent AI
├── assets/              # File statis (CSS, JS, Images)
│   ├── css/             # Stylesheet kustom
│   ├── js/              # Logika aplikasi & komponen
│   │   └── utils/       # Inisialisasi Supabase
│   └── images/          # Aset gambar
├── auth/                # Halaman otentikasi (Login, Register)
├── course/              # Halaman katalog & detail kursus
├── dashboard/           # Halaman dashboard per role
│   ├── admin/
│   ├── instructor/
│   └── student/
├── lesson/              # Halaman materi belajar (Lesson Player)
├── assignment/          # Halaman tugas
├── admin/               # Halaman administrasi
├── openspec/            # Spesifikasi dan dokumentasi teknis
└── index.html           # Landing page / Redirect
```

---
*Dibuat untuk memenuhi tugas UAS Pemrograman Berbasis Web Semester 5.*
