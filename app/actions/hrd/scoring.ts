"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function processSAWScoring(id_lowongan: string) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  try {
    // 1. Ambil data kandidat yang ada pada lowongan ini
    const pelamar = await prisma.lamaran.findMany({
      where: { id_lowongan, status: { not: "ditolak" } }, // yang sudah ditolak mungkin tidak dihitung lagi, atau boleh dihitung semua. Kita batasi ini saja.
      include: {
        penilaian: true
      }
    });

    if (pelamar.length === 0) {
      return { error: "Belum ada pelamar pada lowongan ini." };
    }

    // Pastikan semua pelamar memiliki data penilaian
    const missingScoring = pelamar.filter(p => !p.penilaian);
    if (missingScoring.length > 0) {
      return { error: `Terdapat ${missingScoring.length} kandidat yang nilainya belum lengkap (C1-C5).` };
    }

    // 2. Ambil Master Bobot
    const weights = await prisma.bobotKriteria.findMany();
    const wMap: Record<string, number> = {};
    weights.forEach(w => wMap[w.kode_kriteria] = w.bobot);

    // Default bobot jika dari DB kosong (fallback safety)
    const W1 = wMap['C1'] || 0.2;
    const W2 = wMap['C2'] || 0.25;
    const W3 = wMap['C3'] || 0.15;
    const W4 = wMap['C4'] || 0.25;
    const W5 = wMap['C5'] || 0.15;

    // 3. Cari Nilai MAX untuk setiap kolom kriteria (Kriteria Benefit)
    let maxC1 = 0, maxC2 = 0, maxC3 = 0, maxC4 = 0, maxC5 = 0;
    
    pelamar.forEach(p => {
      const pn = p.penilaian!;
      if (pn.nilai_c1_pendidikan > maxC1) maxC1 = pn.nilai_c1_pendidikan;
      if (pn.nilai_c2_pengalaman > maxC2) maxC2 = pn.nilai_c2_pengalaman;
      if (pn.nilai_c3_sertifikasi > maxC3) maxC3 = pn.nilai_c3_sertifikasi;
      if (pn.nilai_c4_tes_keterampilan > maxC4) maxC4 = pn.nilai_c4_tes_keterampilan;
      if (pn.nilai_c5_wawancara > maxC5) maxC5 = pn.nilai_c5_wawancara;
    });

    // Menghindari division by zero
    maxC1 = maxC1 === 0 ? 1 : maxC1;
    maxC2 = maxC2 === 0 ? 1 : maxC2;
    maxC3 = maxC3 === 0 ? 1 : maxC3;
    maxC4 = maxC4 === 0 ? 1 : maxC4;
    maxC5 = maxC5 === 0 ? 1 : maxC5;

    const scoringResults = [];

    // 4. Kalkulasi Normalisasi dan Preferensi Akhir (V)
    for (const p of pelamar) {
      const pn = p.penilaian!;
      
      const normC1 = pn.nilai_c1_pendidikan / maxC1;
      const normC2 = pn.nilai_c2_pengalaman / maxC2;
      const normC3 = pn.nilai_c3_sertifikasi / maxC3;
      const normC4 = pn.nilai_c4_tes_keterampilan / maxC4;
      const normC5 = pn.nilai_c5_wawancara / maxC5;

      const V = (normC1 * W1) + (normC2 * W2) + (normC3 * W3) + (normC4 * W4) + (normC5 * W5);

      scoringResults.push({
        id_penilaian: pn.id_penilaian,
        normC1, normC2, normC3, normC4, normC5,
        V
      });
    }

    // 5. Urutkan berdasarkan V (Tertinggi -> Peringkat 1)
    scoringResults.sort((a, b) => b.V - a.V);

    // 6. Simpan kembali ke Database
    for (let i = 0; i < scoringResults.length; i++) {
      const res = scoringResults[i];
      await prisma.penilaian.update({
        where: { id_penilaian: res.id_penilaian },
        data: {
          normalisasi_c1: res.normC1,
          normalisasi_c2: res.normC2,
          normalisasi_c3: res.normC3,
          normalisasi_c4: res.normC4,
          normalisasi_c5: res.normC5,
          nilai_preferensi: res.V,
          peringkat: i + 1,
          rekomendasi_sistem: (i < 3) // Misal merekomendasikan top 3 pelamar per lowongan
        }
      });
    }

    revalidatePath("/dashboard/scoring");
    revalidatePath("/dashboard/applicants");
    return { success: true, message: "Kalkulasi Nilai SAW berhasil dilakukan." };
    
  } catch (error: any) {
    console.error("Error SAW computation:", error);
    return { error: "Terjadi kesalahan internal ketika menghitung algoritma SAW." };
  }
}

export async function getScoringDataForVacancy(id_lowongan: string) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") throw new Error("Unauthorized");

  const records = await prisma.lamaran.findMany({
    where: { id_lowongan, status: { not: "ditolak" } },
    include: {
      pengguna: { select: { nama_lengkap: true, email: true } },
      penilaian: true
    },
    orderBy: {
      penilaian: { peringkat: 'asc' }
    }
  });

  return records;
}
