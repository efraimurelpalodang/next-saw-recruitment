import React from 'react';
import LogoutButton from '@/components/ui/LogoutButton';

export default function KontenManajer({ pengguna }: { pengguna: any }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Manajer</h1>
          <p className="text-gray-500 mt-1">Pantau Rekrutmen</p>
        </div>
        <LogoutButton />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <p className="text-gray-700 mb-4">Selamat datang, <span className="font-bold text-gray-900">{pengguna.nama_lengkap}</span>.</p>
        <p className="text-gray-600">Di sini Anda dapat meninjau laporan hasil peringkat SAW dan rekomendasi calon karyawan yang disajikan oleh sistem dan HRD.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="p-6 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition text-left group">
          <h3 className="font-semibold text-rose-900 text-lg mb-2 group-hover:text-rose-700">Laporan Rekrutmen &rarr;</h3>
          <p className="text-rose-700 text-sm">Lihat data kandidat terbaik hasil metode perhitungan SAW.</p>
        </button>

        <button className="p-6 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition text-left group">
          <h3 className="font-semibold text-teal-900 text-lg mb-2 group-hover:text-teal-700">Aktivitas Audit &rarr;</h3>
          <p className="text-teal-700 text-sm">Pantau riwayat operasi HRD dan sistem keamanan.</p>
        </button>
      </div>
    </div>
  );
}
