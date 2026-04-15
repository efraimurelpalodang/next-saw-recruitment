import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, FileText, User, Briefcase, GraduationCap, MapPin, AtSign } from "lucide-react";
import { getApplicantDetail } from "@/app/actions/hrd/applicants";
import StatusUpdater from "./StatusUpdater";

export default async function ApplicantDetailPage({ params }: { params: { id_lamaran: string } }) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true }
  });

  const applicant = await getApplicantDetail(params.id_lamaran);
  if (!applicant) notFound();

  const profil = applicant.pengguna.profil;

  return (
    <DashboardLayout user={pengguna} title="Detail Pelamar">
      <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/applicants" className="p-2 bg-white border border-[#f5f2f2] rounded-lg text-[#5a6a85] hover:bg-gray-50 transition-colors shadow-xs">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#2a3547] leading-tight">Profil Kandidat</h2>
            <p className="text-sm text-[#5a6a85] mt-0.5">Tinjauan detail lamaran untuk posisi <strong className="text-[#2a3547]">{applicant.lowongan.jenis_pekerjaan.nama_jenis}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Info Utama & Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#f2f6fa] border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-[#5a6a85] mb-4">
                {applicant.pengguna.nama_lengkap.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-[#2a3547]">{applicant.pengguna.nama_lengkap}</h3>
              <p className="text-sm text-[#5a6a85] mt-1">{profil?.jurusan} di {profil?.nama_institusi}</p>
              
              <div className="w-full mt-6 pt-6 border-t border-[#f5f2f2] flex justify-between text-sm">
                <span className="text-[#5a6a85]">Posisi Dilamar</span>
                <span className="font-bold text-[#2a3547]">{applicant.lowongan.jenis_pekerjaan.kode_jenis}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs p-6">
              <h4 className="font-bold text-[#2a3547] mb-4 text-sm uppercase tracking-wider">Aksi Tahapan</h4>
              <StatusUpdater id_lamaran={applicant.id_lamaran} currentStatus={applicant.status} currentKeputusan={applicant.keputusan_hrd} />
            </div>
            
            {(applicant.penilaian?.nilai_preferensi !== null && applicant.penilaian?.nilai_preferensi !== undefined) && (
               <div className="bg-[#2a3547] rounded-xl p-6 text-white text-center shadow-xs">
                  <h4 className="text-gray-400 text-sm font-semibold mb-2">Total Skor SAW</h4>
                  <p className="text-4xl font-extrabold text-[#fccf54]">{applicant.penilaian?.nilai_preferensi.toFixed(3)}</p>
               </div>
            )}
          </div>

          {/* Kolom Kanan: Detail Lengkap */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs p-6">
              <h4 className="font-bold text-[#2a3547] mb-6 flex items-center gap-2">
                <User size={18} className="text-[#fa896b]" /> Data Pribadi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">NIK</p>
                  <p className="text-sm font-medium text-[#2a3547]">{profil?.nik || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Email</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#2a3547]">
                    <AtSign size={14} className="text-gray-400" /> {applicant.pengguna.email}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Tempat, Tgl Lahir</p>
                  <p className="text-sm font-medium text-[#2a3547]">
                    {profil?.tempat_lahir}, {profil?.tanggal_lahir ? new Date(profil.tanggal_lahir).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Jenis Kelamin</p>
                  <p className="text-sm font-medium text-[#2a3547]">{profil?.jenis_kelamin === 'L' ? 'Laki-Laki' : profil?.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Alamat Domisili</p>
                  <div className="flex items-start gap-1.5 text-sm font-medium text-[#2a3547]">
                    <MapPin size={14} className="text-[#fccf54] mt-0.5 shrink-0" /> {profil?.alamat || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs p-6">
              <h4 className="font-bold text-[#2a3547] mb-6 flex items-center gap-2">
                <GraduationCap size={18} className="text-[#13deb9]" /> Profil Akademik & Karir
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Pendidikan Terakhir</p>
                  <p className="text-sm font-medium text-[#2a3547]">{profil?.pendidikan_terakhir || "-"} / {profil?.jurusan || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Universitas / Sekolah</p>
                  <p className="text-sm font-medium text-[#2a3547]">{profil?.nama_institusi || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Tahun Lulus</p>
                  <p className="text-sm font-medium text-[#2a3547]">{profil?.tahun_lulus || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#5a6a85] uppercase tracking-wider mb-1">Pengalaman Kerja</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#2a3547]">
                    <Briefcase size={14} className="text-[#13deb9]" /> {profil?.pengalaman_kerja_tahun} Tahun
                  </div>
                </div>
              </div>
            </div>

            {/* Lampiran */}
            <div className="bg-[#f2f6fa] rounded-xl border border-gray-200 shadow-inner p-6">
              <h4 className="font-bold text-[#2a3547] mb-4 flex items-center gap-2">
                <FileText size={18} className="text-[#5d87ff]" /> Berkas Lampiran
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                   <div>
                      <p className="text-xs font-bold text-[#2a3547]">Curriculum Vitae (CV)</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">PDF Document</p>
                   </div>
                   {profil?.berkas_cv ? (
                      <a href={profil.berkas_cv} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white bg-[#5d87ff] px-3 py-1.5 rounded hover:opacity-90">Buka File</a>
                   ) : (
                      <span className="text-xs font-medium text-gray-400">Kosong</span>
                   )}
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                   <div>
                      <p className="text-xs font-bold text-[#2a3547]">Ijazah & Transkrip</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">PDF Document</p>
                   </div>
                   {profil?.berkas_ijazah ? (
                      <a href={profil.berkas_ijazah} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white bg-[#5d87ff] px-3 py-1.5 rounded hover:opacity-90">Buka File</a>
                   ) : (
                      <span className="text-xs font-medium text-gray-400">Kosong</span>
                   )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
