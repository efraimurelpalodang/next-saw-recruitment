"use client";

import React, { useState } from 'react';

interface DataDiriCardProps {
  profil: any;
}

export default function DataDiriCard({ profil }: DataDiriCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Progress Calculation
  const requiredFields = [
    profil?.tempat_lahir,
    profil?.tanggal_lahir,
    profil?.pendidikan_terakhir,
    profil?.jurusan,
    profil?.tahun_lulus,
    profil?.pengalaman_kerja_tahun,
    profil?.pengalaman_bidang,
  ];
  
  const filledFields = requiredFields.filter((field) => field !== null && field !== undefined && field.toString().trim() !== '');
  const progressPercentage = Math.round((filledFields.length / requiredFields.length) * 100);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-gray-800">Data Diri Lengkap</h2>
        <button
          onClick={toggleEdit}
          className="px-4 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {isEditing ? 'Batal' : 'Edit'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
          
          {/* Tempat Lahir */}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-gray-800 mb-1">Tempat Lahir</p>
            {isEditing ? (
              <input type="text" defaultValue={profil?.tempat_lahir || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            ) : (
              <p className="text-sm text-gray-500">{profil?.tempat_lahir || '-'}</p>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-gray-800 mb-1">Tanggal Lahir</p>
            {isEditing ? (
              <input type="date" defaultValue={profil?.tanggal_lahir ? new Date(profil.tanggal_lahir).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            ) : (
              <p className="text-sm text-gray-500">{formatDate(profil?.tanggal_lahir)}</p>
            )}
          </div>

          {/* Pendidikan Terakhir */}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-gray-800 mb-1">Pendidikan Terakhir</p>
            {isEditing ? (
              <select defaultValue={profil?.pendidikan_terakhir || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">Pilih Pendidikan</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            ) : (
              <p className="text-sm text-gray-500">{profil?.pendidikan_terakhir || '-'}</p>
            )}
          </div>

          {/* Jurusan */}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-gray-800 mb-1">Jurusan</p>
            {isEditing ? (
              <input type="text" defaultValue={profil?.jurusan || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            ) : (
              <p className="text-sm text-gray-500">{profil?.jurusan || '-'}</p>
            )}
          </div>

          {/* Tahun Lulus */}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-gray-800 mb-1">Tahun Lulus</p>
            {isEditing ? (
              <input type="number" defaultValue={profil?.tahun_lulus || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            ) : (
              <p className="text-sm text-gray-500">{profil?.tahun_lulus || '-'}</p>
            )}
          </div>

          {/* Pengalaman Kerja */}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-gray-800 mb-1">Pengalaman</p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input type="number" defaultValue={profil?.pengalaman_kerja_tahun || 0} className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <span className="text-sm text-gray-500">Tahun</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">{profil?.pengalaman_kerja_tahun !== undefined && profil?.pengalaman_kerja_tahun !== null ? `${profil.pengalaman_kerja_tahun} Tahun` : '-'}</p>
            )}
          </div>

          {/* Pengalaman Dibidangnya */}
          <div className="flex flex-col md:col-span-2">
            <p className="text-base font-semibold text-gray-800 mb-1">Pengalaman Dibidang nya</p>
            {isEditing ? (
              <textarea defaultValue={profil?.pengalaman_bidang || ''} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none" placeholder="Ceritakan pengalaman spesifik Anda..." />
            ) : (
              <p className="text-sm text-gray-500">{profil?.pengalaman_bidang || '-'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-800 transition-colors"
            >
              Simpan Data Diri
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            Progres Kelengkapan berkas 
            <span className="text-gray-400 flex items-center justify-center border border-gray-300 rounded-full w-4 h-4 text-[10px]">i</span>
          </p>
          <p className="text-sm font-bold text-gray-800">
            {progressPercentage}% <span className="font-normal text-gray-500 ml-1">- {progressPercentage === 100 ? 'Data Lengkap' : 'Silakan lengkapi data diri anda'}</span>
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gray-400 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
