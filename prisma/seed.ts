import { PrismaClient } from "@prisma/client";

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
