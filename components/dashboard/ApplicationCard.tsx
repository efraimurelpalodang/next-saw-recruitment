"use client";

import { useState } from "react";
import { Building2, Calendar, Check, ChevronDown, ChevronUp, ClipboardCheck, Clock, Monitor, Eye } from "lucide-react";

export default function ApplicationCard({ lamaran }: { lamaran: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const statusLabels: Record<string, string> = {
    pending: "Terkirim",
    screening: "Sedang Direview",
    tes_skill: "Tes Keterampilan",
    wawancara: "Tahap Wawancara",
    rekomendasi: "Rekomendasi",
    keputusan: "Offering"
  };

  const statusList = ["pending", "screening", "wawancara", "keputusan"];
  const currentStatusIndex = statusList.indexOf(lamaran.status);
  
  // Calculate time ago
  const diffTime = Math.abs(new Date().getTime() - new Date(lamaran.tanggal_lamar).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 transition-all">
      <div 
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer select-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
            <Monitor className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{lamaran.lowongan.jenis_pekerjaan.nama_jenis}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3 font-medium">
              <Building2 size={16} className="text-gray-400" />
              PT. Sumber Pangan Sejahtera
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#f1f5f9] text-gray-600 text-xs font-semibold rounded-full">
                {lamaran.lowongan.lokasi_kerja || "Bebas"}
              </span>
              <span className="px-3 py-1 text-gray-500 text-xs font-medium flex items-center gap-1.5">
                <Clock size={14} />
                Dikirim {diffDays} hari yang lalu
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
            {statusLabels[lamaran.status] || lamaran.status}
          </span>
          <button className="text-sm font-semibold text-indigo-600 flex items-center gap-1 transition-colors">
            Progres {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 pt-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4 sm:px-8">
            {/* Lines */}
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>
            <div 
              className="absolute top-5 left-[10%] h-0.5 bg-indigo-600 z-0 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStatusIndex) / (statusList.length - 1)) * 80}%` }}
            ></div>

            {/* Step 1: Terkirim (pending) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${currentStatusIndex >= 0 ? "bg-indigo-600 text-white" : "bg-gray-100 border-2 border-gray-200 text-gray-400"}`}>
                <Check size={18} strokeWidth={3} />
              </div>
              <span className={`text-[11px] font-bold ${currentStatusIndex >= 0 ? "text-gray-900" : "text-gray-400"}`}>Terkirim</span>
            </div>

            {/* Step 2: Review (screening) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${currentStatusIndex >= 1 ? "bg-indigo-600 text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                <Eye size={18} />
              </div>
              <span className={`text-[11px] font-bold ${currentStatusIndex >= 1 ? "text-indigo-600" : "text-gray-400"}`}>Review</span>
            </div>

            {/* Step 3: Interview (wawancara) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${currentStatusIndex >= 2 ? "bg-indigo-600 text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                <Calendar size={16} />
              </div>
              <span className={`text-[11px] font-bold ${currentStatusIndex >= 2 ? "text-indigo-600" : "text-gray-400"}`}>Interview</span>
            </div>

            {/* Step 4: Offering (keputusan) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${currentStatusIndex >= 3 ? "bg-indigo-600 text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                <ClipboardCheck size={16} />
              </div>
              <span className={`text-[11px] font-bold ${currentStatusIndex >= 3 ? "text-indigo-600" : "text-gray-400"}`}>Offering</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
