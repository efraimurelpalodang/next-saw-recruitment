"use client";

import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  MapPin, 
  Users, 
  ChevronRight, 
  Search, 
  Clock,
  ArrowLeft
} from "lucide-react";
import ApplicantAssessmentList from "./ApplicantAssessmentList";

interface Lowongan {
  id_lowongan: string;
  id_jenis_pekerjaan: string;
  lokasi_kerja: string;
  status: string;
  dibuat_pada: Date;
  jenis_pekerjaan: {
    nama_jenis: string;
  };
  _count: {
    lamaran: number;
  };
}

interface AssessmentDashboardProps {
  initialLowongan: Lowongan[];
}

export default function AssessmentDashboard({ initialLowongan }: AssessmentDashboardProps) {
  const [lowongan, setLowongan] = useState<Lowongan[]>(initialLowongan);
  const [selectedLowongan, setSelectedLowongan] = useState<Lowongan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync state dengan server props
  useEffect(() => {
    setLowongan(initialLowongan);
  }, [initialLowongan]);

  const filteredLowongan = lowongan.filter(l => 
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
          KEMBALI KE DAFTAR LOWONGAN
        </button>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {selectedLowongan.jenis_pekerjaan.nama_jenis}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <MapPin size={14} className="text-[#fccf54]" />
                {selectedLowongan.lokasi_kerja}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <Users size={14} className="text-blue-400" />
                {selectedLowongan._count.lamaran} Pelamar
              </div>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            selectedLowongan.status === 'aktif' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {selectedLowongan.status === 'aktif' ? 'Terbuka' : 'Ditutup'}
          </div>
        </div>

        <ApplicantAssessmentList lowonganId={selectedLowongan.id_lowongan} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1c2434] tracking-tight">PENILAIAN PELAMAR</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Pilih lowongan untuk mulai memberikan penilaian.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari lowongan atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-medium w-full md:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid Lowongan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLowongan.map((l) => (
          <div 
            key={l.id_lowongan}
            onClick={() => setSelectedLowongan(l)}
            className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px]"
          >
            {/* Decoration */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-blue-50 group-hover:scale-110 transition-all" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#3c50e0] group-hover:text-white transition-all shadow-sm">
                  <Briefcase size={24} />
                </div>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  l.status === 'aktif' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {l.status}
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#3c50e0] transition-colors leading-tight">
                {l.jenis_pekerjaan.nama_jenis}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 font-semibold tracking-wide flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {l.lokasi_kerja}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(l.dibuat_pada).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-black text-gray-900">
                  {l._count.lamaran} PELAMAR
                </span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#3c50e0] group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLowongan.length === 0 && (
        <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Tidak ada lowongan</h3>
          <p className="text-sm text-gray-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      )}
    </div>
  );
}
