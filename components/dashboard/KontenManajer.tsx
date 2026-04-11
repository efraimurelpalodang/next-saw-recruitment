import React from "react";
import { TrendingUp, UserCheck, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import StatCard from "./StatCard";

interface KontenManajerProps {
  pengguna: any;
}

export default function KontenManajer({ pengguna }: KontenManajerProps) {
  return (
    <div className="animate-in fade-in duration-500 space-y-6 text-[#2a3547]">
      {/* Sales Overview / Management Banner Mockup */}
      <section className="bg-white rounded-[7px] border border-[#e5eaef] shadow-sm flex flex-col lg:flex-row overflow-hidden">
         <div className="p-8 flex-1 space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Keputusan Stratetgis & Laporan</h2>
            <p className="text-[#5a6a85] text-sm leading-relaxed max-w-xl">
               Pantau performa rekrutmen setiap periode. Gunakan data ranking SAW untuk mempercepat pengambilan keputusan persetujuan kandidat akhir.
            </p>
            <div className="flex gap-3 pt-2">
               <button className="px-5 py-2.5 bg-[#fccf54] text-[#2a3547] rounded-[7px] text-xs font-bold shadow-md hover:shadow-lg transition-all">
                  Generate Laporan SAW
               </button>
               <button className="px-5 py-2.5 bg-[#f2f6fa] text-[#2a3547] rounded-[7px] text-xs font-bold hover:bg-[#e5eaef] transition-all flex items-center gap-2">
                  Histori Keputusan <ArrowRight size={14} />
               </button>
            </div>
         </div>
         
         <div className="lg:w-72 bg-[#fef7df] p-8 flex flex-col justify-center border-l border-[#e5eaef]">
            <div className="space-y-4">
               <div>
                  <span className="text-[10px] font-bold text-[#5a6a85] uppercase tracking-widest">Efficiency</span>
                  <div className="flex items-center justify-between mt-1">
                     <span className="text-xl font-black text-[#2a3547]">94%</span>
                     <TrendingUp size={16} className="text-emerald-500" />
                  </div>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-[#5a6a85] uppercase tracking-widest">Decision Rate</span>
                  <div className="flex items-center justify-between mt-1">
                     <span className="text-xl font-black text-[#2a3547]">88%</span>
                     <TrendingUp size={16} className="text-emerald-500" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Approve Bulan Ini" value="12" icon={UserCheck} color="primary" />
        <StatCard label="Recruitment Growth" value="+15%" icon={TrendingUp} color="success" />
        <StatCard label="Review Perlu Aksi" value="3" icon={FileText} color="info" />
        <StatCard label="Total Kandidat Selesai" value="142" icon={CheckCircle2} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Decision Feed Card */}
         <div className="bg-white rounded-[7px] border border-[#e5eaef] shadow-sm p-6 overflow-hidden">
            <h3 className="font-bold mb-6">Persetujuan Terkini</h3>
            <div className="space-y-4">
               {[
                 { name: "Andi Saputra", pos: "Software Engineer", score: "0.942", date: "Hari ini" },
                 { name: "Siti Aminah", pos: "UI/UX Designer", score: "0.885", date: "Kemarin" },
                 { name: "Budi Cahyono", pos: "DevOps Engineer", score: "0.810", date: "12 Apr" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-[#f2f6fa]/50 rounded-[7px] border border-transparent hover:border-[#e5eaef] hover:bg-white transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-[#5a6a85]">#{i+1}</span>
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#2a3547] group-hover:text-[#fccf54] transition-colors">{item.name}</span>
                          <span className="text-[10px] font-medium text-[#5a6a85]">{item.pos}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-[#2a3547]">{item.score}</p>
                       <span className="text-[10px] font-medium text-gray-400">{item.date}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-2.5 bg-gray-50 text-[#5a6a85] rounded-[7px] text-[11px] font-bold hover:bg-[#2a3547] hover:text-white transition-all">
               View Full Queue
            </button>
         </div>

         {/* Managerial Notice Mockup */}
         <div className="bg-white rounded-[7px] border border-[#e5eaef] shadow-sm p-6 space-y-4">
            <h3 className="font-bold mb-2">Priority Alerts</h3>
            {[
              { title: "Review Anggaran", desc: "Sisa anggaran rekrutmen Q2 tersisa 25%.", status: "Alert", col: "text-red-500" },
              { title: "Laporan SAW Mingguan", desc: "Data seleksi periode 1-7 Mei telah diverifikasi.", status: "Normal", col: "text-[#fccf54]" },
            ].map((alert, i) => (
               <div key={i} className="flex gap-4 p-4 border-l-4 border-[#fccf54] bg-[#fef7df]/30 rounded-r-[7px]">
                  <div className="flex-1">
                     <p className="text-xs font-bold text-[#2a3547]">{alert.title}</p>
                     <p className="text-[11px] text-[#5a6a85] mt-1">{alert.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${alert.col}`}>{alert.status}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
