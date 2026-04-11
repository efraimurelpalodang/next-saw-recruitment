import React from "react";
import { Briefcase, Users, Search, ClipboardCheck, ArrowUpRight, Plus } from "lucide-react";
import StatCard from "./StatCard";

interface KontenHRDProps {
  pengguna: any;
}

export default function KontenHRD({ pengguna }: KontenHRDProps) {
  return (
   <div className="animate-in fade-in duration-500 space-y-6">
    {/* Stats Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
     <StatCard label="Lowongan Aktif" value="15" icon={Briefcase} color="primary" />
     <StatCard label="Pelamar Baru" value="124" icon={Users} color="info" />
     <StatCard label="Review Tahap 1" value="28" icon={Search} color="success" />
     <StatCard label="Hired" value="42" icon={ClipboardCheck} color="info" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     {/* Table List View */}
     <div className="lg:col-span-2 bg-white rounded-[7px] border border-[#f5f2f2] shadow-xs p-6">
      <div className="flex items-center justify-between mb-6">
       <h3 className="font-bold text-[#2a3547]">Daftar Lamaran Terbaru</h3>
       <button className="text-xs font-bold text-[#fccf54] hover:underline hover:cursor-pointer flex items-center gap-1">
        Selengkapnya <ArrowUpRight size={14} />
       </button>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left whitespace-nowrap">
        <thead>
         <tr className="border-b border-[#f2f6fa]">
          <th className="pb-3 text-xs font-bold text-[#2a3547] uppercase tracking-wider">Kandidat</th>
          <th className="pb-3 text-xs font-bold text-[#2a3547] uppercase tracking-wider px-4">Posisi</th>
          <th className="pb-3 text-xs font-bold text-[#2a3547] uppercase tracking-wider text-right">Skor SAW</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-[#f2f6fa]">
         {[
          { name: "Andi Saputra", pos: "Software Engineer", score: "0.982", bg: "bg-emerald-50 text-emerald-600" },
          { name: "Siti Aminah", pos: "UI/UX Designer", score: "0.854", bg: "bg-[#ecf2ff] text-[#5d87ff]" },
          { name: "Budi Cahyono", pos: "Project Manager", score: "0.720", bg: "bg-amber-50 text-amber-600" },
          { name: "Dewi Lestari", pos: "QA Engineer", score: "0.912", bg: "bg-emerald-50 text-emerald-600" },
         ].map((item, i) => (
          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
           <td className="py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f2f6fa] flex items-center justify-center font-bold text-xs text-[#5a6a85]">{item.name.charAt(0)}</div>
            <span className="text-sm font-semibold text-[#2a3547]">{item.name}</span>
           </td>
           <td className="py-4 px-4 font-medium text-[#5a6a85] text-sm">{item.pos}</td>
           <td className="py-4 text-right">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-[4px] ${item.bg}`}>{item.score}</span>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Quick Action Widget */}
     <div className="space-y-6">
      <div className="bg-white rounded-[7px] border border-[#f5f2f2] shadow-xs p-6 text-center">
       <div className="w-12 h-12 bg-[#fef7df] rounded-full flex items-center justify-center text-[#fccf54] mx-auto mb-4">
        <Plus size={24} />
       </div>
       <h3 className="font-bold text-[#2a3547] mb-2 uppercase tracking-tight">Buat Lowongan</h3>
       <p className="text-[#5a6a85] text-xs mb-6">Tambah kebutuhan talent baru sesuai departemen.</p>
       <button className="w-full py-2 bg-[#fccf54] text-[#2a3547] rounded-[7px] text-xs font-bold shadow-sm hover:opacity-90 hover:cursor-pointer transition-all">Mulai Sekarang</button>
      </div>

      <div className="bg-[#2a3547] rounded-[7px] p-6 text-white text-center flex flex-col items-center">
       <ClipboardCheck size={40} className="text-[#fccf54] mb-4" />
       <h3 className="font-bold mb-1">Cek Ranking SAW</h3>
       <p className="text-[11px] text-gray-400 mb-6">Lihat urutan pelamar berbasis kriteria cerdas.</p>
       <button className="w-full py-2 bg-transparent border border-[#fccf54] text-[#fccf54] rounded-[7px] text-xs font-bold hover:bg-[#fccf54] hover:text-[#2a3547] transition-all">Review Ranking</button>
      </div>
     </div>
    </div>
   </div>
  );
}
