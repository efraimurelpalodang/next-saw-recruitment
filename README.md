# Sistem Pendukung Keputusan Rekrutmen (Metode SAW)

Aplikasi ini merupakan basis sistem pengambil keputusan untuk penyeleksian dan rekrutmen karyawan menggunakan metode **SAW (Simple Additive Weighting)**. Proyek ini dikembangkan dengan kerangka kerja Next.js App Router yang modern.

## 🚀 Teknologi Utama

Proyek ini dibangun berdasarkan ekosistem modern yang sangat mengedepankan efisiensi dan keamanan tipe:
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [Supabase](https://supabase.com/) & [Prisma (Pg Adapter)](https://www.prisma.io/)
- **Validasi Form**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 📝 Fitur Aplikasi (Direncanakan)

- **Manajemen Pengguna**: Autentikasi HRD, Manajer, dan pendaftaran mandiri oleh Pelamar (Applicant).
- **Master Data Kriteria**: Pengelolaan kriteria wawancara, usia, jarak, pengalaman kerja, dengan sistem bobot fleksibel.
- **Kalkulasi SAW**: Perhitungan otomatis peringkat pelamar yang secara rasional mengkalkulasi bobot dan sifat tiap kriteria (Benefit / Cost) guna melahirkan keputusan obyektif yang terotomatisasi.
- **Laporan & Dashboard**: Kesimpulan nilai secara realtime.

## 🛠️ Panduan Pengembangan (Development)

Sistem database sudah terkonfigurasi ke pooler **Supabase**, jika Anda menggunakan Environment `.env` sesuai yang direncanakan.

```bash
# Menjalankan server aplikasi Next.js (Local)
npm run dev

# Memperbarui / sinkronisasi struktur model Prisma ke Supabase
npx prisma db push

# Menambahkan dummy/master awal ke Database
npx prisma db seed
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk dapat melihat hasilnya.

Mendesain dan memodifikasi komponen antarmuka dapat dilakukan di dalam folder `components/ui` dan logika pemrosesan kalkulasi direkomendasikan untuk diletakkan di dalam `lib/`.
