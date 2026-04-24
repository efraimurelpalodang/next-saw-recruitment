"use client";

import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, ExternalLink, Trash2, ChevronDown } from 'lucide-react';
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
    const absDays = Math.abs(diffDays);
    return { label: `${absDays} hari lalu (waktu lamaran tersisa)`, isOpen: false };
  } else if (diffDays === 0) {
    return { label: 'Ditutup hari ini', isOpen: true };
  } else {
    return { label: `${diffDays} hari lagi (waktu lowongan tersisa)`, isOpen: true };
  }
}

export default function DaftarLowonganDilamar({ lamaran }: DaftarLowonganDilamarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  if (lamaran.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Belum Ada Lamaran</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
          Anda belum pernah melamar ke lowongan manapun. Mulai cari pekerjaan sekarang.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-gray-700 transition-colors"
        >
          Cari Lowongan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="relative inline-block">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Daftar Lowongan Pekerjaan Yang Dilamar
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <Link
          href="/dashboard/lamaran"
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Lamaran Cards */}
      <div className="space-y-4">
        {lamaran.map((item) => {
          const timeStatus = getTimeStatus(item.lowongan?.tanggal_tutup);
          const tanggalLamar = new Date(item.tanggal_lamar);

          return (
            <div key={item.id_lamaran} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
              {/* Tanggal Header */}
              <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 font-medium">
                  {tanggalLamar.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  {' '}
                  <span className="text-gray-400">( tanggal lamaran dilamar )</span>
                </span>
              </div>

              {/* Job Info */}
              <div className="px-5 pb-3">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {item.lowongan?.jenis_pekerjaan?.nama_jenis || 'Lowongan'}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-500">{item.lowongan?.lokasi_kerja || 'Lokasi penempatan'}</span>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Deskripsi */}
                {item.lowongan?.deskripsi && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Deskripsi Pekerjaan</p>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {item.lowongan.deskripsi}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
                {/* Waktu sisa */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className={`text-xs font-medium ${timeStatus.isOpen ? 'text-gray-500' : 'text-red-500'}`}>
                    {timeStatus.isOpen ? '' : 'Lowongan ditutup · '}
                    {timeStatus.label}
                  </span>
                </div>

                {/* Tombol aksi */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {timeStatus.isOpen && (
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                      title="Cabut Lamaran"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Cabut Lamaran
                    </button>
                  )}
                  <Link
                    href={`/dashboard/lamaran`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
