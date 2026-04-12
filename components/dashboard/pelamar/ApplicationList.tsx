import React from 'react';
import ApplicationCard from './ApplicationCard';
import { Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ApplicationListProps {
  lamaran: any[];
}

const ApplicationList = ({ lamaran }: ApplicationListProps) => {
  if (lamaran.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Briefcase size={40} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Lamaran</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-8">
          Anda belum mengirimkan lamaran pekerjaan apa pun. Jelajahi lowongan yang tersedia dan mulailah perjalanan karir Anda.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#fccf54] text-gray-900 rounded-2xl font-bold hover:bg-[#efc03f] transition-all shadow-xl shadow-[#fccf54]/20 group"
        >
          <span>Cari Lowongan</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Lamaran Saya ({lamaran.length})</h3>
        <Link href="/" className="text-sm font-bold text-[#efc03f] hover:underline flex items-center gap-1">
          Tambah Lamaran <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {lamaran.map((item) => (
          <ApplicationCard key={item.id_lamaran} lamaran={item} />
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;
