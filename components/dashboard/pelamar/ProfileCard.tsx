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
      <div className="bg-white rounded-sm border border-gray-100 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Kolom Kiri: Avatar */}
          <div className="md:col-span-3 flex flex-col items-center justify-center pt-7 md:pt-4 md:mr-6">
            <div className="w-48 h-70 bg-white rounded-sm flex items-center justify-center border-2 border-gray-100 md:mb-4 overflow-hidden">
              {profil ? (
                <span className="text-4xl font-black text-gray-300">{initials}</span>
              ) : (
                <User size={56} className="text-gray-200" />
              )}
            </div>
          </div>

          {/* Kolom Kanan: Info */}
          <div className="md:col-span-9 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold capitalize text-gray-800 tracking-tight leading-tight mb-6">
                {user.nama_lengkap}
              </h2>

              <div className="flex flex-col gap-3">
                {/* NIK */}
                <div className='md:flex md:justify-between md:items-center'>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-0.5">No. KTP / NIK</p>
                  <p className="text-lg text-gray-800 tracking-wider font-mono">
                    {profil?.nik
                      ? `${profil.nik.slice(0, 8)}••••••••`
                      : '-'}
                  </p>
                </div>

                {/* Institusi */}
                <div className='md:flex md:justify-between md:items-center'>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Institusi</p>
                  <p className="text-lg text-gray-800 capitalize leading-tight">{profil?.nama_institusi || '-'}</p>
                </div>

                {/* Tahun Lulus */}
                <div className='md:flex md:justify-between md:items-center'>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Tahun Lulus</p>
                  <p className="text-lg text-gray-800">{profil?.tahun_lulus || '-'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/dashboard/cv"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#fccf54] text-gray-900 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-[#efc03f] transition-all shadow-lg shadow-[#fccf54]/20 group"
              >
                <span>Lihat CV Saya</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
