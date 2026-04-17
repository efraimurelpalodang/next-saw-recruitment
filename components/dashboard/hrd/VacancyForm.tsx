"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save, AlertCircle, Calendar, MapPin, Briefcase, FileText } from "lucide-react";

const vacancySchema = z.object({
  id_lowongan: z.string().optional(),
  id_jenis_pekerjaan: z.string().min(1, "Jenis pekerjaan wajib dipilih"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  persyaratan: z.string().min(10, "Persyaratan minimal 10 karakter"),
  lokasi_kerja: z.string().min(1, "Lokasi kerja wajib diisi"),
  tanggal_buka: z.string().min(1, "Tanggal buka wajib diisi"),
  tanggal_tutup: z.string().min(1, "Tanggal tutup wajib diisi"),
}).refine((data) => {
  const openDate = new Date(data.tanggal_buka);
  const closeDate = new Date(data.tanggal_tutup);
  return closeDate > openDate;
}, {
  message: "Tanggal tutup harus setelah tanggal buka",
  path: ["tanggal_tutup"],
});

type VacancyFormValues = z.infer<typeof vacancySchema>;

interface JenisPekerjaan {
  id_jenis_pekerjaan: string;
  nama_jenis: string;
}

interface VacancyFormProps {
  initialData?: any;
  jenisPekerjaan: JenisPekerjaan[];
  onSubmit: (data: VacancyFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  canEditJobType?: boolean;
}

export default function VacancyForm({ 
  initialData, 
  jenisPekerjaan, 
  onSubmit, 
  onCancel, 
  loading,
  canEditJobType = true
}: VacancyFormProps) {
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      id_lowongan: initialData?.id_lowongan || "",
      id_jenis_pekerjaan: initialData?.id_jenis_pekerjaan || "",
      deskripsi: initialData?.deskripsi || "",
      persyaratan: initialData?.persyaratan || "",
      lokasi_kerja: initialData?.lokasi_kerja || "",
      tanggal_buka: initialData?.tanggal_buka ? new Date(initialData.tanggal_buka).toISOString().split('T')[0] : "",
      tanggal_tutup: initialData?.tanggal_tutup ? new Date(initialData.tanggal_tutup).toISOString().split('T')[0] : "",
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id_lowongan: initialData.id_lowongan,
        id_jenis_pekerjaan: initialData.id_jenis_pekerjaan,
        deskripsi: initialData.deskripsi,
        persyaratan: initialData.persyaratan,
        lokasi_kerja: initialData.lokasi_kerja,
        tanggal_buka: new Date(initialData.tanggal_buka).toISOString().split('T')[0],
        tanggal_tutup: new Date(initialData.tanggal_tutup).toISOString().split('T')[0],
      });
    }
  }, [initialData, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {initialData ? "EDIT LOWONGAN" : "BUAT LOWONGAN BARU"}
            </h2>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide">Lengkapi detail informasi pekerjaan di bawah ini.</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 overflow-y-auto no-scrollbar space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Jenis Pekerjaan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={12} className="text-[#fccf54]" />
                  Jenis Pekerjaan
                </label>
                <select
                  {...register("id_jenis_pekerjaan")}
                  disabled={!canEditJobType}
                  className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all font-medium ${!canEditJobType ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                >
                  <option value="">Pilih Jenis Pekerjaan</option>
                  {jenisPekerjaan.map((jp) => (
                    <option key={jp.id_jenis_pekerjaan} value={jp.id_jenis_pekerjaan}>
                      {jp.nama_jenis}
                    </option>
                  ))}
                </select>
                {errors.id_jenis_pekerjaan && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.id_jenis_pekerjaan.message}
                  </span>
                )}
                {!canEditJobType && (
                  <span className="text-[9px] text-amber-600 font-bold italic">
                    *Tidak dapat diubah karena sudah ada pelamar
                  </span>
                )}
              </div>

              {/* Lokasi Kerja */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-[#fccf54]" />
                  Lokasi Kerja
                </label>
                <input
                  {...register("lokasi_kerja")}
                  placeholder="Contoh: Jakarta Selatan (WFO)"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all font-medium"
                />
                {errors.lokasi_kerja && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.lokasi_kerja.message}
                  </span>
                )}
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={12} className="text-[#fccf54]" />
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  {...register("deskripsi")}
                  rows={3}
                  placeholder="Jelaskan peran dan tanggung jawab utama..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all font-medium resize-none"
                />
                {errors.deskripsi && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.deskripsi.message}
                  </span>
                )}
              </div>

              {/* Persyaratan */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={12} className="text-[#fccf54]" />
                  Persyaratan
                </label>
                <textarea
                  {...register("persyaratan")}
                  rows={3}
                  placeholder="Contoh: Minimal S1 Teknik Informatika, Pengalaman 2 tahun..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all font-medium resize-none"
                />
                {errors.persyaratan && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.persyaratan.message}
                  </span>
                )}
              </div>

              {/* Tanggal Buka */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-[#fccf54]" />
                  Tanggal Buka
                </label>
                <input
                  type="date"
                  {...register("tanggal_buka")}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all font-medium"
                />
                {errors.tanggal_buka && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.tanggal_buka.message}
                  </span>
                )}
              </div>

              {/* Tanggal Tutup */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-[#fccf54]" />
                  Tanggal Tutup
                </label>
                <input
                  type="date"
                  {...register("tanggal_tutup")}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all font-medium"
                />
                {errors.tanggal_tutup && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.tanggal_tutup.message}
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="px-6 py-5 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3c50e0] text-white rounded-xl text-xs font-black shadow-lg shadow-[#3c50e0]/20 hover:bg-[#2e3ea8] hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {initialData ? "SIMPAN PERUBAHAN" : "PUBLIKASIKAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
