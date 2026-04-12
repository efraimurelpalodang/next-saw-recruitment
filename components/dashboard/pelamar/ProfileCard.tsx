import React from 'react';
import { User, Mail, Smartphone, GraduationCap, ChevronRight, Edit3, CalendarDays, IdCard } from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
  profil: any;
  user: any;
}

export default function ProfileCard({ profil, user }: ProfileCardProps) {
  const initials = user.nama_lengkap
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('');

  return (
    <div className="space-y-5">
      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Kolom Kiri: Avatar */}
          <div className="md:col-span-3 bg-gray-50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-100 shadow-sm mb-4 overflow-hidden relative">
              {profil ? (
                <span className="text-4xl font-black text-gray-300">{initials}</span>
              ) : (
                <User size={56} className="text-gray-200" />
              )}
            </div>
            <span className="px-4 py-1.5 bg-[#fccf54]/10 text-gray-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-[#fccf54]/20">
              {profil ? 'Profil Lengkap' : 'Profil'}
            </span>
          </div>

          {/* Kolom Kanan: Info */}
          <div className="md:col-span-9 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                {user.nama_lengkap}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-6">
                {/* Institusi */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0 mt-0.5">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Institusi</p>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{profil?.nama_institusi || '-'}</p>
                  </div>
                </div>

                {/* Tahun Lulus */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Tahun Lulus</p>
                    <p className="text-sm font-bold text-gray-800">{profil?.tahun_lulus || '-'}</p>
                  </div>
                </div>

                {/* NIK */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                    <IdCard size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">No. KTP / NIK</p>
                    <p className="text-sm font-bold text-gray-800 tracking-wider font-mono">
                      {profil?.nik
                        ? `${profil.nik.slice(0, 8)}••••••••`
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/dashboard/cv"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#fccf54] text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#efc03f] transition-all shadow-lg shadow-[#fccf54]/20 group"
              >
                <span>Lihat CV Saya</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Row */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat Email</p>
              <p className="text-sm font-bold text-gray-900">{user.email}</p>
            </div>
          </div>

          {/* Nomor HP */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 flex-shrink-0">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. Handphone</p>
              <p className="text-sm font-bold text-gray-900">{user.nomor_telepon || '-'}</p>
            </div>
          </div>
        </div>

        {/* Tombol Perbarui Data */}
        <Link
          href="/dashboard/cv"
          className="flex items-center gap-2.5 px-6 py-3 border-2 border-[#fccf54] text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#fccf54] transition-all group flex-shrink-0"
        >
          <Edit3 size={16} className="text-[#efc03f] group-hover:text-gray-900 transition-colors" />
          <span>Perbarui Data</span>
        </Link>
      </div>
    </div>
  );
}
