"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Building2,
  ChevronRight
} from "lucide-react";
import { getApplicantsByLowongan } from "@/app/actions/hrd/assessment";
import AssessmentForm from "./AssessmentForm";

interface ApplicantAssessmentListProps {
  lowonganId: string;
}

export default function ApplicantAssessmentList({ lowonganId }: ApplicantAssessmentListProps) {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchApplicants = async () => {
    setLoading(true);
    const result = await getApplicantsByLowongan(lowonganId);
    if (result.success) {
      setApplicants(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplicants();
  }, [lowonganId]);

  const filteredApplicants = applicants.filter(a => 
    a.pengguna.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScore = (applicant: any) => {
    setSelectedApplicant(applicant);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#3c50e0] rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400">MEMUAT DAFTAR PELAMAR...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#3c50e0] rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">HASIL PENDAFTARAN</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Total {applicants.length} Orang Terdaftar</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama pelamar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium w-full md:w-64 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Data Pelamar</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Institusi & Pendidikan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Status Penilaian</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[2px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 text-sm font-medium italic">
                    Tidak ada pelamar ditemukan.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((a) => (
                  <tr key={a.id_lamaran} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-black text-sm group-hover:bg-[#3c50e0] group-hover:text-white transition-all">
                          {a.pengguna.nama_lengkap.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-tight">{a.pengguna.nama_lengkap}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-wider uppercase">PELAMAR</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                          <Building2 size={12} className="text-[#fccf54]" />
                          {a.pengguna.profil.nama_institusi}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold tracking-wide">
                          <GraduationCap size={12} />
                          {a.pengguna.profil.pendidikan_terakhir} • {a.pengguna.profil.jurusan}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {a.penilaian ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <CheckCircle2 size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Terdaftar Nilai</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Belum Dinilai</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleScore(a)}
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                          a.penilaian 
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                            : 'bg-[#3c50e0] text-white shadow-lg shadow-blue-500/20 hover:bg-[#2e3ea8] hover:translate-y-[-1px]'
                        }`}
                      >
                        {a.penilaian ? 'UBAH NILAI' : 'NILAI SEKARANG'}
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <AssessmentForm 
          applicant={selectedApplicant}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchApplicants();
          }}
        />
      )}
    </div>
  );
}
