import React from 'react';
import WelcomeHeader from './pelamar/WelcomeHeader';
import ProfileStatus from './pelamar/ProfileStatus';
import ApplicationList from './pelamar/ApplicationList';
import { UserCircle, FileCheck, Search } from 'lucide-react';
import Link from 'next/link';

export default function KontenPelamar({ pengguna }: { pengguna: any }) {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="p-4 md:p-8 max-w-6xl mx-auto pt-10">
        <WelcomeHeader nama={pengguna.nama_lengkap} />
        
        <ProfileStatus profil={pengguna.profil} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Aksi Cepat</h3>
            
            <Link 
              href="/dashboard/profil"
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#fccf54] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-[#fccf54] group-hover:text-gray-900 transition-colors">
                <UserCircle size={26} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Edit Profil</p>
                <p className="text-xs text-gray-500 mt-0.5">Biodata & Pendidikan</p>
              </div>
            </Link>

            <Link 
              href="/"
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#fccf54] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-[#fccf54] group-hover:text-gray-900 transition-colors">
                <Search size={26} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Cari Pekerjaan</p>
                <p className="text-xs text-gray-500 mt-0.5">Eksplorasi Lowongan</p>
              </div>
            </Link>

            <div className="p-6 bg-[#fccf54] rounded-2xl shadow-xl shadow-[#fccf54]/20 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-gray-900 font-bold text-lg mb-1">Butuh Bantuan?</p>
                <p className="text-gray-800 text-sm mb-4 opacity-80">Hubungi tim rekrutmen kami jika ada kendala.</p>
                <button className="px-5 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold hover:shadow-lg transition-all">
                  Hubungi Kami
                </button>
              </div>
              <FileCheck size={120} className="absolute -bottom-6 -right-6 text-gray-900/5 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Application Tracking */}
          <div className="lg:col-span-2">
            <ApplicationList lamaran={pengguna.lamaran || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
