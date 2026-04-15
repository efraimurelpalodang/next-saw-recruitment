"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getVacancies() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  const vacancies = await prisma.lowongan.findMany({
    where: { id_pengguna: session.id_pengguna },
    include: {
      jenis_pekerjaan: true,
      _count: {
        select: { lamaran: true }
      }
    },
    orderBy: { dibuat_pada: 'desc' }
  });

  return vacancies;
}

export async function getJobTypes() {
  return await prisma.jenisPekerjaan.findMany({
    where: { status_aktif: true }
  });
}

export async function createVacancy(data: {
  id_jenis_pekerjaan: string;
  deskripsi: string;
  persyaratan: string;
  lokasi_kerja: string;
  tanggal_buka: string;
  tanggal_tutup: string;
}) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  try {
    await prisma.lowongan.create({
      data: {
        id_pengguna: session.id_pengguna,
        id_jenis_pekerjaan: data.id_jenis_pekerjaan,
        deskripsi: data.deskripsi,
        persyaratan: data.persyaratan,
        lokasi_kerja: data.lokasi_kerja,
        tanggal_buka: new Date(data.tanggal_buka),
        tanggal_tutup: new Date(data.tanggal_tutup),
        status: "aktif"
      }
    });
    
    revalidatePath("/dashboard/vacancies");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating vacancy:", error);
    return { error: "Gagal membuat lowongan." };
  }
}

export async function updateVacancyStatus(id_lowongan: string, newStatus: 'aktif' | 'tutup' | 'selesai') {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  try {
    await prisma.lowongan.update({
      where: { id_lowongan },
      data: { status: newStatus }
    });

    revalidatePath("/dashboard/vacancies");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating vacancy:", error);
    return { error: "Gagal memperbarui status lowongan." };
  }
}
