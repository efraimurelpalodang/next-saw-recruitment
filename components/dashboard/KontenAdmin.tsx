import React from "react";
import { Users, ShieldCheck, Activity, Cog, ArrowUpRight, Database, Briefcase } from "lucide-react";
import StatCard from "./StatCard";

interface KontenAdminProps {
  pengguna: any;
}

export default function KontenAdmin({ pengguna }: KontenAdminProps) {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Welcome Widget */}
      <section className="bg-white rounded-[7px] p-6 border border-[#e5eaef] shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#2a3547]">Dashboard Overview</h2>
          <p className="text-[#5a6a85] text-sm">
            Selamat datang kembali, <span className="font-bold text-[#fccf54]">{pengguna.nama_lengkap}</span>
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-[#fccf54] text-[#2a3547] rounded-[7px] text-xs font-bold hover:opacity-90 transition-all">
              Server Status
           </button>
        </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Pengguna" value="1,240" icon={Users} color="info" />
        <StatCard label="Lowongan" value="32" icon={Briefcase} color="primary" />
        <StatCard label="Log Aktif" value="84" icon={Activity} color="success" />
        <StatCard label="CPU Usage" value="12%" icon={Cog} color="info" />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-2 bg-white rounded-[7px] border border-[#e5eaef] shadow-sm p-6 overflow-hidden">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-[#2a3547]">Aktivitas Terkini</h3>
             <button className="text-xs font-bold text-[#fccf54] hover:underline flex items-center gap-1 group">
                Lihat Semua <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
             </button>
           </div>
           
           <div className="overflow-x-auto min-w-full">
             <table className="w-full text-left whitespace-nowrap">
               <thead>
                 <tr className="border-b border-[#f2f6fa]">
                    <th className="pb-3 text-xs font-bold text-[#2a3547] uppercase tracking-wider">User</th>
                    <th className="pb-3 text-xs font-bold text-[#2a3547] uppercase tracking-wider px-4">Modul</th>
                    <th className="pb-3 text-xs font-bold text-[#2a3547] uppercase tracking-wider text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#f2f6fa]">
                 {[
                   { name: "Super Admin", mod: "Manajemen Role", status: "Success", color: "text-emerald-500 bg-emerald-50" },
                   { name: "HRD Staff", mod: "Recruitment SAW", status: "In Progress", color: "text-blue-500 bg-blue-50" },
                   { name: "Manager", mod: "Laporan Akhir", status: "Pending", color: "text-amber-500 bg-amber-50" },
                 ].map((log, i) => (
                   <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                     <td className="py-4">
                        <span className="text-sm font-semibold text-[#2a3547]">{log.name}</span>
                     </td>
                     <td className="py-4 px-4 font-medium text-[#5a6a85] text-sm">
                        {log.mod}
                     </td>
                     <td className="py-4 text-right">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-[4px] border border-transparent ${log.color}`}>
                           {log.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Info Card / Sidebar Section in Content */}
        <div className="bg-[#fccf54] rounded-[7px] p-6 text-[#2a3547] flex flex-col justify-center relative overflow-hidden group">
           <Database size={100} className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform" />
           <h3 className="text-lg font-bold mb-2">Master Data</h3>
           <p className="text-sm font-medium opacity-80 mb-6">
             Kelola basis data sistem dan kriteria global di satu tempat.
           </p>
           <button className="w-full py-2 bg-white text-[#2a3547] rounded-[7px] text-xs font-bold shadow-md hover:bg-gray-50 transition-all">
             Buka Database
           </button>
        </div>
      </div>
    </div>
  );
}
