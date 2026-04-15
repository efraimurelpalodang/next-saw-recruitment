"use client";

import React, { useState } from "react";
import { updateVacancyStatus } from "@/app/actions/hrd/vacancies";

interface VacancyStatusToggleProps {
  id_lowongan: string;
  initialStatus: 'aktif' | 'tutup' | 'selesai';
}

export default function VacancyStatusToggle({ id_lowongan, initialStatus }: VacancyStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    if (loading || status === 'selesai') return;
    
    setLoading(true);
    const newStatus = status === 'aktif' ? 'tutup' : 'aktif';
    const res = await updateVacancyStatus(id_lowongan, newStatus);
    if (res.success) {
      setStatus(newStatus);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const getStyle = () => {
    switch (status) {
      case 'aktif': return 'bg-[#13deb9]/10 text-[#13deb9] border border-[#13deb9]/20';
      case 'tutup': return 'bg-[#fa896b]/10 text-[#fa896b] border border-[#fa896b]/20';
      case 'selesai': return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  return (
    <button 
      onClick={toggleStatus}
      disabled={loading || status === 'selesai'}
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${getStyle()} ${!loading && status !== 'selesai' ? 'hover:opacity-80 hover:scale-105' : 'cursor-not-allowed'}`}
    >
      {loading ? "..." : status}
    </button>
  );
}
