import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProfileStatusProps {
  profil: any;
}

const ProfileStatus = ({ profil }: ProfileStatusProps) => {
  const mandatoryFields = [
    'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat',
    'pendidikan_terakhir', 'jurusan', 'nama_institusi', 'tahun_lulus',
    'berkas_ijazah', 'berkas_cv'
  ];

  let filledCount = 0;
  if (profil) {
    mandatoryFields.forEach(field => {
      if (profil[field] !== null && profil[field] !== undefined && profil[field] !== '') {
        filledCount++;
      }
    });
  }

  const percentage = Math.round((filledCount / mandatoryFields.length) * 100);
  
  const getStatusColor = () => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 100) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getBgColor = () => {
    if (percentage < 50) return 'bg-red-50 border-red-100';
    if (percentage < 100) return 'bg-amber-50 border-amber-100';
    return 'bg-emerald-50 border-emerald-100';
  };

  const getTextColor = () => {
    if (percentage < 50) return 'text-red-700';
    if (percentage < 100) return 'text-amber-700';
    return 'text-emerald-700';
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${getBgColor()} mb-8`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {percentage === 100 ? (
              <CheckCircle2 className="text-emerald-500" size={20} />
            ) : (
              <AlertCircle className={percentage < 50 ? 'text-red-500' : 'text-amber-500'} size={20} />
            )}
            <h3 className={`font-bold text-lg ${getTextColor()}`}>
              Kelengkapan Profil: {percentage}%
            </h3>
          </div>
          
          <p className={`text-sm mb-4 ${getTextColor()} opacity-80`}>
            {percentage === 100 
              ? 'Profil Anda sudah lengkap! Anda siap untuk melamar pekerjaan.' 
              : 'Lengkapi seluruh data profil dan unggah dokumen wajib agar dapat melamar pekerjaan.'}
          </p>

          <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden border border-black/5">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${getStatusColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0">
          <Link 
            href="/dashboard/profil"
            className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-bold border transition-all ${
              percentage === 100 
                ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' 
                : 'bg-white text-gray-800 border-gray-200 hover:border-[#fccf54] hover:text-[#efc03f]'
            }`}
          >
            <span>{percentage === 100 ? 'Lihat Profil' : 'Lengkapi Sekarang'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatus;
