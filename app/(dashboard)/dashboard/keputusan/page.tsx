import React from "react";
import DecisionDashboard from "@/components/dashboard/hrd/DecisionDashboard";
import { getLowonganSummary } from "@/app/actions/hrd/decision_summary";

export const metadata = {
  title: "Rekap Keputusan | SAW Recruitment",
};

export default async function KeputusanPage() {
  const result = await getLowonganSummary();

  if (result.error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-[32px] text-red-600 font-bold flex items-center gap-3">
        Error: {result.error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <DecisionDashboard initialLowongan={result.data || []} />
    </div>
  );
}
