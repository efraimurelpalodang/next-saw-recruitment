import React from "react";
import RankingDashboard from "@/components/dashboard/hrd/RankingDashboard";
import { getLowonganForRanking } from "@/app/actions/hrd/ranking";

export const metadata = {
  title: "Ranking & Keputusan | SAW Recruitment",
};

export default async function RankingPage() {
  const result = await getLowonganForRanking();

  if (result.error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-[32px] text-red-600 font-bold flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">!</div>
        Error: {result.error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <RankingDashboard initialLowongan={result.data || []} />
    </div>
  );
}
