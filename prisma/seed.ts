import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const defaultPrisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Seed Peran
  await defaultPrisma.peran.upsert({
    where: { nama_peran: "hrd" },
    update: {},
    create: { nama_peran: "hrd", deskripsi: "Human Resources Department" },
  });

  await defaultPrisma.peran.upsert({
    where: { nama_peran: "pelamar" },
    update: {},
    create: { nama_peran: "pelamar", deskripsi: "Pencari Kerja" },
  });

  await defaultPrisma.peran.upsert({
    where: { nama_peran: "manajer" },
    update: {},
    create: { nama_peran: "manajer", deskripsi: "Manajer Perusahaan" },
  });
  
  await defaultPrisma.peran.upsert({
    where: { nama_peran: "admin" },
    update: {},
    create: { nama_peran: "admin", deskripsi: "Administrator Sistem" },
  });

  // Seed JenisPekerjaan
  const jobs = [
    { kode_jenis: "QC", nama_jenis: "Quality Control", deskripsi_umum: "Staf QC" },
    { kode_jenis: "DRIVER", nama_jenis: "Driver", deskripsi_umum: "Sopir Perusahaan" },
    { kode_jenis: "SALES", nama_jenis: "Sales", deskripsi_umum: "Staf Pemasaran" },
    { kode_jenis: "WAREHOUSE", nama_jenis: "Staff Gudang", deskripsi_umum: "Staf Gudang / Warehouse" },
  ];

  for (const job of jobs) {
    await defaultPrisma.jenisPekerjaan.upsert({
      where: { kode_jenis: job.kode_jenis },
      update: {},
      create: job,
    });
  }

  // Seed BobotKriteria
  const kriteria = [
    { kode_kriteria: "C1", nama_kriteria: "Pendidikan", bobot: 0.20, keterangan: "Bobot 20%" },
    { kode_kriteria: "C2", nama_kriteria: "Pengalaman Kerja", bobot: 0.25, keterangan: "Bobot 25%" },
    { kode_kriteria: "C3", nama_kriteria: "Sertifikasi", bobot: 0.15, keterangan: "Bobot 15%" },
    { kode_kriteria: "C4", nama_kriteria: "Tes Keterampilan", bobot: 0.25, keterangan: "Bobot 25%" },
    { kode_kriteria: "C5", nama_kriteria: "Wawancara", bobot: 0.15, keterangan: "Bobot 15%" },
  ];

  for (const kmt of kriteria) {
    await defaultPrisma.bobotKriteria.upsert({
      where: { kode_kriteria: kmt.kode_kriteria },
      update: {},
      create: kmt,
    });
  }

  // Seed Default Management Users
  console.log("Seeding default users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const managementUsers = [
    {
      email: "admin@saw.com",
      nama_lengkap: "Super Admin",
      role: "admin",
    },
    {
      email: "hrd@saw.com",
      nama_lengkap: "HRD Recruitment",
      role: "hrd",
    },
    {
      email: "manager@saw.com",
      nama_lengkap: "Manager Recruitment",
      role: "manajer",
    },
  ];

  for (const mu of managementUsers) {
    const roleObj = await defaultPrisma.peran.findUnique({
      where: { nama_peran: mu.role },
    });

    if (roleObj) {
      const user = await defaultPrisma.pengguna.upsert({
        where: { email: mu.email },
        update: {},
        create: {
          email: mu.email,
          kata_sandi: hashedPassword,
          nama_lengkap: mu.nama_lengkap,
          id_peran: roleObj.id_peran,
        },
      });

      // Seed sample Lowongan for HRD
      if (mu.role === "hrd") {
        const qcType = await defaultPrisma.jenisPekerjaan.findUnique({ where: { kode_jenis: "QC" } });
        const whType = await defaultPrisma.jenisPekerjaan.findUnique({ where: { kode_jenis: "WAREHOUSE" } });
        const salesType = await defaultPrisma.jenisPekerjaan.findUnique({ where: { kode_jenis: "SALES" } });

        if (qcType && whType && salesType) {
          const sampleLowongan = [
            {
              id_jenis_pekerjaan: qcType.id_jenis_pekerjaan,
              id_pengguna: user.id_pengguna,
              deskripsi: "Mencari Staff Quality Control untuk memastikan standar keamanan pangan di pabrik.",
              persyaratan: "Pendidikan min. S1 Teknologi Pangan, pengalaman 1-2 tahun.",
              lokasi_kerja: "Bekasi, Jawa Barat",
              tanggal_buka: new Date(),
              tanggal_tutup: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              status: "aktif" as const,
            },
            {
              id_jenis_pekerjaan: whType.id_jenis_pekerjaan,
              id_pengguna: user.id_pengguna,
              deskripsi: "Dibutuhkan Staff Gudang untuk manajemen stok bahan baku dan pengiriman.",
              persyaratan: "Pendidikan min. SMA/SMK, detail-oriented, sehat jasmani.",
              lokasi_kerja: "Tangerang, Banten",
              tanggal_buka: new Date(),
              tanggal_tutup: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
              status: "aktif" as const,
            },
            {
              id_jenis_pekerjaan: salesType.id_jenis_pekerjaan,
              id_pengguna: user.id_pengguna,
              deskripsi: "Sales Executive untuk menangani klien B2B (pabrik makanan).",
              persyaratan: "Pendidikan min. D3/S1, kemampuan negosiasi tinggi, memiliki kendaraan sendiri.",
              lokasi_kerja: "Jakarta Selatan",
              tanggal_buka: new Date(),
              tanggal_tutup: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
              status: "aktif" as const,
            },
          ];

          for (const low of sampleLowongan) {
            await defaultPrisma.lowongan.create({
              data: low,
            });
          }
        }
      }
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
    await defaultPrisma.$disconnect();
  });
