import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, Eye, Filter } from "lucide-react";
import { getApplicants } from "@/app/actions/hrd/applicants";

export default async function ApplicantsPage() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true }
  });

  const applicants = await getApplicants();

  const getStatusBadge = (status: string, keputusan: string | null) => {
    if (keputusan === "diterima") return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#13deb9]/10 text-[#13deb9]">DITERIMA</span>;
    if (keputusan === "ditolak") return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fa896b]/10 text-[#fa896b]">DITOLAK</span>;
    if (keputusan === "cadangan") return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-200 text-gray-700">CADANGAN</span>;

    switch (status) {
      case 'pending': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#ecf2ff] text-[#5d87ff]">PENDING</span>;
      case 'screening': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fef7df] text-[#fccf54]">SCREENING</span>;
      case 'wawancara': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-600">WAWANCARA</span>;
      default: return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-600">{status.toUpperCase()}</span>;
    }
  };

  return (
    <DashboardLayout user={pengguna} title="Daftar Pelamar">
      <div className="animate-in fade-in duration-500 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2a3547] mb-1">Daftar Pelamar Pekerjaan</h2>
            <p className="text-sm text-[#5a6a85]">Lihat dan seleksi kandidat yang masuk.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-[#5a6a85] px-4 py-2.5 rounded-lg text-sm font-bold shadow-xs hover:bg-gray-50 flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 transition-all shadow-xs"
            placeholder="Cari nama pelamar, email, atau posisi kerja..."
          />
        </div>

        {/* List of Applicants */}
        <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-[#fcfdfe] border-b border-[#f2f6fa]">
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider">Kandidat</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider">Posisi / Lowongan</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-center">Tgl Melamar</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-center">Status Tahapan</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f6fa]">
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#5a6a85]">Belum ada pelamar.</td>
                  </tr>
                ) : (
                  applicants.map((a) => (
                    <tr key={a.id_lamaran} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#f2f6fa] text-[#5a6a85] font-bold flex items-center justify-center shrink-0">
                            {a.pengguna.nama_lengkap.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#2a3547]">{a.pengguna.nama_lengkap}</h4>
                            <p className="text-xs text-[#5a6a85] mt-0.5">{a.pengguna.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-[#2a3547]">
                          {a.lowongan.jenis_pekerjaan.nama_jenis}
                        </div>
                        <div className="text-xs text-[#5a6a85] mt-0.5">
                          {a.lowongan.jenis_pekerjaan.kode_jenis}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-[#5a6a85]">
                        {a.tanggal_lamar.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(a.status, a.keputusan_hrd)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link href={`/dashboard/applicants/${a.id_lamaran}`} className="inline-flex items-center gap-2 bg-gray-100/80 hover:bg-gray-200 text-[#5a6a85] px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                          <Eye size={14} strokeWidth={2.5} /> Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
