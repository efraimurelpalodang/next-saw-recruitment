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
  const peranHrd = await defaultPrisma.peran.upsert({
    where: { namaPeran: "hrd" },
    update: {},
    create: { namaPeran: "hrd" },
  });

  const peranPelamar = await defaultPrisma.peran.upsert({
    where: { namaPeran: "pelamar" },
    update: {},
    create: { namaPeran: "pelamar" },
  });

  const peranManager = await defaultPrisma.peran.upsert({
    where: { namaPeran: "manager" },
    update: {},
    create: { namaPeran: "manager" },
  });

  // Seed JenisPekerjaan
  const jobs = [
    { kode: "QC", nama: "Quality Control", deskripsi: "Staf QC" },
    { kode: "DRV", nama: "Driver", deskripsi: "Sopir Perusahaan" },
    { kode: "SLS", nama: "Sales", deskripsi: "Staf Pemasaran" },
    { kode: "WH", nama: "Staff Gudang", deskripsi: "Staf Gudang / Warehouse" },
  ];

  for (const job of jobs) {
    await defaultPrisma.jenisPekerjaan.upsert({
      where: { kode: job.kode },
      update: {},
      create: job,
    });
  }

  // Seed BobotKriteria
  const kriteria = [
    { kode: "C1", nama: "Pendidikan", bobot: 0.20 },
    { kode: "C2", nama: "Pengalaman Kerja", bobot: 0.25 },
    { kode: "C3", nama: "Usia", bobot: 0.15 },
    { kode: "C4", nama: "Hasil Tes/Wawancara", bobot: 0.25 },
    { kode: "C5", nama: "Jarak Tempat Tinggal", bobot: 0.15 },
  ];

  for (const kmt of kriteria) {
    await defaultPrisma.bobotKriteria.upsert({
      where: { kode: kmt.kode },
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
