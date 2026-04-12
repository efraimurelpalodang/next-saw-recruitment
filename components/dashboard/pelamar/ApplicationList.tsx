import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface ApplicationListProps {
  lamaran: any[];
}

const ApplicationList = ({ lamaran }: ApplicationListProps) => {
  if (lamaran.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-16 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Briefcase size={40} className="text-gray-200" />
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-3">Belum Ada Lamaran</h3>
        <p className="text-gray-400 font-bold text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          Anda belum mengirimkan lamaran pekerjaan. Jelajahi lowongan yang tersedia dan mulailah perjalanan karir Anda.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#fccf54] text-gray-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#efc03f] transition-all shadow-xl shadow-[#fccf54]/20 group"
        >
          <span>Lihat Lowongan</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gray-200 rounded-full" />
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.15em]">
            5 Lamaran Terbaru
          </h3>
        </div>
        <Link 
          href="/dashboard/lamaran" 
          className="text-[11px] font-black text-[#efc03f] hover:text-gray-900 uppercase tracking-widest flex items-center gap-1.5 transition-colors group"
        >
          Lihat Semua <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3">
        {lamaran.map((item) => (
          <div 
            key={item.id_lamaran}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-gray-900 text-sm truncate">
                  {item.lowongan?.jenis_pekerjaan?.nama_jenis || 'N/A'}
                </p>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                  {new Date(item.tanggal_lamar).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;
