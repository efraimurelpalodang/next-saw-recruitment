import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ScoringTable from "./ScoringTable";

export default async function ScoringPage({ searchParams }: { searchParams: { vacancy?: string } }) {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true }
  });

  const activeVacancies = await prisma.lowongan.findMany({
    where: { status: "aktif" },
    include: { jenis_pekerjaan: true }
  });

  return (
    <DashboardLayout user={pengguna} title="Penilaian SAW">
      <div className="animate-in fade-in duration-500 space-y-6">
        
        <div>
          <h2 className="text-xl font-bold text-[#2a3547] mb-1">DSS Penilaian Pelamar (SAW)</h2>
          <p className="text-sm text-[#5a6a85]">Proses data pelamar secara kuantitatif untuk menghasilkan rekomendasi terbaik.</p>
        </div>

        <ScoringTable 
          vacancies={activeVacancies.map(v => ({ id: v.id_lowongan, title: v.jenis_pekerjaan.nama_jenis, code: v.jenis_pekerjaan.kode_jenis }))} 
          defaultVacancyId={searchParams.vacancy}
        />
        
      </div>
    </DashboardLayout>
  );
}
