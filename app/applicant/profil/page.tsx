import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileSections from "@/components/dashboard/ProfileSections";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DetailProfilPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: {
      profil: true,
    }
  });

  if (!pengguna) {
    redirect("/login");
  }

  // Passing data as plain objects to client component
  const initialData = {
    pengguna: {
      id_pengguna: pengguna.id_pengguna,
      nama_lengkap: pengguna.nama_lengkap,
      email: pengguna.email,
    },
    profil: pengguna.profil ? {
      nik: pengguna.profil.nik,
      tempat_lahir: pengguna.profil.tempat_lahir,
      tanggal_lahir: pengguna.profil.tanggal_lahir ? pengguna.profil.tanggal_lahir.toISOString() : null,
      jenis_kelamin: pengguna.profil.jenis_kelamin,
      alamat: pengguna.profil.alamat,
      pendidikan_terakhir: pengguna.profil.pendidikan_terakhir,
      institusi: pengguna.profil.nama_institusi,
      jurusan: pengguna.profil.jurusan,
      tahun_lulus: pengguna.profil.tahun_lulus,
      pengalaman_tahun: pengguna.profil.pengalaman_kerja_tahun,
      bidang_pengalaman: pengguna.profil.pengalaman_bidang,
      berkas_ijazah: pengguna.profil.berkas_ijazah,
      berkas_cv: pengguna.profil.berkas_cv,
      berkas_sertifikat: pengguna.profil.berkas_sertifikat,
    } : null,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
      <Link href="/applicant/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft size={16} />
        Kembali ke Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Detail Profil</h1>
      <ProfileSections initialData={initialData} />
    </div>
  );
}
