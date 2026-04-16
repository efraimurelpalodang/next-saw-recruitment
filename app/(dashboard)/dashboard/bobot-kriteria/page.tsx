import React from "react";
import WeightsManagement from "@/components/dashboard/hrd/WeightsManagement";
import { getKriteria } from "@/app/actions/hrd/weights";

export default async function BobotKriteriaPage() {
  const result = await getKriteria();

  if (result.error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-xl text-red-700">
        <h2 className="font-bold">Terjadi Kesalahan</h2>
        <p className="text-sm">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">PENGATURAN BOBOT SAW</h1>
        <p className="text-sm text-gray-500 font-medium">Kelola bobot prioritas untuk setiap kriteria penilaian rekrutmen.</p>
      </div>

      <WeightsManagement initialData={result.data || []} />
    </div>
  );
}
