"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getApplicants() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  const lamaranList = await prisma.lamaran.findMany({
    include: {
      pengguna: {
        include: { profil: true }
      },
      lowongan: {
        include: { jenis_pekerjaan: true }
      },
      penilaian: true
    },
    orderBy: { tanggal_lamar: 'desc' }
  });

  return lamaranList;
}

export async function getApplicantDetail(id_lamaran: string) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  const lamaran = await prisma.lamaran.findUnique({
    where: { id_lamaran },
    include: {
      pengguna: {
        include: { profil: true }
      },
      lowongan: {
        include: { jenis_pekerjaan: true }
      },
      penilaian: true
    }
  });

  return lamaran;
}

export async function updateLamaranStatus(id_lamaran: string, status: any, catatan?: string) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  try {
    await prisma.lamaran.update({
      where: { id_lamaran },
      data: { 
        status,
        ...(catatan !== undefined && { catatan_hrd: catatan })
      }
    });

    revalidatePath("/dashboard/applicants");
    revalidatePath(`/dashboard/applicants/${id_lamaran}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating lamaran status:", error);
    return { error: "Gagal memperbarui status lamaran." };
  }
}

export async function updateKeputusanHRD(id_lamaran: string, keputusan: any, catatan?: string) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  try {
    await prisma.lamaran.update({
      where: { id_lamaran },
      data: { 
        keputusan_hrd: keputusan,
        status: "keputusan",
        tanggal_keputusan: new Date(),
        ...(catatan !== undefined && { catatan_hrd: catatan })
      }
    });

    revalidatePath("/dashboard/applicants");
    revalidatePath(`/dashboard/applicants/${id_lamaran}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating keputusan:", error);
    return { error: "Gagal menyimpan keputusan HRD." };
  }
}
