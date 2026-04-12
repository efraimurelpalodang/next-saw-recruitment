import React from 'react';

export type StatusType = 'pending' | 'screening' | 'tes_skill' | 'wawancara' | 'rekomendasi' | 'keputusan';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<string, { label: string, color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  screening: { label: 'Screening', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  tes_skill: { label: 'Tes Skill', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  wawancara: { label: 'Wawancara', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  rekomendasi: { label: 'Rekomendasi', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  keputusan: { label: 'Keputusan', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${config.color} ${className}`}>
      {config.label.toUpperCase()}
    </span>
  );
}
