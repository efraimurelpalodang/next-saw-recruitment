"use client";

import React, { useState } from 'react';
import { User, Mail, Smartphone, MapPin, GraduationCap, Users } from 'lucide-react';

interface ProfilPelamarCardProps {
  pengguna: any;
  profil: any;
}

export default function ProfilPelamarCard({ pengguna, profil }: ProfilPelamarCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Progress Calculation
  const requiredFields = [
    pengguna?.email,
    pengguna?.nomor_telepon,
    profil?.alamat,
    profil?.jenis_kelamin,
    profil?.nama_institusi,
  ];
  
  const filledFields = requiredFields.filter((field) => field && field.toString().trim() !== '');
  const progressPercentage = Math.round((filledFields.length / requiredFields.length) * 100);

  const initials = pengguna?.nama_lengkap
    ?.split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('') || 'U';

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-gray-800">Profil Pelamar</h2>
        <button
          onClick={toggleEdit}
          className="px-4 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {isEditing ? 'Batal' : 'Edit'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
              <span className="text-3xl font-bold text-gray-400">{initials}</span>
            </div>
          </div>

          {/* Name & NIK */}
          <div className="flex flex-col justify-center">
            {isEditing ? (
              <div className="space-y-3 w-full md:w-64">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nama Pelamar</label>
                  <input type="text" defaultValue={pengguna?.nama_lengkap} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">NIK Pelamar</label>
                  <input type="text" defaultValue={profil?.nik || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 leading-none mb-2">{pengguna?.nama_lengkap}</h3>
                <p className="text-gray-500 text-sm">{profil?.nik ? `NIK: ${profil.nik}` : 'NIK Belum diatur'}</p>
              </>
            )}
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">Email</p>
              {isEditing ? (
                <input type="email" defaultValue={pengguna?.email} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              ) : (
                <p className="text-sm text-gray-500">{pengguna?.email || '-'}</p>
              )}
            </div>
          </div>

          {/* Handphone */}
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">Handphone</p>
              {isEditing ? (
                <input type="text" defaultValue={pengguna?.nomor_telepon || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              ) : (
                <p className="text-sm text-gray-500">{pengguna?.nomor_telepon || '-'}</p>
              )}
            </div>
          </div>

          {/* Alamat */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">Alamat</p>
              {isEditing ? (
                <textarea defaultValue={profil?.alamat || ''} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none" />
              ) : (
                <p className="text-sm text-gray-500">{profil?.alamat || '-'}</p>
              )}
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">Jenis Kelamin</p>
              {isEditing ? (
                <select defaultValue={profil?.jenis_kelamin || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              ) : (
                <p className="text-sm text-gray-500">{profil?.jenis_kelamin === 'L' ? 'Laki-laki' : profil?.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</p>
              )}
            </div>
          </div>

          {/* Nama Institusi Pendidikan */}
          <div className="flex items-start gap-3 md:col-span-2">
            <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">Nama Institusi Pendidikan</p>
              {isEditing ? (
                <input type="text" defaultValue={profil?.nama_institusi || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              ) : (
                <p className="text-sm text-gray-500">{profil?.nama_institusi || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-800 transition-colors"
            >
              Simpan Profil
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
            {progressPercentage}% <span className="font-normal text-gray-500 ml-1">- {progressPercentage === 100 ? 'Data Lengkap' : 'Silakan lengkapi profil anda'}</span>
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
