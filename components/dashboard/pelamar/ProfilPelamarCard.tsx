"use client";

import React, { useState } from 'react';
import { Mail, Smartphone, MapPin, GraduationCap, Users, Pencil, Info, X, Save } from 'lucide-react';

interface ProfilPelamarCardProps {
  pengguna: any;
  profil: any;
}

function getProgressColor(pct: number): { bar: string; text: string; bg: string; label: string; hex: string } {
  if (pct >= 100) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Profil Lengkap ✓', hex: '#10b981' };
  if (pct >= 50)  return { bar: 'bg-blue-500',    text: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Sedang berlanjut', hex: '#3b82f6' };
  return              { bar: 'bg-orange-400',  text: 'text-orange-600',  bg: 'bg-orange-50',  label: 'Perlu dilengkapi', hex: '#fb923c' };
}

// Segmented bar — vertical column chart style (like the reference image)
function SegmentedBar({ percentage, colorClass, textClass }: { percentage: number; colorClass: string; textClass: string }) {
  const TOTAL_SEGMENTS = 20;
  const activeCount = Math.round((percentage / 100) * TOTAL_SEGMENTS);

  return (
    <div className="space-y-1.5">
      {/* Percentage label floats above the last active segment */}
      <div className="flex items-end gap-[3px]" style={{ height: 52 }}>
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => {
          const isActive = i < activeCount;
          const isLast = i === activeCount - 1;
          // Vary height: taller in the middle of active zone for organic feel
          const heightBase = 28;
          const heightBonus = isActive ? Math.round(Math.sin(((i + 1) / activeCount) * Math.PI) * 16) : 0;
          const segH = isActive ? heightBase + heightBonus : 14;

          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              {isLast && (
                <span className={`text-[11px] font-black leading-none ${textClass}`}>{percentage}%</span>
              )}
              <div
                className={`w-full rounded-sm transition-all duration-500 ${isActive ? colorClass : 'bg-gray-100'}`}
                style={{ height: segH }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilPelamarCard({ pengguna, profil }: ProfilPelamarCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const requiredFields = [
    pengguna?.email,
    pengguna?.nomor_telepon,
    profil?.alamat,
    profil?.jenis_kelamin,
    profil?.nama_institusi,
  ];

  const filledFields = requiredFields.filter((f) => f && f.toString().trim() !== '');
  const progressPercentage = Math.round((filledFields.length / requiredFields.length) * 100);
  const color = getProgressColor(progressPercentage);

  const initials = pengguna?.nama_lengkap
    ?.split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('') || 'U';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Info Profil Pelamar</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isEditing
              ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
          }`}
        >
          {isEditing ? <X size={13} /> : <Pencil size={13} />}
          {isEditing ? 'Batal' : 'Edit Profil'}
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {/* Avatar & Name */}
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fccf54]/60 to-[#f5b800]/30 border-2 border-[#fccf54]/40 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-black text-[#a07c00]">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              defaultValue={pengguna?.nama_lengkap}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40"
            />
          ) : (
            <p className="text-base font-bold text-gray-900 truncate">{pengguna?.nama_lengkap}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{profil?.nik ? `NIK: ${profil.nik}` : 'NIK belum diisi'}</p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Info Grid */}
      <div className="px-5 py-4 grid grid-cols-2 gap-y-5 gap-x-4">
        {/* Email */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
            <Mail size={11} /> Email
          </p>
          {isEditing ? (
            <input type="email" defaultValue={pengguna?.email} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />
          ) : (
            <p className="text-sm text-gray-700 font-medium truncate">{pengguna?.email || '—'}</p>
          )}
        </div>

        {/* Telepon */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
            <Smartphone size={11} /> Telepon
          </p>
          {isEditing ? (
            <input type="text" defaultValue={pengguna?.nomor_telepon || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />
          ) : (
            <p className="text-sm text-gray-700 font-medium">{pengguna?.nomor_telepon || '—'}</p>
          )}
        </div>

        {/* Alamat */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
            <MapPin size={11} /> Lokasi
          </p>
          {isEditing ? (
            <textarea defaultValue={profil?.alamat || ''} rows={2} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />
          ) : (
            <p className="text-sm text-gray-700 font-medium line-clamp-2">{profil?.alamat || '—'}</p>
          )}
        </div>

        {/* Jenis Kelamin */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
            <Users size={11} /> Jenis Kelamin
          </p>
          {isEditing ? (
            <select defaultValue={profil?.jenis_kelamin || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40">
              <option value="">Pilih</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          ) : (
            <p className="text-sm text-gray-700 font-medium">
              {profil?.jenis_kelamin === 'L' ? 'Laki-laki' : profil?.jenis_kelamin === 'P' ? 'Perempuan' : '—'}
            </p>
          )}
        </div>
      </div>

      {/* Institusi Pendidikan — full width */}
      <div className="px-5 pb-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
          <GraduationCap size={11} /> Institusi Pendidikan
        </p>
        {isEditing ? (
          <input type="text" defaultValue={profil?.nama_institusi || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />
        ) : (
          <p className="text-sm text-gray-700 font-medium">{profil?.nama_institusi || '—'}</p>
        )}
      </div>

      {/* Save Button */}
      {isEditing && (
        <>
          <div className="border-t border-gray-100" />
          <div className="px-5 py-3 flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm"
            >
              <Save size={12} /> Simpan Profil
            </button>
          </div>
        </>
      )}

      {/* Progress Bar — segmented chart style */}
      <div className="border-t border-gray-100" />
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            Progres Kelengkapan
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 cursor-help" title="Persentase field profil yang telah diisi">
              <Info size={8} />
            </span>
          </p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
            {color.label}
          </span>
        </div>

        {/* Segmented bar — vertical columns like the reference image */}
        <SegmentedBar percentage={progressPercentage} colorClass={color.bar} textClass={color.text} />
      </div>
    </div>
  );
}
