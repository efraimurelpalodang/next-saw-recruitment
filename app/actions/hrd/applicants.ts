'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getApplicantsByLowongan(lowonganId: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const lamaran = await prisma.lamaran.findMany({
      where: { id_lowongan: lowonganId },
      include: {
        pengguna: {
          select: {
            id_pengguna: true,
            nama_lengkap: true,
            email: true,
            nomor_telepon: true,
          }
        },
        penilaian: {
          select: {
            nilai_preferensi: true,
            peringkat: true,
          }
        }
      },
      orderBy: { tanggal_lamar: 'desc' }
    });

    const lowongan = await prisma.lowongan.findUnique({
      where: { id_lowongan: lowonganId },
      include: { jenis_pekerjaan: true }
    });

    return { success: true, data: { lamaran, lowongan } };
  } catch (error: any) {
    return { error: "Gagal mengambil data pelamar" };
  }
}

export async function getApplicantDetail(lamaranId: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const lamaran = await prisma.lamaran.findUnique({
      where: { id_lamaran: lamaranId },
      include: {
        lowongan: {
          include: { jenis_pekerjaan: true }
        },
        pengguna: {
          include: {
            profil: true,
          },
          // Only select safe non-sensitive fields
        },
        penilaian: true,
      }
    });

    if (!lamaran) return { error: "Data lamaran tidak ditemukan" };

    return { success: true, data: lamaran };
  } catch (error: any) {
    return { error: "Gagal mengambil detail pelamar" };
  }
}
