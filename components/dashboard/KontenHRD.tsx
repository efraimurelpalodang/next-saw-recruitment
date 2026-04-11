import React from 'react';
import LogoutButton from '@/components/ui/LogoutButton';

export default function KontenHRD({ pengguna }: { pengguna: any }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard HRD</h1>
          <p className="text-gray-500 mt-1">Sistem Pendukung Keputusan Rekrutmen SAW</p>
        </div>
        <LogoutButton />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <p className="text-gray-700 mb-4">Selamat datang kembali, <span className="font-bold text-gray-900">{pengguna.nama_lengkap}</span>!</p>
        <p className="text-gray-600">Di halaman ini Anda dapat membuat lowongan baru, melihat kandidat, mengisi nilai mentah, dan membiarkan algoritma SAW memberikan peringkat terbaik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition text-left group">
          <h3 className="font-semibold text-blue-900 text-lg mb-2 group-hover:text-blue-700">Manajemen Lowongan &rarr;</h3>
          <p className="text-blue-700 text-sm">Buat, tutup, atau kelola info lowongan kerja.</p>
        </button>

        <button className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition text-left group">
          <h3 className="font-semibold text-indigo-900 text-lg mb-2 group-hover:text-indigo-700">Seleksi Pelamar & SAW &rarr;</h3>
          <p className="text-indigo-700 text-sm">Lihat lamaran masuk dan input skor wawancara.</p>
        </button>

        <button className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition text-left group">
          <h3 className="font-semibold text-emerald-900 text-lg mb-2 group-hover:text-emerald-700">Master Bobot Kriteria &rarr;</h3>
          <p className="text-emerald-700 text-sm">Atur ulang preferensi bobot C1 - C5.</p>
        </button>
      </div>
    </div>
  );
}
