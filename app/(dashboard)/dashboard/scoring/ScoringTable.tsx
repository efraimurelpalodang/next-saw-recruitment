"use client";

import React, { useState, useEffect } from "react";
import { getScoringDataForVacancy, processSAWScoring } from "@/app/actions/hrd/scoring";
import { Calculator, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ScoringTableProps {
  vacancies: { id: string; title: string; code: string }[];
  defaultVacancyId?: string;
}

export default function ScoringTable({ vacancies, defaultVacancyId }: ScoringTableProps) {
  const [selectedVacancy, setSelectedVacancy] = useState(defaultVacancyId || "");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    if (selectedVacancy) {
      fetchData();
    } else {
      setRecords([]);
    }
  }, [selectedVacancy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getScoringDataForVacancy(selectedVacancy);
      setRecords(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCompute = async () => {
    if (!selectedVacancy) return;
    setComputing(true);
    const res = await processSAWScoring(selectedVacancy);
    if (res.error) {
      alert(res.error);
    } else {
      await fetchData();
    }
    setComputing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Filters and CTA */}
      <div className="bg-white p-5 rounded-xl border border-[#f5f2f2] shadow-xs flex flex-col sm:flex-row justify-between gap-4 items-end">
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-semibold text-[#2a3547] mb-2">Pilih Lowongan Aktif</label>
          <select 
            value={selectedVacancy}
            onChange={(e) => setSelectedVacancy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none"
          >
            <option value="">-- Pilih Posisi Pekerjaan --</option>
            {vacancies.map(v => (
              <option key={v.id} value={v.id}>{v.code} - {v.title}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleCompute}
          disabled={!selectedVacancy || computing || records.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#13deb9] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
        >
          <Calculator size={18} /> {computing ? "Menghitung..." : "Hitung / Perbarui Ranking SAW"}
        </button>
      </div>

      {/* Table Data */}
      {selectedVacancy && (
        <div className="bg-white rounded-xl border border-[#f5f2f2] shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Memuat data...</div>
          ) : records.length === 0 ? (
            <div className="p-10 text-center text-gray-500">Belum ada data pelamar untuk dievaluasi pada posisi ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-[#fcfdfe] border-b border-[#f2f6fa]">
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider w-16 text-center">Rank</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider">Nama Kandidat</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider text-center">C1(Pdk)</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider text-center">C2(Pgl)</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider text-center">C3(Srt)</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider text-center">C4(Tes)</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider text-center">C5(Waw)</th>
                    <th className="py-4 px-5 text-[12px] font-black text-[#5d87ff] uppercase tracking-wider text-center">Total V</th>
                    <th className="py-4 px-5 text-[12px] font-bold text-[#2a3547] uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f6fa]">
                  {records.map((r, index) => {
                    const isTop3 = r.penilaian?.peringkat && r.penilaian.peringkat <= 3 && r.penilaian.peringkat > 0;
                    return (
                      <tr key={r.id_lamaran} className={isTop3 ? "bg-[#fef7df]/30 hover:bg-[#fef7df]/60" : "hover:bg-gray-50/50"}>
                        <td className="py-3 px-5 text-center">
                          {r.penilaian?.peringkat ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              r.penilaian.peringkat === 1 ? "bg-[#fccf54] text-white" :
                              r.penilaian.peringkat === 2 ? "bg-gray-300 text-gray-700" :
                              r.penilaian.peringkat === 3 ? "bg-orange-300 text-orange-900" : "text-gray-500"
                            }`}>
                              {r.penilaian.peringkat}
                            </span>
                          ) : "-"}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            {isTop3 && <Award size={16} className={r.penilaian.peringkat === 1 ? "text-[#fccf54]" : "text-gray-400"} />}
                            <div>
                              <p className="text-sm font-bold text-[#2a3547]">{r.pengguna.nama_lengkap}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center text-xs font-medium text-gray-600">
                          {r.penilaian?.nilai_c1_pendidikan ? r.penilaian.nilai_c1_pendidikan.toFixed(1) : "-"}
                        </td>
                        <td className="py-3 px-5 text-center text-xs font-medium text-gray-600">
                          {r.penilaian?.nilai_c2_pengalaman ? r.penilaian.nilai_c2_pengalaman.toFixed(1) : "-"}
                        </td>
                        <td className="py-3 px-5 text-center text-xs font-medium text-gray-600">
                          {r.penilaian?.nilai_c3_sertifikasi ? r.penilaian.nilai_c3_sertifikasi.toFixed(1) : "-"}
                        </td>
                        <td className="py-3 px-5 text-center text-xs font-medium text-gray-600">
                          {r.penilaian?.nilai_c4_tes_keterampilan ? r.penilaian.nilai_c4_tes_keterampilan.toFixed(1) : "-"}
                        </td>
                        <td className="py-3 px-5 text-center text-xs font-medium text-gray-600">
                          {r.penilaian?.nilai_c5_wawancara ? r.penilaian.nilai_c5_wawancara.toFixed(1) : "-"}
                        </td>
                        <td className="py-3 px-5 text-center">
                          {r.penilaian?.nilai_preferensi ? (
                            <span className="text-sm font-black text-[#5d87ff]">{r.penilaian.nilai_preferensi.toFixed(4)}</span>
                          ) : (
                            <span className="text-xs text-gray-400">Belum dihitung</span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <Link href={`/dashboard/applicants/${r.id_lamaran}`} className="inline-flex items-center text-xs font-bold text-[#fa896b] hover:underline gap-1">
                            Review <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
