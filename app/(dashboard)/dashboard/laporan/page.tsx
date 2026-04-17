import React from "react";
import ReportDashboard from "@/components/dashboard/hrd/ReportDashboard";
import { getLowonganForReport } from "@/app/actions/hrd/report";

export const metadata = {
  title: "Laporan Seleksi | SAW Recruitment",
};

export default async function LaporanPage() {
  const result = await getLowonganForReport();

  if (result.error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-[32px] text-red-600 font-bold flex items-center gap-3">
        Error: {result.error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
      <ReportDashboard initialLowongan={result.data || []} />
    </div>
  );
}
