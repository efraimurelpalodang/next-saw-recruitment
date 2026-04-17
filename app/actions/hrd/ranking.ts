'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getLowonganForRanking() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const lowongan = await prisma.lowongan.findMany({
      where: {
        lamaran: {
          some: {
            penilaian: { isNot: null }
          }
        }
      },
      include: {
        jenis_pekerjaan: true,
        _count: {
          select: {
            lamaran: {
              where: { penilaian: { isNot: null } }
            }
          }
        }
      },
      orderBy: { dibuat_pada: 'desc' }
    });

    return { success: true, data: lowongan };
  } catch (error: any) {
    return { error: "Gagal mengambil data lowongan" };
  }
}

export async function calculateRanking(lowonganId: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    // 1. Ambil data penilaian penilai (HRD) dan bobot kriteria
    const [penilaianList, bobotList] = await Promise.all([
      prisma.penilaian.findMany({
        where: {
          lamaran: { id_lowongan: lowonganId }
        },
        include: {
          lamaran: {
            include: {
              pengguna: {
                select: { 
                  nama_lengkap: true,
                  profil: { select: { nama_institusi: true } }
                }
              }
            }
          }
        }
      }),
      prisma.bobotKriteria.findMany()
    ]);

    if (penilaianList.length === 0) return { error: "Belum ada pelamar yang dinilai" };
    if (bobotList.length === 0) return { error: "Bobot kriteria belum diatur" };

    // 2. Mapping bobot ke object untuk akses cepat
    const weights: Record<string, number> = {};
    bobotList.forEach(b => {
      weights[b.kode_kriteria] = b.bobot;
    });

    // 3. Cari Nilai Maksimal per Kriteria (Normalisasi Benefit)
    const max = {
      c1: Math.max(...penilaianList.map(p => p.nilai_c1_pendidikan)),
      c2: Math.max(...penilaianList.map(p => p.nilai_c2_pengalaman)),
      c3: Math.max(...penilaianList.map(p => p.nilai_c3_sertifikasi)),
      c4: Math.max(...penilaianList.map(p => p.nilai_c4_tes_keterampilan)),
      c5: Math.max(...penilaianList.map(p => p.nilai_c5_wawancara)),
    };

    // Helper: Hindari division by zero
    const safeDiv = (val: number, maxVal: number) => maxVal > 0 ? val / maxVal : 0;

    // 4. Hitung Normalisasi & Preferensi
    const results = penilaianList.map(p => {
      const r1 = safeDiv(p.nilai_c1_pendidikan, max.c1);
      const r2 = safeDiv(p.nilai_c2_pengalaman, max.c2);
      const r3 = safeDiv(p.nilai_c3_sertifikasi, max.c3);
      const r4 = safeDiv(p.nilai_c4_tes_keterampilan, max.c4);
      const r5 = safeDiv(p.nilai_c5_wawancara, max.c5);

      const preferenceValue = 
        (r1 * (weights['C1'] || 0)) +
        (r2 * (weights['C2'] || 0)) +
        (r3 * (weights['C3'] || 0)) +
        (r4 * (weights['C4'] || 0)) +
        (r5 * (weights['C5'] || 0));

      return {
        id_penilaian: p.id_penilaian,
        normalisasi: { r1, r2, r3, r4, r5 },
        nilai_preferensi: preferenceValue,
        // Data pendukung untuk UI
        nama_pelamar: p.lamaran.pengguna.nama_lengkap,
        institusi: p.lamaran.pengguna.profil?.nama_institusi || "-",
        nilai_asli: {
          c1: p.nilai_c1_pendidikan,
          c2: p.nilai_c2_pengalaman,
          c3: p.nilai_c3_sertifikasi,
          c4: p.nilai_c4_tes_keterampilan,
          c5: p.nilai_c5_wawancara,
        },
        id_lamaran: p.id_lamaran,
        keputusan: p.lamaran.keputusan_hrd
      };
    });

    // 5. Urutkan berdasarkan Preferensi Terbesar
    results.sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);

    // 6. Update database secara batch (Opsional untuk performa, tapi bagus untuk persistensi)
    // Di sini kita simpan hasil perhitungan ke DB agar bisa diakses nanti
    await prisma.$transaction(
      results.map((res, index) => 
        prisma.penilaian.update({
          where: { id_penilaian: res.id_penilaian },
          data: {
            normalisasi_c1: res.normalisasi.r1,
            normalisasi_c2: res.normalisasi.r2,
            normalisasi_c3: res.normalisasi.r3,
            normalisasi_c4: res.normalisasi.r4,
            normalisasi_c5: res.normalisasi.r5,
            nilai_preferensi: res.nilai_preferensi,
            peringkat: index + 1
          }
        })
      )
    );

    return { success: true, data: results };
  } catch (error: any) {
    console.error("Ranking Error:", error);
    return { error: "Gagal memproses perhitungan ranking" };
  }
}

export async function saveDecision(lamaranId: string, decision: 'diterima' | 'ditolak' | 'cadangan') {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    await prisma.lamaran.update({
      where: { id_lamaran: lamaranId },
      data: {
        keputusan_hrd: decision,
        tanggal_keputusan: new Date(),
        status: 'keputusan'
      }
    });

    revalidatePath("/dashboard/ranking");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menyimpan keputusan HRD" };
  }
}
