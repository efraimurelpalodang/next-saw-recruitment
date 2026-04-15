"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createVacancy } from "@/app/actions/hrd/vacancies";

interface CreateVacancyFormProps {
  jobTypes: { id_jenis_pekerjaan: string; nama_jenis: string }[];
}

export default function CreateVacancyForm({ jobTypes }: CreateVacancyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      id_jenis_pekerjaan: formData.get("id_jenis_pekerjaan") as string,
      deskripsi: formData.get("deskripsi") as string,
      persyaratan: formData.get("persyaratan") as string,
      lokasi_kerja: formData.get("lokasi_kerja") as string,
      tanggal_buka: formData.get("tanggal_buka") as string,
      tanggal_tutup: formData.get("tanggal_tutup") as string,
    };

    if (!data.id_jenis_pekerjaan || !data.tanggal_buka || !data.tanggal_tutup) {
      setError("Mohon lengkapi data yang wajib diisi.");
      setLoading(false);
      return;
    }

    const res = await createVacancy(data);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard/vacancies");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-[#2a3547] mb-1.5">Posisi Pekerjaan</label>
        <select name="id_jenis_pekerjaan" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none transition-all text-sm">
          <option value="">-- Pilih Posisi --</option>
          {jobTypes.map((t) => (
            <option key={t.id_jenis_pekerjaan} value={t.id_jenis_pekerjaan}>{t.nama_jenis}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2a3547] mb-1.5">Deskripsi Pekerjaan</label>
        <textarea name="deskripsi" required rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none transition-all text-sm" placeholder="Jelaskan peran pekerjaan ini..."></textarea>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2a3547] mb-1.5">Persyaratan (Kualifikasi)</label>
        <textarea name="persyaratan" required rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none transition-all text-sm" placeholder="Sebutkan syarat pendidikan, keterampilan..."></textarea>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2a3547] mb-1.5">Lokasi Kerja</label>
        <input type="text" name="lokasi_kerja" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none transition-all text-sm" placeholder="Contoh: Jakarta Pusat" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#2a3547] mb-1.5">Tanggal Buka</label>
          <input type="date" name="tanggal_buka" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none transition-all text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2a3547] mb-1.5">Tanggal Tutup</label>
          <input type="date" name="tanggal_tutup" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 outline-none transition-all text-sm" />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#5a6a85] bg-gray-100 hover:bg-gray-200 transition-colors">Batal</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#2a3547] bg-[#fccf54] hover:opacity-90 transition-colors disabled:opacity-50">
          {loading ? "Menyimpan..." : "Publikasikan"}
        </button>
      </div>
    </form>
  );
}
