"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ChevronDown,
  Info,
  Medal,
  Check,
  X,
  Minus,
  Building2,
  RotateCcw
} from "lucide-react";
import { calculateRanking, saveDecision } from "@/app/actions/hrd/ranking";

interface RankingTableProps {
  lowonganId: string;
}

export default function RankingTable({ lowonganId }: RankingTableProps) {
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRanking = async () => {
    setLoading(true);
    const result = await calculateRanking(lowonganId);
    if (result.success) {
      setRankingData(result.data);
    } else {
      setError(result.error || "Gagal memuat data ranking");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRanking();
  }, [lowonganId]);

  const handleDecision = async (lamaranId: string, decision: 'diterima' | 'ditolak' | 'cadangan') => {
    setProcessingId(lamaranId);
    const result = await saveDecision(lamaranId, decision);
    if (result.success) {
      // Refresh data to show updated decision
      await fetchRanking();
    } else {
      alert(result.error || "Gagal menyimpan keputusan");
    }
    setProcessingId(null);
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-[#fccf54]/10 text-[#fccf54] border-[#fccf54]/20 shadow-[0_0_20px_rgba(252,207,84,0.15)] ring-1 ring-[#fccf54]/50";
    if (index === 1) return "bg-gray-100 text-gray-500 border-gray-200 ring-1 ring-gray-300/30";
    if (index === 2) return "bg-orange-50 text-orange-600 border-orange-100 ring-1 ring-orange-500/20";
    return "bg-gray-50 text-gray-400 border-gray-100";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Medal size={16} className="text-[#fccf54]" />;
    if (index === 1) return <Medal size={16} className="text-gray-400" />;
    if (index === 2) return <Medal size={16} className="text-orange-400" />;
    return <span className="text-[10px] font-black">{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[40px] border border-gray-100 shadow-sm">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-50 border-t-[#3c50e0] rounded-full animate-spin" />
          <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200" size={24} />
        </div>
        <div>
          <p className="text-sm font-black text-gray-900 tracking-widest text-center">MENGHITUNG SAW...</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Menormalisasi & memproses preferensi</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 bg-white rounded-[40px] border border-gray-100 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Perhitungan Terhenti</h3>
          <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legend / Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-4 bg-[#fccf54]/5 rounded-3xl border border-[#fccf54]/20">
        <div className="flex items-center gap-3">
          <Info size={18} className="text-[#fccf54]" />
          <p className="text-[11px] text-amber-800 font-bold leading-relaxed max-w-lg">
            Hasil ranking di bawah ini bersifat rekomendasi sistem berdasarkan pembobotan kriteria yang telah diatur. HRD tetap memiliki wewenang penuh untuk keputusan akhir.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Diterima</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ditolak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cadangan</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Rank</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Data Kandidat</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Skor (C1-C5)</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Nilai SAW</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[3px] text-right">Keputusan Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rankingData.map((res, index) => (
                <tr key={res.id_penilaian} className={`hover:bg-gray-50/70 transition-colors group ${res.keputusan ? 'opacity-80' : ''}`}>
                  <td className="px-8 py-8">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${getRankStyle(index)}`}>
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-black text-gray-900 tracking-tight group-hover:text-[#3c50e0] transition-colors">
                        {res.nama_pelamar}
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider italic flex items-center gap-2">
                        <Building2 size={12} className="text-gray-300" />
                        {res.institusi}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2">
                      {[res.nilai_asli.c1, res.nilai_asli.c2, res.nilai_asli.c3, res.nilai_asli.c4, res.nilai_asli.c5].map((val, i) => (
                        <div key={i} className="group/score relative">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all cursor-default ${
                            val >= 80 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                          }`}>
                            {val}
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[8px] font-bold rounded opacity-0 group-hover/score:opacity-100 transition-opacity whitespace-nowrap z-20">
                            CRITERION C{i+1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between max-w-[120px]">
                        <span className="text-[10px] font-black text-gray-400 leading-none">PREFERENSI</span>
                        <span className="text-sx font-black text-[#3c50e0] leading-none">{(res.nilai_preferensi * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${
                            index === 0 ? 'bg-[#fccf54] shadow-[0_0_10px_rgba(252,207,84,0.5)]' : 'bg-[#3c50e0]'
                          }`}
                          style={{ width: `${res.nilai_preferensi * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center justify-end gap-2">
                      {res.keputusan ? (
                        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border ${
                          res.keputusan === 'diterima' ? 'bg-green-50 border-green-200 text-green-600' :
                          res.keputusan === 'ditolak' ? 'bg-red-50 border-red-200 text-red-600' :
                          'bg-blue-50 border-blue-200 text-blue-600'
                        }`}>
                          {res.keputusan === 'diterima' && <CheckCircle2 size={16} />}
                          {res.keputusan === 'ditolak' && <XCircle size={16} />}
                          {res.keputusan === 'cadangan' && <Clock size={16} />}
                          <span className="text-[10px] font-black uppercase tracking-widest">{res.keputusan}</span>
                          <button 
                            onClick={() => handleDecision(res.id_lamaran, 'cadangan')} // Just to allow "reset" or change
                            className="ml-2 hover:opacity-70"
                            title="Warna Ulang Keputusan"
                          >
                            <RotateCcw size={12} className="text-gray-400" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={!!processingId}
                            onClick={() => handleDecision(res.id_lamaran, 'diterima')}
                            className="w-10 h-10 bg-white border border-gray-100 text-green-500 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
                            title="Terima"
                          >
                            {processingId === res.id_lamaran ? <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" /> : <Check size={18} />}
                          </button>
                          <button 
                            disabled={!!processingId}
                            onClick={() => handleDecision(res.id_lamaran, 'ditolak')}
                            className="w-10 h-10 bg-white border border-gray-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95"
                            title="Tolak"
                          >
                            <X size={18} />
                          </button>
                          <button 
                            disabled={!!processingId}
                            onClick={() => handleDecision(res.id_lamaran, 'cadangan')}
                            className="w-10 h-10 bg-white border border-gray-100 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                            title="Cadangan"
                          >
                            <Minus size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

