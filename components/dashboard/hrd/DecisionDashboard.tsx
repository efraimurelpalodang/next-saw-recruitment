"use client";

import React, { useState, useEffect } from "react";
import { 
  FileCheck, 
  ChevronRight, 
  Search, 
  ArrowLeft,
  Briefcase,
  MapPin,
  CheckCircle2,
  PieChart
} from "lucide-react";
import DecisionSummaryList from "./DecisionSummaryList";

interface LowonganSummary {
  id_lowongan: string;
  lokasi_kerja: string;
  jenis_pekerjaan: {
    nama_jenis: string;
  };
  _count: {
    lamaran: number;
  };
}

interface DecisionDashboardProps {
  initialLowongan: LowonganSummary[];
}

export default function DecisionDashboard({ initialLowongan }: DecisionDashboardProps) {
  const [selectedLowongan, setSelectedLowongan] = useState<LowonganSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLowongan = initialLowongan.filter(l => 
    l.jenis_pekerjaan.nama_jenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lokasi_kerja.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedLowongan) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedLowongan(null)}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#3c50e0] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          KEMBALI KE REKAP SELURUHNYA
        </button>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-blue-50 text-[#3c50e0] rounded-2xl flex items-center justify-center">
              <Briefcase size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                {selectedLowongan.jenis_pekerjaan.nama_jenis}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                  <MapPin size={14} className="text-gray-300" />
                  {selectedLowongan.lokasi_kerja}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                  <CheckCircle2 size={14} className="text-green-400" />
                  {selectedLowongan._count.lamaran} Keputusan Selesai
                </div>
              </div>
            </div>
          </div>
        </div>

        <DecisionSummaryList lowonganId={selectedLowongan.id_lowongan} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1c2434] tracking-tight">HASIL SELEKSI FINAL</h1>
          <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
            <PieChart size={14} className="text-[#3c50e0]" />
            Ringkasan Administrasi & Rekomendasi
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari posisi pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[22px] text-sm font-medium w-full md:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLowongan.map((l) => (
          <div 
            key={l.id_lowongan}
            onClick={() => setSelectedLowongan(l)}
            className="group bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#3c50e0] group-hover:text-white transition-all">
                  <FileCheck size={24} />
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  SELESAI
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#3c50e0] transition-colors leading-snug">
                {l.jenis_pekerjaan.nama_jenis}
              </h3>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
              <span className="text-[10px] font-black text-gray-400 tracking-[1.5px] uppercase">
                {l._count.lamaran} Kandidat
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#3c50e0] group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLowongan.length === 0 && (
        <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
            <Briefcase size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900">Belum ada keputusan final</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Selesaikan proses penilaian dan ranking untuk melihat rekapitulasi di sini.
          </p>
        </div>
      )}
    </div>
  );
}
