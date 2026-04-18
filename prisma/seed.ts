import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// We don't need pg adapter strictly for seeding if local test db uses connection pooling natively, 
// but to be safe and consistent with the previous seed script:
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");
  await prisma.penilaian.deleteMany();
  await prisma.lamaran.deleteMany();
  await prisma.lowongan.deleteMany();
  await prisma.profilPelamar.deleteMany();
  await prisma.pengguna.deleteMany();
  await prisma.bobotKriteria.deleteMany();
  await prisma.jenisPekerjaan.deleteMany();
  await prisma.peran.deleteMany();

  console.log("Seeding Roles...");
  const roles = [
    { nama_peran: "hrd", deskripsi: "Human Resources Department" },
    { nama_peran: "pelamar", deskripsi: "Pencari Kerja" },
    { nama_peran: "manajer", deskripsi: "Manajer Perusahaan" },
    { nama_peran: "admin", deskripsi: "Administrator Sistem" },
  ];
  const roleCache: Record<string, string> = {};
  for (const role of roles) {
    const r = await prisma.peran.create({ data: role });
    roleCache[r.nama_peran] = r.id_peran;
  }

  console.log("Seeding Job Types...");
  const jobs = [
    { kode_jenis: "QC", nama_jenis: "Quality Control", deskripsi_umum: "Staf QC" },
    { kode_jenis: "DRIVER", nama_jenis: "Driver", deskripsi_umum: "Sopir Perusahaan" },
    { kode_jenis: "SALES", nama_jenis: "Sales", deskripsi_umum: "Staf Pemasaran" },
    { kode_jenis: "WAREHOUSE", nama_jenis: "Staff Gudang", deskripsi_umum: "Staf Gudang" },
  ];
  const jobCache: Record<string, string> = {};
  for (const job of jobs) {
    const j = await prisma.jenisPekerjaan.create({ data: job });
    jobCache[j.kode_jenis] = j.id_jenis_pekerjaan;
  }

  console.log("Seeding Weights (SAW)...");
  const kriteria = [
    { kode_kriteria: "C1", nama_kriteria: "Pendidikan", bobot: 0.20, keterangan: "Bobot 20%" },
    { kode_kriteria: "C2", nama_kriteria: "Pengalaman Kerja", bobot: 0.25, keterangan: "Bobot 25%" },
    { kode_kriteria: "C3", nama_kriteria: "Sertifikasi", bobot: 0.15, keterangan: "Bobot 15%" },
    { kode_kriteria: "C4", nama_kriteria: "Tes Keterampilan", bobot: 0.25, keterangan: "Bobot 25%" },
    { kode_kriteria: "C5", nama_kriteria: "Wawancara", bobot: 0.15, keterangan: "Bobot 15%" },
  ];
  for (const kmt of kriteria) {
    await prisma.bobotKriteria.create({ data: kmt });
  }

  console.log("Seeding Management Users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const hrdUser = await prisma.pengguna.create({
    data: { email: "hrd@saw.com", kata_sandi: hashedPassword, nama_lengkap: "HRD Recruitment", id_peran: roleCache["hrd"] }
  });
  await prisma.pengguna.create({
    data: { email: "admin@saw.com", kata_sandi: hashedPassword, nama_lengkap: "Super Admin", id_peran: roleCache["admin"] }
  });
  await prisma.pengguna.create({
    data: { email: "manager@saw.com", kata_sandi: hashedPassword, nama_lengkap: "Manager Recruitment", id_peran: roleCache["manajer"] }
  });

  console.log("Seeding Vacancies...");
  const qcLowongan = await prisma.lowongan.create({
    data: {
      id_jenis_pekerjaan: jobCache["QC"],
      id_pengguna: hrdUser.id_pengguna,
      deskripsi: "Mencari Staff Quality Control untuk pabrik.",
      persyaratan: "S1 Teknologi Pangan, 1-2 tahun mapan.",
      lokasi_kerja: "Bekasi",
      tanggal_buka: new Date(),
      tanggal_tutup: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "aktif"
    }
  });

  const whLowongan = await prisma.lowongan.create({
    data: {
      id_jenis_pekerjaan: jobCache["WAREHOUSE"],
      id_pengguna: hrdUser.id_pengguna,
      deskripsi: "Staff Gudang mengurus logistik.",
      persyaratan: "SMA, tangguh.",
      lokasi_kerja: "Tangerang",
      tanggal_buka: new Date(),
      tanggal_tutup: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "aktif"
    }
  });

  console.log("Seeding Applicants and Applications...");
  const lowonganList = [qcLowongan.id_lowongan, whLowongan.id_lowongan];
  const firstNames = ["Andi", "Budi", "Citra", "Dwi", "Eka", "Fajar", "Gita", "Hadi", "Indra", "Joko", "Kartika", "Lestari", "Maya", "Nur", "Oka", "Putri", "Qori", "Rini", "Siti", "Tri", "Umar", "Vina", "Wawan", "Xena", "Yudi", "Zain"];
  const lastNames = ["Saputra", "Santoso", "Lestari", "Pratama", "Putri", "Wijaya", "Kusuma", "Nugroho", "Sari", "Hidayat", "Setiawan", "Siregar", "Firmansyah", "Wahyuni", "Ramadhan"];
  const instNames = ["Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada", "SMK Negeri 1", "SMA Negeri 1", "Politeknik Negeri Jakarta", "Universitas Diponegoro", "Universitas Brawijaya"];
  const educations = ["SMK", "D3", "S1"];
  const certifications = ["Tidak ada", "Sertifikat Internal", "Sertifikat Resmi (HACCP)"];
  
  let pelamarCounter = 0;

  for (const targetLowongan of lowonganList) {
    for (let i = 0; i < 10; i++) {
        pelamarCounter++;
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${fName} ${lName}`;
        const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${pelamarCounter}@dummy.com`;
        const phone = `0812${Math.floor(10000000 + Math.random() * 90000000)}`;
        const edu = educations[Math.floor(Math.random() * educations.length)];
        const inst = instNames[Math.floor(Math.random() * instNames.length)];
        const expCategory = Math.floor(Math.random() * 3); // 0 = 0 years, 1 = 1-2 years, 2 = 3-5 years
        const expYears = expCategory === 0 ? 0 : expCategory === 1 ? Math.floor(1 + Math.random() * 2) : Math.floor(3 + Math.random() * 3);
        const certType = certifications[Math.floor(Math.random() * certifications.length)];

        // Create Pengguna
        const userPelamar = await prisma.pengguna.create({
          data: {
            email: email,
            kata_sandi: hashedPassword,
            nama_lengkap: fullName,
            nomor_telepon: phone,
            id_peran: roleCache["pelamar"]
          }
        });

        // Create Profile
        await prisma.profilPelamar.create({
          data: {
            id_pengguna: userPelamar.id_pengguna,
            nik: `32010123456789${pelamarCounter.toString().padStart(2, '0')}`,
            tempat_lahir: "Jakarta",
            tanggal_lahir: new Date(`199${Math.floor(1 + Math.random() * 8)}-0${Math.floor(1 + Math.random() * 8)}-15`),
            jenis_kelamin: Math.random() > 0.5 ? "L" : "P",
            alamat: `Jl. Dummy Data No. ${pelamarCounter}`,
            pendidikan_terakhir: edu as any,
            jurusan: edu === "SMK" ? "IPA/IPS/Kejuruan" : "Teknik Industri/Pangan",
            nama_institusi: inst,
            tahun_lulus: 2020 - Math.floor(Math.random() * 5),
            berkas_ijazah: "dummy_ijazah.pdf",
            pengalaman_kerja_tahun: expYears,
            pengalaman_bidang: expYears > 0 ? "QC/Warehouse" : "",
            berkas_cv: "dummy_cv.pdf",
            berkas_sertifikat: certType !== "Tidak ada" ? "dummy_cert.pdf" : null,
          }
        });

        // Create Lamaran
        const lamaran = await prisma.lamaran.create({
          data: {
            id_lowongan: targetLowongan,
            id_pengguna: userPelamar.id_pengguna,
            status: "pending",
            tanggal_lamar: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // random last 10 days
          }
        });

        // Generate mock scores following rules:
        // C1: SMK = 60, D3 = 80, S1 = 100
        const c1 = edu === "SMK" ? 60 : edu === "D3" ? 80 : 100;
        // C2: 0th = 50, 1-2th = 75, 3-5th = 100
        const c2 = expCategory === 0 ? 50 : expCategory === 1 ? 75 : 100;
        // C3: None = 0, Internal = 50, Resmi = 100
        const c3 = certType === "Tidak ada" ? 0 : certType === "Sertifikat Internal" ? 50 : 100;

        await prisma.penilaian.create({
          data: {
            id_lamaran: lamaran.id_lamaran,
            id_pengguna: hrdUser.id_pengguna,
            nilai_c1_pendidikan: c1,
            nilai_c2_pengalaman: c2,
            nilai_c3_sertifikasi: c3,
            nilai_c4_tes_keterampilan: Math.floor(60 + Math.random() * 41),
            nilai_c5_wawancara: Math.floor(60 + Math.random() * 41),
          }
        });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
