'use server';

import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

function sanitizeFileName(fileName: string): string {
  // Ambil nama file tanpa ekstensi
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : '';

  // Sanitasi: ganti spasi dengan dash, hapus karakter spesial
  const sanitized = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  return ext ? `${sanitized}.${ext}` : sanitized;
}

export async function uploadDocument(file: File, type: 'ijazah' | 'cv' | 'sertifikat') {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  // Aturan Validasi Tipe File (Wajib)
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Format file tidak diizinkan. Hanya PDF/JPG/PNG." };
  }

  // Aturan Validasi Ukuran (Max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "Ukuran file terlalu besar. Maksimal 2MB." };
  }

  try {
    const sanitizedName = sanitizeFileName(file.name);
    const timestamp = Date.now();
    
    // ATURAN 3: Folder Structure userId/filename
    const filePath = `${session.id_pengguna}/${timestamp}-${sanitizedName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('dokumen-pelamar')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('dokumen-pelamar')
      .getPublicUrl(filePath);

    // Update database
    const updateData: any = {};
    if (type === 'ijazah') updateData.berkas_ijazah = publicUrl;
    else if (type === 'cv') updateData.berkas_cv = publicUrl;
    else if (type === 'sertifikat') updateData.berkas_sertifikat = publicUrl;

    await prisma.profilPelamar.update({
      where: { id_pengguna: session.id_pengguna },
      data: updateData
    });

    return { success: true, url: publicUrl };
  } catch (error: any) {
    return { error: error.message || "Gagal mengunggah file" };
  }
}

export async function deleteDocument(url: string, type: 'ijazah' | 'cv' | 'sertifikat') {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    // Extract path from public URL
    // Public URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const path = url.split('dokumen-pelamar/').pop();
    if (!path) throw new Error("Format URL tidak valid");

    const { error } = await supabaseAdmin.storage
      .from('dokumen-pelamar')
      .remove([path]);

    if (error) throw error;

    // Update database to null
    const updateData: any = {};
    if (type === 'ijazah') updateData.berkas_ijazah = "";
    else if (type === 'cv') updateData.berkas_cv = "";
    else if (type === 'sertifikat') updateData.berkas_sertifikat = null;

    await prisma.profilPelamar.update({
      where: { id_pengguna: session.id_pengguna },
      data: updateData
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus file" };
  }
}
