"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function updateProfile(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const id_pengguna = session.id_pengguna;

    // Extract text data
    const nama_lengkap = formData.get("nama_lengkap") as string;
    const nik = formData.get("nik") as string;
    const tempat_lahir = formData.get("tempat_lahir") as string;
    const tanggal_lahir_str = formData.get("tanggal_lahir") as string;
    const jenis_kelamin = formData.get("jenis_kelamin") as string;
    const alamat = formData.get("alamat") as string;
    const pendidikan_terakhir = formData.get("pendidikan_terakhir") as string;
    const institusi = formData.get("institusi") as string;
    const jurusan = formData.get("jurusan") as string;
    const tahun_lulus = formData.get("tahun_lulus") as string;
    const pengalaman_tahun = formData.get("pengalaman_tahun") as string;
    const bidang_pengalaman = formData.get("bidang_pengalaman") as string;

    // Update Pengguna (Nama)
    if (nama_lengkap) {
      await prisma.pengguna.update({
        where: { id_pengguna },
        data: { nama_lengkap },
      });
    }

    // Handle File Uploads (if bucket 'pelamar-documents' exists)
    // For this example, if the bucket isn't explicitly set up, we'll try to upload to 'documents' or 'pelamar'
    // Let's assume the user has a generic bucket named "documents" or similar.
    let berkas_ijazah_url = undefined;
    let berkas_cv_url = undefined;

    const ijazahFile = formData.get("file_ijazah") as File | null;
    if (ijazahFile && ijazahFile.size > 0) {
      const ext = ijazahFile.name.split('.').pop();
      const filename = `ijazah_${id_pengguna}_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('documents') // Assuming 'documents' bucket exists
        .upload(filename, ijazahFile, {
          cacheControl: '3600',
          upsert: true,
        });
      
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(data.path);
        berkas_ijazah_url = publicUrlData.publicUrl;
      } else {
        console.error("Ijazah upload error:", error);
      }
    }

    const cvFile = formData.get("file_cv") as File | null;
    if (cvFile && cvFile.size > 0) {
      const ext = cvFile.name.split('.').pop();
      const filename = `cv_${id_pengguna}_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filename, cvFile, {
          cacheControl: '3600',
          upsert: true,
        });
      
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(data.path);
        berkas_cv_url = publicUrlData.publicUrl;
      } else {
        console.error("CV upload error:", error);
      }
    }

    // Update ProfilPelamar
    const profilData: any = {
      nik,
      tempat_lahir,
      tanggal_lahir: tanggal_lahir_str ? new Date(tanggal_lahir_str) : null,
      jenis_kelamin,
      alamat,
      pendidikan_terakhir,
      nama_institusi: institusi,
      jurusan,
      tahun_lulus: tahun_lulus ? parseInt(tahun_lulus) : null,
      pengalaman_kerja_tahun: pengalaman_tahun ? parseInt(pengalaman_tahun) : 0,
      pengalaman_bidang: bidang_pengalaman,
    };

    if (berkas_ijazah_url) profilData.berkas_ijazah = berkas_ijazah_url;
    const createData = {
      id_pengguna,
      berkas_ijazah: berkas_ijazah_url || "",
      berkas_cv: berkas_cv_url || "",
      ...profilData,
    };

    await prisma.profilPelamar.upsert({
      where: { id_pengguna },
      update: profilData,
      create: createData,
    });

    revalidatePath("/applicant/profil");
    revalidatePath("/applicant/dashboard");

    return { success: true, message: "Profil berhasil diperbarui" };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, message: error.message || "Terjadi kesalahan" };
  }
}
