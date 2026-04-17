"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  ChevronRight, 
  Search, 
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Download
} from "lucide-react";
import ReportViewer from "./ReportViewer";

interface LowonganReport {
  id_lowongan: string;
  lokasi_kerja: string;
  jenis_pekerjaan: {
    nama_jenis: string;
  };
  _count: {
    lamaran: number;
  };
}

interface ReportDashboardProps {
  initialLowongan: LowonganReport[];
}

export default function ReportDashboard({ initialLowongan }: ReportDashboardProps) {
  const [selectedLowongan, setSelectedLowongan] = useState<LowonganReport | null>(null);
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
          KEMBALI KE PILIHAN LAPORAN
        </button>

        <div className="bg-[#1c2434] p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/5 backdrop-blur-md border border-white/10 text-[#fccf54] rounded-[30px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <FileText size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                  LAPORAN HASIL SELEKSI
                </h2>
                <div className="flex flex-wrap items-center gap-6 mt-3 text-gray-400">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fccf54]" />
                    {selectedLowongan.jenis_pekerjaan.nama_jenis}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {selectedLowongan._count.lamaran} Kandidat Terarsip
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-500 tracking-[4px] uppercase mb-2">Ready to Export</span>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 text-xs font-bold">
                <Sparkles size={14} />
                    DATA VALID
              </div>
            </div>
          </div>
        </div>

        <ReportViewer lowonganId={selectedLowongan.id_lowongan} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div>
          <h1 className="text-5xl font-black text-[#1c2434] tracking-tighter">ARSIP & LAPORAN</h1>
          <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed max-w-xl">
            Pusat dokumentasi hasil seleksi. Silakan pilih lowongan yang telah menyelesaikan seluruh tahapan rekrutmen untuk mengunduh laporan final.
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3c50e0] transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="Cari lowongan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[30px] text-sm font-medium w-full md:w-96 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#3c50e0] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLowongan.map((l) => (
          <div 
            key={l.id_lowongan}
            onClick={() => setSelectedLowongan(l)}
            className="group bg-white rounded-[45px] border border-gray-100 shadow-sm hover:shadow-3xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden h-[340px] flex flex-col"
          >
            {/* Top Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[60px] group-hover:bg-[#3c50e0]/5 transition-colors" />
            
            <div className="p-10 flex flex-col flex-grow">
              <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-400 group-hover:bg-[#3c50e0] group-hover:text-white transition-all duration-500 mb-8 transform group-hover:rotate-6 shadow-sm">
                <FileText size={30} />
              </div>

              <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#3c50e0] transition-colors leading-tight mb-4">
                {l.jenis_pekerjaan.nama_jenis}
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {l._count.lamaran} Data Final
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                   {l.lokasi_kerja}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  <Download size={14} className="text-[#3c50e0]" />
                  <span className="text-[10px] font-black text-[#3c50e0] uppercase tracking-widest">Buka Laporan</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-200 group-hover:border-[#3c50e0] group-hover:text-[#3c50e0] transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLowongan.length === 0 && (
        <div className="text-center py-32 bg-gray-50/50 rounded-[60px] border-2 border-dashed border-gray-100">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <FileText size={56} className="text-gray-100" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Belum Ada Laporan Siap</h3>
          <p className="text-base text-gray-400 font-medium mt-3 max-w-lg mx-auto leading-relaxed">
            Hanya lowongan yang proses seleksinya sudah selesai 100% yang akan muncul di sini untuk dokumentasi.
          </p>
        </div>
      )}
    </div>
  );
}
