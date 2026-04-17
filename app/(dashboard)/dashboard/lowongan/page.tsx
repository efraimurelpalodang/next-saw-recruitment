import React from "react";
import VacancyManagement from "@/components/dashboard/hrd/VacancyManagement";
import { getLowongan, getJenisPekerjaan } from "@/app/actions/hrd/lowongan";
import { AlertCircle } from "lucide-react";

export default async function LowonganPage() {
  const [vacanciesRes, jenisRes] = await Promise.all([
    getLowongan(),
    getJenisPekerjaan()
  ]);

  if (vacanciesRes.error || jenisRes.error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3">
        <AlertCircle size={20} />
        <div>
          <h2 className="font-bold">Terjadi Kesalahan</h2>
          <p className="text-sm">{vacanciesRes.error || jenisRes.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Manajemen Lowongan</h1>
        <p className="text-sm text-gray-500 font-medium italic">
          Publikasikan lowongan pekerjaan baru dan kelola proses rekrutmen secara efisien.
        </p>
      </div>

      <VacancyManagement 
        initialVacancies={(vacanciesRes.data as any) || []} 
        jenisPekerjaan={(jenisRes.data as any) || []} 
      />
    </div>
  );
}
