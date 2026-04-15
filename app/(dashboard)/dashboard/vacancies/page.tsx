import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Briefcase, Calendar, MapPin, Users, MoreVertical } from "lucide-react";
import { getVacancies } from "@/app/actions/hrd/vacancies";
import VacancyStatusToggle from "./VacancyStatusToggle";

export default async function VacanciesPage() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true }
  });

  const vacancies = await getVacancies();

  return (
    <DashboardLayout user={pengguna} title="Data Lowongan">
      <div className="animate-in fade-in duration-500 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2a3547] mb-1">Manajemen Lowongan Pekerjaan</h2>
            <p className="text-sm text-[#5a6a85]">Kelola pembukaan dan penutupan loker rekrutmen.</p>
          </div>
          <Link 
            href="/dashboard/vacancies/create" 
            className="bg-[#fccf54] text-[#2a3547] px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={2.5} />
            Buat Lowongan
          </Link>
        </div>

        {/* List of Vacancies */}
        <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-[#fcfdfe] border-b border-[#f2f6fa]">
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider">Info Posisi</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider">Deadline</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-center">Pelamar</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f6fa]">
                {vacancies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#5a6a85]">Belum ada data lowongan pekerjaan.</td>
                  </tr>
                ) : (
                  vacancies.map((v) => (
                    <tr key={v.id_lowongan} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#fef7df] text-[#fccf54] flex items-center justify-center shrink-0">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#2a3547]">{v.jenis_pekerjaan.nama_jenis}</h4>
                            <div className="flex items-center gap-2 text-xs text-[#5a6a85] mt-1">
                              <MapPin size={12} /> {v.lokasi_kerja}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-sm text-[#5a6a85]">
                          <Calendar size={14} />
                          {v.tanggal_tutup.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 bg-[#ecf2ff] text-[#5d87ff] px-2.5 py-1 rounded-md text-xs font-bold">
                          <Users size={12} />
                          {v._count.lamaran}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <VacancyStatusToggle id_lowongan={v.id_lowongan} initialStatus={v.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-[#5a6a85] hover:text-[#2a3547] p-1 rounded-md hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} />
                        </button>
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
