'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Logika Perhitungan Otomatis:
 * C1 (Pendidikan): S3=100, S2=90, S1=80, D3=70, SMA/SMK=60
 * C2 (Pengalaman): >=5th=100, 3-4th=80, 1-2th=60, <1th=40
 * C3 (Sertifikasi): Ada=100, Tidak ada=50
 */
function calculateAutoScores(profil: any) {
  let c1 = 60; // Default SMA/SMK
  if (profil.pendidikan_terakhir === 'S3') c1 = 100;
  else if (profil.pendidikan_terakhir === 'S2') c1 = 90;
  else if (profil.pendidikan_terakhir === 'S1') c1 = 80;
  else if (profil.pendidikan_terakhir === 'D3') c1 = 70;

  let c2 = 40; // Default < 1th
  const tahun = profil.pengalaman_kerja_tahun || 0;
  if (tahun >= 5) c2 = 100;
  else if (tahun >= 3) c2 = 80;
  else if (tahun >= 1) c2 = 60;

  let c3 = profil.berkas_sertifikat ? 100 : 50;

  return { c1, c2, c3 };
}

export async function getLowonganWithStats() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const lowongan = await prisma.lowongan.findMany({
      where: { status: { in: ['aktif', 'tutup'] } }, // Tampilkan yang aktif & tutup untuk penilaian
      include: {
        jenis_pekerjaan: true,
        _count: {
          select: { lamaran: true }
        }
      },
      orderBy: { dibuat_pada: 'desc' }
    });

    return { success: true, data: lowongan };
  } catch (error: any) {
    return { error: "Gagal mengambil data lowongan" };
  }
}

export async function getApplicantsByLowongan(lowonganId: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const applicants = await prisma.lamaran.findMany({
      where: { id_lowongan: lowonganId },
      include: {
        pengguna: {
          select: {
            nama_lengkap: true,
            profil: true
          }
        },
        penilaian: true
      },
      orderBy: { dibuat_pada: 'asc' }
    });

    return { success: true, data: applicants };
  } catch (error: any) {
    return { error: "Gagal mengambil data pelamar" };
  }
}

export async function saveAssessment(data: {
  id_lamaran: string;
  nilai_c4: number;
  nilai_c5: number;
}) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    // 1. Ambil data lamaran & profil untuk hitung nilai otomatis
    const lamaran = await prisma.lamaran.findUnique({
      where: { id_lamaran: data.id_lamaran },
      include: {
        pengguna: {
          include: { profil: true }
        }
      }
    });

    if (!lamaran || !lamaran.pengguna.profil) {
      return { error: "Data pelamar atau profil tidak ditemukan" };
    }

    // 2. Hitung nilai otomatis (C1-C3)
    const { c1, c2, c3 } = calculateAutoScores(lamaran.pengguna.profil);

    // 3. Simpan atau Update Penilaian
    const penilaian = await prisma.penilaian.upsert({
      where: { id_lamaran: data.id_lamaran },
      update: {
        nilai_c1_pendidikan: c1,
        nilai_c2_pengalaman: c2,
        nilai_c3_sertifikasi: c3,
        nilai_c4_tes_keterampilan: data.nilai_c4,
        nilai_c5_wawancara: data.nilai_c5,
        id_pengguna: session.id_pengguna,
        tanggal_penilaian: new Date(),
      },
      create: {
        id_lamaran: data.id_lamaran,
        nilai_c1_pendidikan: c1,
        nilai_c2_pengalaman: c2,
        nilai_c3_sertifikasi: c3,
        nilai_c4_tes_keterampilan: data.nilai_c4,
        nilai_c5_wawancara: data.nilai_c5,
        id_pengguna: session.id_pengguna,
      }
    });

    // 4. Update status lamaran ke 'tes_skill' atau 'wawancara' jika baru dinilai
    // (Opsional: Kita set ke 'wawancara' atau 'rekomendasi' setelah penilaian lengkap)
    if (lamaran.status !== 'rekomendasi') {
      await prisma.lamaran.update({
        where: { id_lamaran: data.id_lamaran },
        data: { status: 'wawancara' }
      });
    }

    revalidatePath("/dashboard/penilaian");
    return { success: true, data: penilaian };
  } catch (error: any) {
    console.error("Save Error:", error);
    return { error: "Gagal menyimpan penilaian" };
  }
}
