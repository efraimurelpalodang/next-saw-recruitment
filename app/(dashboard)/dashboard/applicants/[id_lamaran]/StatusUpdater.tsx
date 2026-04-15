"use client";

import React, { useState } from "react";
import { updateLamaranStatus, updateKeputusanHRD } from "@/app/actions/hrd/applicants";

interface StatusUpdaterProps {
  id_lamaran: string;
  currentStatus: string;
  currentKeputusan: string | null;
}

export default function StatusUpdater({ id_lamaran, currentStatus, currentKeputusan }: StatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [keputusan, setKeputusan] = useState(currentKeputusan || "");
  const [loading, setLoading] = useState(false);

  const tahapanList = [
    { value: "pending", label: "Baru Melamar (Pending)" },
    { value: "screening", label: "Screening CV" },
    { value: "tes_skill", label: "Tes Keterampilan" },
    { value: "wawancara", label: "Wawancara" },
  ];

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    
    setLoading(true);
    const res = await updateLamaranStatus(id_lamaran, newStatus);
    if (res.success) {
      setStatus(newStatus);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleKeputusan = async (finalDecision: 'diterima' | 'ditolak' | 'cadangan') => {
    if (!confirm(`Konfirmasi pelamar dinyatakan: ${finalDecision.toUpperCase()}?`)) return;

    setLoading(true);
    const res = await updateKeputusanHRD(id_lamaran, finalDecision);
    if (res.success) {
      setKeputusan(finalDecision);
      setStatus("keputusan");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[#5a6a85] mb-2">Update Tahapan Saat Ini</label>
        <select 
          value={status} 
          onChange={handleStatusChange}
          disabled={loading || status === "keputusan"}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:border-[#fccf54] focus:ring-1 focus:ring-[#fccf54]/50 outline-none disabled:bg-gray-100 disabled:opacity-70"
        >
          <option value="keputusan" disabled hidden>Telah Diberi Keputusan</option>
          {tahapanList.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="pt-4 border-t border-[#f5f2f2]">
        <label className="block text-xs font-semibold text-[#5a6a85] mb-2">Keputusan Akhir HRD</label>
        {keputusan ? (
          <div className={`p-3 rounded-lg text-center font-bold text-sm ${
            keputusan === 'diterima' ? 'bg-[#13deb9]/10 text-[#13deb9]' : 
            keputusan === 'ditolak' ? 'bg-[#fa896b]/10 text-[#fa896b]' : 'bg-gray-200 text-gray-700'
          }`}>
            PELAMAR {keputusan.toUpperCase()}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleKeputusan('diterima')}
              disabled={loading}
              className="py-2 bg-[#13deb9] hover:bg-[#13deb9]/90 text-white rounded-md text-xs font-bold transition-colors"
            >
              Terima
            </button>
            <button 
              onClick={() => handleKeputusan('ditolak')}
              disabled={loading}
              className="py-2 bg-[#fa896b] hover:bg-[#fa896b]/90 text-white rounded-md text-xs font-bold transition-colors"
            >
              Tolak
            </button>
            <button 
              onClick={() => handleKeputusan('cadangan')}
              disabled={loading}
              className="col-span-2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-xs font-bold transition-colors"
            >
              Cadangkan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
