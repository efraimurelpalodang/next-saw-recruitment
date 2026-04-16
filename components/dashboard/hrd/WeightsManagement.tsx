"use client";

import React, { useState, useEffect } from "react";
import { Save, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateWeights, resetWeightsToDefault } from "@/app/actions/hrd/weights";

interface Kriteria {
  id_bobot: string;
  kode_kriteria: string;
  nama_kriteria: string;
  bobot: number;
  keterangan: string | null;
}

interface WeightsManagementProps {
  initialData: Kriteria[];
}

export default function WeightsManagement({ initialData }: WeightsManagementProps) {
  const [data, setData] = useState<Kriteria[]>(initialData);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const sum = data.reduce((acc, curr) => acc + curr.bobot, 0);
    setTotal(Number(sum.toFixed(2)));
  }, [data]);

  const handleWeightChange = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setData(prev => prev.map(item => 
      item.id_bobot === id ? { ...item, bobot: numericValue } : item
    ));
    setMessage(null);
  };

  const handleSave = async () => {
    if (Math.abs(total - 1.0) > 0.0001) {
      setMessage({ type: 'error', text: "Total bobot harus tepat 1.0 (100%)" });
      return;
    }

    setLoading(true);
    const result = await updateWeights(data.map(d => ({ id: d.id_bobot, bobot: d.bobot })));
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: "Bobot kriteria berhasil diperbarui!" });
    } else {
      setMessage({ type: 'error', text: result.error || "Gagal menyimpan data" });
    }
  };

  const handleReset = async () => {
    if (!confirm("Apakah Anda yakin ingin mereset semua bobot ke pembagian rata (default)?")) return;

    setLoading(true);
    const result = await resetWeightsToDefault();
    setLoading(false);

    if (result.success) {
      window.location.reload(); // Refresh to get seeded/calculated data
    } else {
      setMessage({ type: 'error', text: result.error || "Gagal mereset data" });
    }
  };

  const isValid = Math.abs(total - 1.0) < 0.0001;

  return (
    <div className="space-y-6">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Ringkasan Validasi</h2>
          <p className="text-sm text-gray-500">Pastikan total bobot semua kriteria adalah 1.0</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isValid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {isValid ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold uppercase tracking-wider">Total: {total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleReset}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-[#3c50e0] hover:bg-gray-100 rounded-lg transition-all"
            title="Reset ke Default"
          >
            <RotateCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>

          <button 
            onClick={handleSave}
            disabled={loading || !isValid}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md ${
              isValid && !loading 
                ? "bg-[#3c50e0] text-white hover:bg-[#2a3bb7] active:scale-95" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Message feedback */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 animate-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kriteria</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-32 text-center">Bobot (0.00)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((k) => (
                <tr key={k.id_bobot} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold font-mono">
                      {k.kode_kriteria}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-800">{k.nama_kriteria}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-gray-500 italic">{k.keterangan || "-"}</p>
                  </td>
                  <td className="px-6 py-5">
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="1"
                      value={k.bobot}
                      onChange={(e) => handleWeightChange(k.id_bobot, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-[#3c50e0] text-center focus:ring-2 focus:ring-[#3c50e0]/20 focus:outline-none transition-all group-hover:bg-white group-hover:border-[#3c50e0]/30"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50/30 font-bold">
                <td colSpan={3} className="px-6 py-4 text-right text-gray-500 uppercase text-[10px] tracking-widest">
                  Total Seluruh Bobot
                </td>
                <td className={`px-6 py-4 text-center text-lg ${isValid ? 'text-[#3c50e0]' : 'text-red-500'}`}>
                  {total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
        <div className="flex gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">Panduan Pengaturan Bobot</h4>
            <ul className="text-xs text-blue-700 space-y-1.5 list-disc ml-4 opacity-90">
              <li>Setiap nilai kriteria berkisar antara <b>0.00 hingga 1.00</b>.</li>
              <li>Jumlah <b>total (∑)</b> dari seluruh kriteria harus tepat bernilai <b>1.00</b> agar perhitungan SAW akurat.</li>
              <li>Semakin besar bobot suatu kriteria, semakin besar pengaruhnya terhadap ranking pelamar.</li>
              <li>Anda dapat menggunakan tombol <b>Reset</b> untuk membagi rata bobot jika ragu dengan pembagian nilai.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
