'use server';

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getLowongan() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const lowongan = await prisma.lowongan.findMany({
      include: {
        jenis_pekerjaan: true,
        pengguna: {
          select: {
            nama_lengkap: true
          }
        },
        _count: {
          select: {
            lamaran: true
          }
        }
      },
      orderBy: { dibuat_pada: 'desc' }
    });

    return { success: true, data: lowongan };
  } catch (error: any) {
    return { error: error.message || "Gagal mengambil data lowongan" };
  }
}

export async function getJenisPekerjaan() {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const jenis = await prisma.jenisPekerjaan.findMany({
      where: { status_aktif: true },
      orderBy: { nama_jenis: 'asc' }
    });
    return { success: true, data: jenis };
  } catch (error: any) {
    return { error: "Gagal mengambil data jenis pekerjaan" };
  }
}

export async function upsertLowongan(data: any) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  const { id_lowongan, id_jenis_pekerjaan, deskripsi, persyaratan, lokasi_kerja, tanggal_buka, tanggal_tutup } = data;

  // Validasi Dasar
  if (!id_jenis_pekerjaan || !deskripsi || !persyaratan || !lokasi_kerja || !tanggal_buka || !tanggal_tutup) {
    return { error: "Semua field wajib diisi" };
  }

  const tBuka = new Date(tanggal_buka);
  const tTutup = new Date(tanggal_tutup);

  if (tTutup <= tBuka) {
    return { error: "Tanggal tutup harus setelah tanggal buka" };
  }

  try {
    if (id_lowongan) {
      // Logic Update
      const existing = await prisma.lowongan.findUnique({
        where: { id_lowongan },
        include: { _count: { select: { lamaran: true } } }
      });

      if (!existing) return { error: "Lowongan tidak ditemukan" };

      // Cek jika ganti jenis pekerjaan tapi sudah ada pelamar
      if (existing.id_jenis_pekerjaan !== id_jenis_pekerjaan && existing._count.lamaran > 0) {
        return { error: "Tidak dapat mengubah jenis pekerjaan karena sudah ada pelamar" };
      }

      await prisma.lowongan.update({
        where: { id_lowongan },
        data: {
          id_jenis_pekerjaan,
          deskripsi,
          persyaratan,
          lokasi_kerja,
          tanggal_buka: tBuka,
          tanggal_tutup: tTutup,
        }
      });
    } else {
      // Logic Create
      // CEK DUPLIKAT: Pastikan tidak ada lowongan AKTIF untuk jenis pekerjaan yang sama
      const activeDuplicate = await prisma.lowongan.findFirst({
        where: {
          id_jenis_pekerjaan,
          status: 'aktif'
        }
      });

      if (activeDuplicate) {
        return { error: "Lowongan untuk posisi ini masih aktif. Tutup lowongan lama terlebih dahulu untuk membuat yang baru." };
      }

      await prisma.lowongan.create({
        data: {
          id_pengguna: session.id_pengguna,
          id_jenis_pekerjaan,
          deskripsi,
          persyaratan,
          lokasi_kerja,
          tanggal_buka: tBuka,
          tanggal_tutup: tTutup,
          status: 'aktif',
          status_aktif: true
        }
      });
    }

    revalidatePath("/dashboard/lowongan");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menyimpan data lowongan" };
  }
}

export async function toggleLowonganStatus(id: string, currentStatus: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const newStatus = currentStatus === 'aktif' ? 'tutup' : 'aktif';
    const newStatusAktif = (newStatus === 'aktif');

    await prisma.lowongan.update({
      where: { id_lowongan: id },
      data: {
        status: newStatus as any,
        status_aktif: newStatusAktif
      }
    });

    revalidatePath("/dashboard/lowongan");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal mengubah status lowongan" };
  }
}

export async function deleteLowongan(id: string) {
  const session = await getSession();
  if (!session) return { error: "Sesi tidak valid" };

  try {
    const existing = await prisma.lowongan.findUnique({
      where: { id_lowongan: id },
      include: { _count: { select: { lamaran: true } } }
    });

    if (!existing) return { error: "Lowongan tidak ditemukan" };
    if (existing._count.lamaran > 0) {
      return { error: "Tidak dapat menghapus lowongan yang sudah memiliki pelamar" };
    }

    await prisma.lowongan.delete({
      where: { id_lowongan: id }
    });

    revalidatePath("/dashboard/lowongan");
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus lowongan" };
  }
}
