"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Building2,
  Medal,
  Award
} from "lucide-react";
import { getDecisionResults } from "@/app/actions/hrd/decision_summary";

interface DecisionSummaryListProps {
  lowonganId: string;
}

export default function DecisionSummaryList({ lowonganId }: DecisionSummaryListProps) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    const result = await getDecisionResults(lowonganId);
    if (result.success) {
      setResults(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [lowonganId]);

  const filteredResults = results.filter(r => 
    r.pengguna.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    diterima: results.filter(r => r.keputusan_hrd === 'diterima').length,
    ditolak: results.filter(r => r.keputusan_hrd === 'ditolak').length,
    cadangan: results.filter(r => r.keputusan_hrd === 'cadangan').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[40px] border border-gray-100 shadow-sm">
        <div className="w-12 h-12 border-4 border-gray-50 border-t-[#3c50e0] rounded-full animate-spin" />
        <p className="text-sm font-black text-gray-400 tracking-widest">MEMUAT REKAPITULASI...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-[20px] flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diterima</p>
            <p className="text-2xl font-black text-gray-900">{stats.diterima} Orang</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-[20px] flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cadangan</p>
            <p className="text-2xl font-black text-gray-900">{stats.cadangan} Orang</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-[20px] flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ditolak</p>
            <p className="text-2xl font-black text-gray-900">{stats.ditolak} Orang</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Award size={20} className="text-[#fccf54]" />
          Daftar Keputusan Final
        </h3>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Filter nama pelamar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium w-full md:w-64 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Ranking</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Profil Pelamar</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Skor Akhir (SAW)</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px] text-right">Status Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-gray-400 font-medium italic">
                    Belum ada data keputusan untuk lowongan ini.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => (
                  <tr key={r.id_lamaran} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-8">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-sm ${
                        r.penilaian?.peringkat === 1 ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        r.penilaian?.peringkat === 2 ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        r.penilaian?.peringkat === 3 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                        'bg-white text-gray-300 border-gray-100'
                      }`}>
                        {r.penilaian?.peringkat || '-'}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-black text-gray-900 leading-tight">
                          {r.pengguna.nama_lengkap}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <Building2 size={12} className="text-gray-300" />
                          {r.pengguna.profil?.nama_institusi || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-black text-gray-800">
                         {r.penilaian?.nilai_preferensi ? (r.penilaian.nilai_preferensi * 100).toFixed(1) + "%" : "-"}
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#fccf54] rounded-full"
                            style={{ width: `${(r.penilaian?.nilai_preferensi || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        r.keputusan_hrd === 'diterima' ? 'bg-green-50 text-green-600 border-green-100' :
                        r.keputusan_hrd === 'ditolak' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {r.keputusan_hrd === 'diterima' && <CheckCircle2 size={14} />}
                        {r.keputusan_hrd === 'ditolak' && <XCircle size={14} />}
                        {r.keputusan_hrd === 'cadangan' && <Clock size={14} />}
                        {r.keputusan_hrd}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
