import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import WeightEditor from "./WeightEditor";
import { getWeights } from "@/app/actions/hrd/weights";

export default async function WeightsPage() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true }
  });

  const weights = await getWeights();

  return (
    <DashboardLayout user={pengguna} title="Master Bobot">
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-6">
        
        <div>
          <h2 className="text-xl font-bold text-[#2a3547] mb-1">Pengaturan Master Bobot</h2>
          <p className="text-sm text-[#5a6a85]">Atur tingkat kepentingan (bobot) dari setiap kriteria dalam perhitungan algoritma SAW.</p>
        </div>

        <div className="bg-[#f2f6fa] rounded-xl border border-gray-200 shadow-inner p-5 flex gap-4 items-start">
          <div className="bg-[#5d87ff] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0">i</div>
          <div>
            <h4 className="text-sm font-bold text-[#2a3547] mb-1">Aturan Pembobotan SAW</h4>
            <p className="text-xs text-[#5a6a85] font-medium leading-relaxed">
              Total dari seluruh bobot kriteria <strong>wajib berjumlah 1.0 (100%)</strong>. 
              Sistem telah diatur secara default untuk memproses C1-C5 sebagai atribut <i>Benefit</i> (nilai semakin tinggi semakin baik).
            </p>
          </div>
        </div>

        <WeightEditor initialWeights={weights} />
      </div>
    </DashboardLayout>
  );
}
