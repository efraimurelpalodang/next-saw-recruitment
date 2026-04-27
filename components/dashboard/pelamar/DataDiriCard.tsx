"use client";

import React, { useState } from 'react';
import { Pencil, X, Save, Info, MapPin, CalendarDays, GraduationCap, Briefcase, BookOpen } from 'lucide-react';

interface DataDiriCardProps {
  profil: any;
}

function getProgressColor(pct: number): { bar: string; text: string; bg: string; label: string } {
  if (pct >= 100) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Data Lengkap ✓' };
  if (pct >= 50)  return { bar: 'bg-blue-500',    text: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Sedang berlanjut' };
  return              { bar: 'bg-orange-400',  text: 'text-orange-600',  bg: 'bg-orange-50',  label: 'Perlu dilengkapi' };
}

export default function DataDiriCard({ profil }: DataDiriCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const requiredFields = [
    profil?.tempat_lahir,
    profil?.tanggal_lahir,
    profil?.pendidikan_terakhir,
    profil?.jurusan,
    profil?.tahun_lulus,
    profil?.pengalaman_kerja_tahun,
    profil?.pengalaman_bidang,
  ];

  const filledFields = requiredFields.filter((f) => f !== null && f !== undefined && f.toString().trim() !== '');
  const progressPercentage = Math.round((filledFields.length / requiredFields.length) * 100);
  const color = getProgressColor(progressPercentage);

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const fields = [
    {
      icon: <MapPin size={11} />,
      label: 'Tempat Lahir',
      value: profil?.tempat_lahir,
      input: <input type="text" defaultValue={profil?.tempat_lahir || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />,
    },
    {
      icon: <CalendarDays size={11} />,
      label: 'Tanggal Lahir',
      value: formatDate(profil?.tanggal_lahir),
      input: <input type="date" defaultValue={profil?.tanggal_lahir ? new Date(profil.tanggal_lahir).toISOString().split('T')[0] : ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />,
    },
    {
      icon: <GraduationCap size={11} />,
      label: 'Pendidikan Terakhir',
      value: profil?.pendidikan_terakhir,
      input: (
        <select defaultValue={profil?.pendidikan_terakhir || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40">
          <option value="">Pilih Pendidikan</option>
          {['SMA', 'SMK', 'D3', 'S1', 'S2', 'S3'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      ),
    },
    {
      icon: <BookOpen size={11} />,
      label: 'Jurusan',
      value: profil?.jurusan,
      input: <input type="text" defaultValue={profil?.jurusan || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />,
    },
    {
      icon: <CalendarDays size={11} />,
      label: 'Tahun Lulus',
      value: profil?.tahun_lulus,
      input: <input type="number" defaultValue={profil?.tahun_lulus || ''} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />,
    },
    {
      icon: <Briefcase size={11} />,
      label: 'Pengalaman Kerja',
      value: profil?.pengalaman_kerja_tahun !== undefined && profil?.pengalaman_kerja_tahun !== null
        ? `${profil.pengalaman_kerja_tahun} Tahun`
        : undefined,
      input: (
        <div className="flex items-center gap-2">
          <input type="number" defaultValue={profil?.pengalaman_kerja_tahun || 0} className="w-20 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40" />
          <span className="text-xs text-gray-400 font-medium">Tahun</span>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Data Diri Lengkap</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isEditing
              ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
          }`}
        >
          {isEditing ? <X size={13} /> : <Pencil size={13} />}
          {isEditing ? 'Batal' : 'Edit'}
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {/* Info Grid */}
      <div className="px-5 py-4 grid grid-cols-2 gap-y-5 gap-x-4">
        {fields.map((field, i) => (
          <div key={i}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              {field.icon} {field.label}
            </p>
            {isEditing ? field.input : (
              <p className="text-sm text-gray-700 font-medium">{field.value || '—'}</p>
            )}
          </div>
        ))}
      </div>

      {/* Pengalaman Bidang - full width */}
      <div className="px-5 pb-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
          <Briefcase size={11} /> Pengalaman di Bidangnya
        </p>
        {isEditing ? (
          <textarea
            defaultValue={profil?.pengalaman_bidang || ''}
            rows={3}
            placeholder="Ceritakan pengalaman spesifik Anda..."
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#fccf54]/40"
          />
        ) : (
          <p className="text-sm text-gray-700 font-medium leading-relaxed">{profil?.pengalaman_bidang || '—'}</p>
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
              <Save size={12} /> Simpan Data Diri
            </button>
          </div>
        </>
      )}

      {/* Progress Bar */}
      <div className="border-t border-gray-100" />
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            Progres Data Diri
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 cursor-help" title="Persentase field data diri yang telah diisi">
              <Info size={8} />
            </span>
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${color.text}`}>{progressPercentage}%</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
              {color.label}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ease-out ${color.bar}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-400">0%</span>
          <span className="text-[10px] text-gray-400">100%</span>
        </div>
      </div>
    </div>
  );
}
