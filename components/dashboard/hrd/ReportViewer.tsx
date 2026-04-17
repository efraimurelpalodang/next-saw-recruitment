"use client";

import React, { useState, useEffect } from "react";
import { 
  FileDown, 
  Printer, 
  Table as TableIcon,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Download,
  FileSpreadsheet,
  File as FileIcon
} from "lucide-react";
import { getReportDetails } from "@/app/actions/hrd/report";
import { exportToPDF, exportToExcel } from "@/lib/exportService";

interface ReportViewerProps {
  lowonganId: string;
}

export default function ReportViewer({ lowonganId }: ReportViewerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDetails = async () => {
    setLoading(true);
    const result = await getReportDetails(lowonganId);
    if (result.success) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, [lowonganId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[40px] border border-gray-100 shadow-sm animate-pulse">
        <div className="w-14 h-14 border-4 border-gray-50 border-t-[#3c50e0] rounded-full animate-spin" />
        <p className="text-sm font-black text-gray-400 tracking-[3px]">MENYIAPKAN DATA...</p>
      </div>
    );
  }

  const filteredApplicants = data?.applicants.filter((a: any) => 
    a.pengguna.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 pb-32">
      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Cari pelamar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 bg-gray-50 border border-gray-50 rounded-2xl text-xs font-bold w-full md:w-64 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all"
            />
          </div>
          <div className="h-10 w-px bg-gray-100 hidden lg:block" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 hidden lg:block">
            {filteredApplicants.length} Rekod Ditemukan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => exportToPDF(data.applicants, data.lowongan)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-[#3c50e0] text-white rounded-[20px] text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <FileIcon size={16} className="group-hover:animate-bounce" />
            EXPORT PDF
          </button>
          
          <button 
            onClick={() => exportToExcel(data.applicants, data.lowongan)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-[#107c41] text-white rounded-[20px] text-xs font-black shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <FileSpreadsheet size={16} className="group-hover:animate-bounce" />
            EXPORT EXCEL
          </button>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white border border-gray-100 rounded-[45px] overflow-hidden shadow-sm relative">
        <div className="p-10 border-b border-gray-50 bg-gray-50/20">
          <div className="flex items-center gap-3 mb-2">
            <Printer size={18} className="text-gray-400" />
            <h4 className="text-sm font-black text-gray-900 tracking-tight uppercase">Pratinjau Laporan Final</h4>
          </div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed">
             Tampilan di bawah adalah representasi data yang akan muncul di file ekspor. Dokumen PDF akan menyertakan kop surat resmi perusahaan.
          </p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-50">
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[3.5px]">Rank</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[3.5px]">Pelamar & Institusi</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[3.5px] text-center">Skor Kriteria (C1-C5)</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[3.5px]">SAW Value</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[3.5px] text-right">Keputusan HRD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplicants.map((item: any) => (
                <tr key={item.id_lamaran} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border tracking-tighter shadow-sm transition-all ${
                       item.penilaian?.peringkat === 1 ? 'bg-amber-50 text-amber-600 border-amber-200 ring-4 ring-amber-500/10' :
                       item.penilaian?.peringkat === 2 ? 'bg-slate-50 text-slate-500 border-slate-200' :
                       item.penilaian?.peringkat === 3 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                       'bg-white text-gray-400 border-gray-100'
                    }`}>
                      #{item.penilaian?.peringkat || '-'}
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-base font-black text-gray-900 group-hover:text-[#3c50e0] transition-colors leading-tight">
                        {item.pengguna.nama_lengkap}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                        <Building2 size={12} className="text-gray-300" />
                        {item.pengguna.profil?.nama_institusi || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-10">
                    <div className="flex items-center justify-center gap-3">
                      {[item.penilaian?.nilai_c1_pendidikan, item.penilaian?.nilai_c2_pengalaman, item.penilaian?.nilai_c3_sertifikasi, item.penilaian?.nilai_c4_tes_keterampilan, item.penilaian?.nilai_c5_wawancara].map((val, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className="text-[8px] font-black text-gray-300">C{i+1}</span>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all ${
                            val >= 80 ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' : 'bg-gray-50/50 text-gray-400 border-gray-100'
                          }`}>
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex flex-col gap-2">
                       <span className="text-base font-black text-[#3c50e0] leading-none tracking-tighter">
                         {item.penilaian?.nilai_preferensi ? (item.penilaian.nilai_preferensi * 100).toFixed(2) + "%" : "-"}
                       </span>
                       <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                         <div 
                           className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000"
                           style={{ width: `${(item.penilaian?.nilai_preferensi || 0) * 100}%` }}
                         />
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-10 text-right">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${
                      item.keputusan_hrd === 'diterima' ? 'bg-green-50 text-green-600 border-green-200' :
                      item.keputusan_hrd === 'ditolak' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {item.keputusan_hrd === 'diterima' && <CheckCircle2 size={14} />}
                      {item.keputusan_hrd === 'ditolak' && <XCircle size={14} />}
                      {item.keputusan_hrd === 'cadangan' && <Clock size={14} />}
                      {item.keputusan_hrd}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplicants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <Search size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">Tidak ada data yang cocok</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
