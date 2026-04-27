"use client";

import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, Trash2, ChevronDown, Briefcase } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Link from 'next/link';

interface DaftarLowonganDilamarProps {
  lamaran: any[];
}

function getTimeStatus(tanggalTutup: Date | string): { label: string; isOpen: boolean } {
  const tutup = new Date(tanggalTutup);
  const now = new Date();
  const diffMs = tutup.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Ditutup ${Math.abs(diffDays)} hari lalu`, isOpen: false };
  } else if (diffDays === 0) {
    return { label: 'Ditutup hari ini', isOpen: true };
  } else {
    return { label: `${diffDays} hari tersisa`, isOpen: true };
  }
}

export default function DaftarLowonganDilamar({ lamaran }: DaftarLowonganDilamarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  if (lamaran.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Briefcase className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1">Belum Ada Lamaran</h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">
          Anda belum pernah melamar ke lowongan manapun. Mulai cari pekerjaan sekarang.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition-all shadow-sm"
        >
          Cari Lowongan →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="relative inline-block">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            Lamaran Aktif
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lamaran Cards */}
      <div className="space-y-3">
        {lamaran.map((item) => {
          const timeStatus = getTimeStatus(item.lowongan?.tanggal_tutup);
          const tanggalLamar = new Date(item.tanggal_lamar);

          return (
            <div
              key={item.id_lamaran}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              {/* Top: date metadata */}
              <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-xs text-gray-400">
                  Dilamar pada{' '}
                  <span className="font-semibold text-gray-500">
                    {tanggalLamar.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </span>
              </div>

              <div className="border-t border-gray-50" />

              {/* Job Info */}
              <div className="px-5 py-3">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {item.lowongan?.jenis_pekerjaan?.nama_jenis || 'Lowongan'}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      <span className="text-xs text-gray-400">{item.lowongan?.lokasi_kerja || 'Lokasi penempatan'}</span>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Deskripsi */}
                {item.lowongan?.deskripsi && (
                  <div className="mt-2.5 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.lowongan.deskripsi}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between gap-3">
                {/* Waktu sisa */}
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${timeStatus.isOpen ? 'text-gray-300' : 'text-red-300'}`} />
                  <span className={`text-xs font-medium ${timeStatus.isOpen ? 'text-gray-400' : 'text-red-400'}`}>
                    {timeStatus.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {timeStatus.isOpen && (
                    <button
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                      title="Cabut Lamaran"
                    >
                      <Trash2 className="w-3 h-3" />
                      Cabut
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
