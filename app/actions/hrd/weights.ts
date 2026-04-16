'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getKriteria() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const kriteria = await prisma.bobotKriteria.findMany({
      orderBy: { kode_kriteria: 'asc' }
    });

    // Otomatis seeding jika kosong
    if (kriteria.length === 0) {
      return await seedInitialWeights();
    }

    return { success: true, data: kriteria };
  } catch (error: any) {
    return { error: error.message || "Gagal mengambil data kriteria" };
  }
}

export async function seedInitialWeights() {
  const initialData = [
    { kode_kriteria: 'C1', nama_kriteria: 'Pendidikan Terakhir', bobot: 0.20, keterangan: 'Berdasarkan jenjang pendidikan (SMA/D3/S1/S2)' },
    { kode_kriteria: 'C2', nama_kriteria: 'Pengalaman Kerja', bobot: 0.20, keterangan: 'Dihitung dari total tahun pengalaman' },
    { kode_kriteria: 'C3', nama_kriteria: 'Sertifikasi', bobot: 0.20, keterangan: 'Ada/tidaknya sertifikat kompetensi' },
    { kode_kriteria: 'C4', nama_kriteria: 'Tes Skill', bobot: 0.20, keterangan: 'Nilai dari ujian keterampilan teknis' },
    { kode_kriteria: 'C5', nama_kriteria: 'Wawancara', bobot: 0.20, keterangan: 'Nilai dari sesi interview HRD/User' },
  ];

  try {
    const created = await Promise.all(
      initialData.map(item => 
        prisma.bobotKriteria.upsert({
          where: { kode_kriteria: item.kode_kriteria },
          update: {},
          create: item
        })
      )
    );
    return { success: true, data: created };
  } catch (error: any) {
    return { error: "Gagal menginisialisasi data kriteria" };
  }
}

export async function updateWeights(weights: { id: string, bobot: number }[]) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  // Validasi: Total harus 1.0 (dengan toleransi pembulatan)
  const total = weights.reduce((acc, curr) => acc + curr.bobot, 0);
  if (Math.abs(total - 1.0) > 0.0001) {
    return { error: `Total bobot harus tepat 1.0 (Total saat ini: ${total.toFixed(2)})` };
  }

  try {
    // Update menggunakan transaction untuk keamanan data
    await prisma.$transaction(
      weights.map(item => 
        prisma.bobotKriteria.update({
          where: { id_bobot: item.id },
          data: { bobot: item.bobot }
        })
      )
    );

    revalidatePath("/dashboard/bobot-kriteria");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal memperbarui bobot" };
  }
}

export async function resetWeightsToDefault() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const kriteria = await prisma.bobotKriteria.findMany();
    if (kriteria.length === 0) return { error: "Data kriteria tidak ditemukan" };

    const average = 1 / kriteria.length;

    await prisma.$transaction(
      kriteria.map(item => 
        prisma.bobotKriteria.update({
          where: { id_bobot: item.id_bobot },
          data: { bobot: average }
        })
      )
    );

    revalidatePath("/dashboard/bobot-kriteria");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal mereset bobot" };
  }
}
