"use client";

import React, { useState } from "react";
import { 
  X, 
  Save, 
  Info, 
  GraduationCap, 
  History, 
  Award, 
  Target, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { saveAssessment } from "@/app/actions/hrd/assessment";

interface AssessmentFormProps {
  applicant: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssessmentForm({ applicant, onClose, onSuccess }: AssessmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nilaiC4, setNilaiC4] = useState<number>(applicant.penilaian?.nilai_c4_tes_keterampilan || 0);
  const [nilaiC5, setNilaiC5] = useState<number>(applicant.penilaian?.nilai_c5_wawancara || 0);

  // Perhitungan otomatis (Hanya untuk preview di UI)
  const getAutoScores = (profil: any) => {
    let c1 = 60;
    if (profil.pendidikan_terakhir === 'S3') c1 = 100;
    else if (profil.pendidikan_terakhir === 'S2') c1 = 90;
    else if (profil.pendidikan_terakhir === 'S1') c1 = 80;
    else if (profil.pendidikan_terakhir === 'D3') c1 = 70;

    let c2 = 40;
    const tahun = profil.pengalaman_kerja_tahun || 0;
    if (tahun >= 5) c2 = 100;
    else if (tahun >= 3) c2 = 80;
    else if (tahun >= 1) c2 = 60;

    let c3 = profil.berkas_sertifikat ? 100 : 50;

    return { c1, c2, c3 };
  };

  const autoScores = getAutoScores(applicant.pengguna.profil);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await saveAssessment({
      id_lamaran: applicant.id_lamaran,
      nilai_c4: Number(nilaiC4),
      nilai_c5: Number(nilaiC5)
    });

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "Gagal menyimpan data");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1c2434]/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Sidebar - Applicant Info */}
        <div className="md:w-1/3 bg-gray-50/50 p-10 border-r border-gray-50 flex flex-col items-center text-center overflow-y-auto no-scrollbar">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-3xl font-black text-[#3c50e0] mb-6">
            {applicant.pengguna.nama_lengkap.charAt(0)}
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {applicant.pengguna.nama_lengkap}
          </h2>
          <p className="text-xs text-gray-400 font-bold tracking-[3px] uppercase mt-2">Profil Pelamar</p>
          
          <div className="mt-10 space-y-6 w-full text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex-shrink-0 flex items-center justify-center text-[#fccf54] shadow-sm border border-gray-50">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendidikan</p>
                <p className="text-sm font-bold text-gray-800">{applicant.pengguna.profil.pendidikan_terakhir}</p>
                <p className="text-[11px] text-gray-400 font-medium">{applicant.pengguna.profil.nama_institusi}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex-shrink-0 flex items-center justify-center text-blue-400 shadow-sm border border-gray-50">
                <History size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pengalaman</p>
                <p className="text-sm font-bold text-gray-800">{applicant.pengguna.profil.pengalaman_kerja_tahun} Tahun</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex-shrink-0 flex items-center justify-center text-green-400 shadow-sm border border-gray-50">
                <Award size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sertifikasi</p>
                <p className="text-sm font-bold text-gray-800">{applicant.pengguna.profil.berkas_sertifikat ? 'Dilampirkan' : 'Tidak Ada'}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 text-left">
              <Info size={16} className="text-[#3c50e0] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                Sistem menghitung nilai C1-C3 secara otomatis berdasarkan berkas dan data profil di atas.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Scoring Form */}
        <div className="flex-1 p-10 flex flex-col overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">FORM PENILAIAN HYBRID</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Berikan skor (0-100) untuk kriteria subjektif.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all shadow-sm"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="flex-1 space-y-10">
            
            {/* Automatic Scores Section */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Penilaian Otomatis (Sistem)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50/80 p-5 rounded-[24px] border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">C1: Pendidikan</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{autoScores.c1}</p>
                </div>
                <div className="bg-gray-50/80 p-5 rounded-[24px] border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">C2: Pengalaman</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{autoScores.c2}</p>
                </div>
                <div className="bg-gray-50/80 p-5 rounded-[24px] border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">C3: Sertifikat</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{autoScores.c3}</p>
                </div>
              </div>
            </div>

            {/* Manual Input Section */}
            <div className="space-y-8 pt-6 border-t border-gray-50">
              <h4 className="text-[11px] font-black text-[#3c50e0] uppercase tracking-[3px] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3c50e0]" />
                Penilaian Manual (HRD)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* C4: Tes Skill */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Target size={14} className="text-[#3c50e0]" />
                    C4: Tes Keterampilan
                  </label>
                  <div className="relative group">
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={nilaiC4}
                      onChange={(e) => setNilaiC4(Number(e.target.value))}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-[22px] text-lg font-black outline-none focus:border-[#3c50e0] focus:ring-4 focus:ring-blue-500/5 transition-all"
                      placeholder="0-100"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">SKOR</div>
                  </div>
                </div>

                {/* C5: Wawancara */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#3c50e0]" />
                    C5: Wawancara
                  </label>
                  <div className="relative group">
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={nilaiC5}
                      onChange={(e) => setNilaiC5(Number(e.target.value))}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-[22px] text-lg font-black outline-none focus:border-[#3c50e0] focus:ring-4 focus:ring-blue-500/5 transition-all"
                      placeholder="0-100"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">SKOR</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-end gap-3 pt-10">
               <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-100 transition-all"
              >
                BATAL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 px-10 py-4 bg-[#3c50e0] text-white rounded-[22px] text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-[#2e3ea8] hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    SIMPAN PENILAIAN
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
