'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getLowonganSummary() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const lowongan = await prisma.lowongan.findMany({
      where: {
        lamaran: {
          some: {
            keputusan_hrd: { not: null }
          }
        }
      },
      include: {
        jenis_pekerjaan: true,
        _count: {
          select: {
            lamaran: {
              where: { keputusan_hrd: { not: null } }
            }
          }
        }
      },
      orderBy: { dibuat_pada: 'desc' }
    });

    return { success: true, data: lowongan };
  } catch (error: any) {
    return { error: "Gagal mengambil data ringkasan lowongan" };
  }
}

export async function getDecisionResults(lowonganId: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const results = await prisma.lamaran.findMany({
      where: { 
        id_lowongan: lowonganId,
        keputusan_hrd: { not: null }
      },
      include: {
        pengguna: {
          select: {
            nama_lengkap: true,
            profil: { select: { nama_institusi: true } }
          }
        },
        penilaian: true
      },
      orderBy: [
        { penilaian: { peringkat: 'asc' } },
        { penilaian: { nilai_preferensi: 'desc' } }
      ]
    });

    return { success: true, data: results };
  } catch (error: any) {
    return { error: "Gagal mengambil detail keputusan" };
  }
}
