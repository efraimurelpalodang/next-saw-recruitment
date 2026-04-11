import React from 'react';
import LogoutButton from '@/components/ui/LogoutButton';

export default function KontenPelamar({ pengguna }: { pengguna: any }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pelamar</h1>
          <p className="text-gray-500 mt-1">Portal Karir</p>
        </div>
        <LogoutButton />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Hi, {pengguna.nama_lengkap}!</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">Pastikan profil Anda sudah diisi dengan lengkap sebelum mengajukan lamaran pekerjaan.</p>
        </div>
        <p className="text-gray-600">Status kelengkapan profil Anda dapat diperbarui secara mandiri.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition text-left group">
          <h3 className="font-semibold text-orange-900 text-lg mb-2 group-hover:text-orange-700">Lengkapi Profil &rarr;</h3>
          <p className="text-orange-700 text-sm">Isi biodata, pendidikan, dan pengalaman Anda.</p>
        </button>

        <button className="p-6 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition text-left group">
          <h3 className="font-semibold text-blue-900 text-lg mb-2 group-hover:text-blue-700">Eksplorasi Lowongan &rarr;</h3>
          <p className="text-blue-700 text-sm">Cari loker terbuka dan daftar sekarang.</p>
        </button>

        <button className="p-6 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition text-left group">
          <h3 className="font-semibold text-purple-900 text-lg mb-2 group-hover:text-purple-700">Status Lamaran &rarr;</h3>
          <p className="text-purple-700 text-sm">Cek status seleksi Anda apakah diterima atau ditolak.</p>
        </button>
      </div>
    </div>
  );
}
