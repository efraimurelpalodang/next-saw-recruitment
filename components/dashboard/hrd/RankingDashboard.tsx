"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  ChevronRight, 
  Search, 
  ArrowLeft,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  MapPin
} from "lucide-react";
import RankingTable from "./RankingTable";

interface Lowongan {
  id_lowongan: string;
  id_jenis_pekerjaan: string;
  lokasi_kerja: string;
  status: string;
  jenis_pekerjaan: {
    nama_jenis: string;
  };
  _count: {
    lamaran: number;
  };
}

interface RankingDashboardProps {
  initialLowongan: Lowongan[];
}

export default function RankingDashboard({ initialLowongan }: RankingDashboardProps) {
  const [selectedLowongan, setSelectedLowongan] = useState<Lowongan | null>(null);
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
          KEMBALI KE PILIHAN LOWONGAN
        </button>

        <div className="bg-[#1c2434] p-8 rounded-[40px] shadow-xl relative overflow-hidden group">
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fccf54]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#fccf54] text-[#1c2434] rounded-3xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Layers size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                  {selectedLowongan.jenis_pekerjaan.nama_jenis}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                    <Building2 size={14} className="text-[#fccf54]" />
                    {selectedLowongan.lokasi_kerja}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                    <Sparkles size={14} className="text-[#fccf54]" />
                    {selectedLowongan._count.lamaran} Kandidat Dinilai
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase">Rekomendasi Sistem</span>
              <div className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 flex items-center gap-3">
                <Trophy size={18} className="text-[#fccf54]" />
                <span className="text-sm font-black text-white">METODE SAW</span>
              </div>
            </div>
          </div>
        </div>

        <RankingTable lowonganId={selectedLowongan.id_lowongan} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black tracking-widest uppercase mb-4">
            <Sparkles size={12} />
            Decision Support System
          </div>
          <h1 className="text-4xl font-black text-[#1c2434] tracking-tight">RANKING & KEPUTUSAN</h1>
          <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed max-w-lg">
            Sistem merangking kandidat terbaik berdasarkan kriteria penilaian menggunakan metode Simple Additive Weighting.
          </p>
        </div>
        
        <div className="relative z-10">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Cari posisi atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-8 py-4 bg-gray-50/50 border border-gray-100 rounded-[24px] text-sm font-medium w-full md:w-96 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all"
            />
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLowongan.map((l) => (
          <div 
            key={l.id_lowongan}
            onClick={() => setSelectedLowongan(l)}
            className="group bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-100 transition-all cursor-pointer relative overflow-hidden flex flex-col min-h-[280px]"
          >
            {/* Top Section */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-gray-50 rounded-[22px] flex items-center justify-center group-hover:bg-[#fccf54] group-hover:text-[#1c2434] transition-all duration-500">
                  <Layers size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Kandidat</span>
                  <p className="text-2xl font-black text-gray-900">{l._count.lamaran}</p>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#3c50e0] transition-colors leading-tight mb-3">
                {l.jenis_pekerjaan.nama_jenis}
              </h3>
              
              <div className="flex items-center gap-3 text-xs text-gray-400 font-bold tracking-wide">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-400" />
                  {l.lokasi_kerja}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto p-6 bg-gray-50/50 flex items-center justify-between group-hover:bg-amber-50/50 transition-colors">
              <span className="text-[10px] font-black text-gray-400 tracking-[2px] uppercase group-hover:text-amber-600 transition-colors">
                Lihat Ranking
              </span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLowongan.length === 0 && (
        <div className="text-center py-24 bg-gray-50/50 rounded-[50px] border-2 border-dashed border-gray-100 border-t-0">
          <div className="w-24 h-24 bg-white rounded-full p-6 mx-auto mb-6 shadow-sm flex items-center justify-center text-gray-200">
            <Trophy size={48} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Belum Ada Ranking Tersedia</h3>
          <p className="text-sm text-gray-400 font-medium mt-2 max-w-md mx-auto">
            Pastikan sudah ada data penilaian pelamar untuk lowongan yang dicari.
          </p>
        </div>
      )}
    </div>
  );
}
