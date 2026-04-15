import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getJobTypes } from "@/app/actions/hrd/vacancies";
import CreateVacancyForm from "./CreateVacancyForm";

export default async function CreateVacancyPage() {
  const session = await getSession();
  if (!session || session.nama_peran.toLowerCase() !== "hrd") redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true }
  });

  const jobTypes = await getJobTypes();

  return (
    <DashboardLayout user={pengguna} title="Data Lowongan">
      <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#2a3547] mb-1">Buat Lowongan Baru</h2>
        <p className="text-sm text-[#5a6a85] mb-6">Lengkapi form berikut untuk mempublikasikan loker baru.</p>
        
        <div className="bg-white p-6 rounded-xl border border-[#f5f2f2] shadow-xs">
          <CreateVacancyForm jobTypes={jobTypes} />
        </div>
      </div>
    </DashboardLayout>
  );
}
