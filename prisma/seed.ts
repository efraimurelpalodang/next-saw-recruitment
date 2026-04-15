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
  const dummyApplicants = [
    { name: "Andi Saputra", email: "andi@gmail.com", edukasi: "S1", jurusan: "Teknologi Pangan" },
    { name: "Dewi Lestari", email: "dewi.l@gmail.com", edukasi: "S1", jurusan: "Teknik Kimia" },
    { name: "Budi Cahyono", email: "budi.c@yahoo.com", edukasi: "SMA", jurusan: "IPA" },
    { name: "Siti Aminah", email: "siti.a@gmail.com", edukasi: "SMK", jurusan: "Logistik" },
  ];

  for (let i = 0; i < dummyApplicants.length; i++) {
    const p = dummyApplicants[i];
    
    // Create Pengguna
    const userPelamar = await prisma.pengguna.create({
      data: {
        email: p.email,
        kata_sandi: hashedPassword,
        nama_lengkap: p.name,
        id_peran: roleCache["pelamar"]
      }
    });

    // Create Profile
    await prisma.profilPelamar.create({
      data: {
        id_pengguna: userPelamar.id_pengguna,
        nik: `320101234567890${i}`,
        tempat_lahir: "Jakarta",
        tanggal_lahir: new Date("1995-01-01"),
        jenis_kelamin: "L",
        alamat: "Jl. Sudirman",
        pendidikan_terakhir: p.edukasi as any,
        jurusan: p.jurusan,
        nama_institusi: "Universitas Indonesia",
        tahun_lulus: 2018,
        berkas_ijazah: "",
        pengalaman_kerja_tahun: Math.floor(Math.random() * 5),
        berkas_cv: "",
      }
    });

    // Apply for QC or Warehouse based on applicant index
    const isQC = i < 2;
    const targetLowongan = isQC ? qcLowongan.id_lowongan : whLowongan.id_lowongan;
    
    const lamaran = await prisma.lamaran.create({
      data: {
        id_lowongan: targetLowongan,
        id_pengguna: userPelamar.id_pengguna,
        status: "pending"
      }
    });

    // Add Penilaian automatically (dummy scoring C1-C5, max 100 per criteria)
    await prisma.penilaian.create({
      data: {
        id_lamaran: lamaran.id_lamaran,
        id_pengguna: hrdUser.id_pengguna,
        nilai_c1_pendidikan: 80 + Math.random() * 20,
        nilai_c2_pengalaman: 70 + Math.random() * 30,
        nilai_c3_sertifikasi: 60 + Math.random() * 40,
        nilai_c4_tes_keterampilan: 75 + Math.random() * 25,
        nilai_c5_wawancara: 85 + Math.random() * 15,
      }
    });
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
