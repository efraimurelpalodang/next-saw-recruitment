"use client";

import React, { useState, useEffect } from "react";
import { updateWeights } from "@/app/actions/hrd/weights";
import { Save } from "lucide-react";

interface WeightEditorProps {
  initialWeights: {
    id_bobot: string;
    kode_kriteria: string;
    nama_kriteria: string;
    bobot: number;
  }[];
}

export default function WeightEditor({ initialWeights }: WeightEditorProps) {
  const [weights, setWeights] = useState(initialWeights);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const sum = weights.reduce((acc, curr) => acc + curr.bobot, 0);
    // Round to 3 decimal places to avoid floating point errors
    setTotal(Math.round(sum * 1000) / 1000);
  }, [weights]);

  const handleWeightChange = (index: number, newBobot: string) => {
    const val = parseFloat(newBobot);
    const newWeights = [...weights];
    newWeights[index].bobot = isNaN(val) ? 0 : val;
    setWeights(newWeights);
    setMessage(null); // clear message on change
  };

  const handleSave = async () => {
    if (total !== 1.0) {
      setMessage({ type: 'error', text: "Total bobot harus pas 1.0 (100%)." });
      return;
    }

    setLoading(true);
    setMessage(null);
    const dataToSave = weights.map(w => ({ id_bobot: w.id_bobot, bobot: w.bobot }));
    
    const res = await updateWeights(dataToSave);
    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: "Bobot berhasil diperbarui!" });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs overflow-hidden">
      
      {message && (
        <div className={`p-4 ${message.type === 'success' ? 'bg-[#13deb9]/10 text-[#13deb9]' : 'bg-[#fa896b]/10 text-[#fa896b]'} font-semibold text-sm`}>
          {message.text}
        </div>
      )}

      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="bg-[#fcfdfe] border-b border-[#f2f6fa]">
            <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider">Kode</th>
            <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider">Kriteria (Benefit)</th>
            <th className="py-4 px-6 text-[13px] font-bold text-[#2a3547] uppercase tracking-wider text-right w-48">Bobot (%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f2f6fa]">
          {weights.map((w, idx) => (
            <tr key={w.id_bobot} className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6 text-sm font-bold text-[#2a3547] w-24">{w.kode_kriteria}</td>
              <td className="py-4 px-6 text-sm font-medium text-[#5a6a85]">{w.nama_kriteria}</td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <input 
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={w.bobot}
                    onChange={(e) => handleWeightChange(idx, e.target.value)}
                    className="w-20 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-bold text-[#2a3547] text-right focus:border-[#fccf54] focus:ring-1 focus:ring-[#fccf54]/20 outline-none"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-[#fcfdfe]">
          <tr>
            <td colSpan={2} className="py-4 px-6 text-sm font-bold text-[#2a3547] text-right">
              Total Bobot:
            </td>
            <td className="py-4 px-6 text-right">
              <span className={`text-sm font-bold px-3 py-1.5 rounded-md ${total === 1.0 ? 'bg-[#13deb9]/10 text-[#13deb9]' : 'bg-[#fa896b]/10 text-[#fa896b]'}`}>
                {total.toFixed(2)}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="p-6 bg-gray-50/50 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={loading || total !== 1.0}
          className="flex items-center gap-2 bg-[#fccf54] text-[#2a3547] px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Save size={18} /> {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
