import React from "react";
import Link from "next/link";
import { getApplicantsByLowongan } from "@/app/actions/hrd/applicants";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  ClipboardList,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export async function generateMetadata({ params }: { params: Promise<{ id_lowongan: string }> }) {
  return { title: "Daftar Pelamar | SAW Recruitment" };
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending:      { label: "Menunggu",      color: "bg-gray-100 text-gray-500" },
  screening:    { label: "Screening",     color: "bg-blue-100 text-blue-600" },
  tes_skill:    { label: "Tes Skill",     color: "bg-purple-100 text-purple-600" },
  wawancara:    { label: "Wawancara",     color: "bg-amber-100 text-amber-600" },
  rekomendasi:  { label: "Rekomendasi",   color: "bg-teal-100 text-teal-600" },
  keputusan:    { label: "Keputusan",     color: "bg-indigo-100 text-indigo-600" },
};

const keputusanMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  diterima:  { label: "Diterima",  icon: <CheckCircle2 size={12} />, color: "bg-green-100 text-green-600" },
  ditolak:   { label: "Ditolak",   icon: <XCircle size={12} />,      color: "bg-red-100 text-red-600" },
  cadangan:  { label: "Cadangan",  icon: <Clock size={12} />,        color: "bg-blue-100 text-blue-600" },
};

export default async function PelamarPage({ params }: { params: Promise<{ id_lowongan: string }> }) {
  const { id_lowongan } = await params;
  const result = await getApplicantsByLowongan(id_lowongan);

  if (result.error || !result.data) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-3">
        <AlertCircle size={20} />
        {result.error}
      </div>
    );
  }

  const { lamaran, lowongan } = result.data;
  const lowonganId = id_lowongan;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 p-4 md:p-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/lowongan"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#3c50e0] transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Manajemen Lowongan
      </Link>

      {/* Vacancy Header Card */}
      <div className="bg-[#1c2434] p-8 rounded-[36px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#fccf54]/10 border border-[#fccf54]/20 text-[#fccf54] rounded-2xl flex items-center justify-center">
              <Briefcase size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {lowongan?.jenis_pekerjaan.nama_jenis}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-1">{lowongan?.lokasi_kerja}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <Users size={16} className="text-[#fccf54]" />
              <span className="text-white font-black text-sm">{lamaran.length} Pelamar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
          <ClipboardList size={18} className="text-gray-400" />
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Daftar Pelamar</h2>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Pelamar</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Tanggal Lamar</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Status Seleksi</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Keputusan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[3px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lamaran.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-gray-400 text-sm italic">
                    Belum ada pelamar untuk lowongan ini.
                  </td>
                </tr>
              ) : (
                lamaran.map((item) => {
                  const status = statusMap[item.status] ?? { label: item.status, color: "bg-gray-100 text-gray-500" };
                  const keputusan = item.keputusan_hrd ? keputusanMap[item.keputusan_hrd] : null;
                  return (
                    <tr key={item.id_lamaran} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3c50e0] to-[#5b6ee0] flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white flex-shrink-0">
                            {item.pengguna.nama_lengkap.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-black text-gray-900 group-hover:text-[#3c50e0] transition-colors truncate">
                              {item.pengguna.nama_lengkap}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                              {/* @ts-ignore - profil property added correctly in the action */}
                              {item.pengguna.profil?.nama_institusi || item.pengguna.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Calendar size={12} className="text-gray-300" />
                          {format(new Date(item.tanggal_lamar), "dd MMM yyyy", { locale: localeId })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {keputusan ? (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${keputusan.color}`}>
                            {keputusan.icon}
                            {keputusan.label}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-300 font-bold italic">Belum ada</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/lowongan/${lowonganId}/pelamar/${item.id_lamaran}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#3c50e0] hover:text-white text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all group/btn"
                          >
                            <Eye size={12} className="group-hover/btn:scale-110 transition-transform" />
                            Detail
                          </Link>
                          <Link
                            href={`/dashboard/penilaian?lamaranId=${item.id_lamaran}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#fccf54]/10 hover:bg-[#fccf54] text-[#8a6f00] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all group/btn"
                          >
                            <ClipboardList size={12} className="group-hover/btn:scale-110 transition-transform" />
                            Nilai
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
