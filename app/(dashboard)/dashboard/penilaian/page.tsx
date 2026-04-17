import React from "react";
import AssessmentDashboard from "@/components/dashboard/hrd/AssessmentDashboard";
import { getLowonganWithStats } from "@/app/actions/hrd/assessment";

export const metadata = {
  title: "Penilaian Pelamar | SAW Recruitment",
};

export default async function PenilaianPage() {
  const result = await getLowonganWithStats();

  if (result.error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold">
        Error: {result.error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <AssessmentDashboard initialLowongan={result.data || []} />
    </div>
  );
}
