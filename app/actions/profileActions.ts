'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { profileSchema } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: any) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    // 1. Cek apakah ada lamaran aktif
    const activeApplication = await prisma.lamaran.findFirst({
      where: {
        id_pengguna: session.id_pengguna,
        NOT: {
          status: 'keputusan'
        }
      }
    });

    if (activeApplication) {
      return { error: "Profil tidak dapat diubah saat ada lamaran aktif" };
    }

    // 2. Validasi data
    const validatedData = profileSchema.parse({
      ...formData,
      tahun_lulus: parseInt(formData.tahun_lulus),
      pengalaman_kerja_tahun: parseInt(formData.pengalaman_kerja_tahun),
      tanggal_lahir: new Date(formData.tanggal_lahir),
    });

    // 3. Update atau create profil
    const result = await prisma.profilPelamar.upsert({
      where: { id_pengguna: session.id_pengguna },
      update: {
        ...validatedData,
      },
      create: {
        id_pengguna: session.id_pengguna,
        ...validatedData,
        berkas_ijazah: formData.berkas_ijazah || "",
        berkas_cv: formData.berkas_cv || "",
        berkas_sertifikat: formData.berkas_sertifikat || "",
      },
    });

    if (formData.nama_lengkap) {
      await prisma.pengguna.update({
        where: { id_pengguna: session.id_pengguna },
        data: { nama_lengkap: formData.nama_lengkap }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/cv");
    revalidatePath("/dashboard/lamaran");
    
    return { success: true, data: result };
  } catch (error: any) {
    if (error.name === "ZodError") {
      return { error: "Validasi gagal", details: error.errors };
    }
    return { error: error.message || "Terjadi kesalahan sistem" };
  }
}
