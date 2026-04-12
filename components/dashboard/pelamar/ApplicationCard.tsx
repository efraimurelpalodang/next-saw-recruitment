import React from 'react';
import { Calendar, Briefcase, MapPin, ChevronRight, BadgeCheck, FileText } from 'lucide-react';

interface ApplicationCardProps {
  lamaran: any;
}

const ApplicationCard = ({ lamaran }: ApplicationCardProps) => {
  const steps = [
    { key: 'pending', label: 'Pending', color: 'amber' },
    { key: 'screening', label: 'Screening', color: 'blue' },
    { key: 'tes_skill', label: 'Tes Skill', color: 'green' },
    { key: 'wawancara', label: 'Wawancara', color: 'purple' },
    { key: 'keputusan', label: 'Keputusan', color: 'gray' },
  ];

  const currentStatus = lamaran.status.toLowerCase();
  
  const getStepIndex = (status: string) => {
    const idx = steps.findIndex(s => s.key === status);
    if (idx === -1 && status === 'rekomendasi') return 3; // Rekomendasi is near interview/decision
    return idx;
  };

  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[#fccf54]/10 text-[#efc03f] text-xs font-bold rounded-full uppercase tracking-wider">
                {lamaran.lowongan.jenis_pekerjaan.nama_jenis}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Calendar size={14} />
                {new Date(lamaran.tanggal_lamar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#efc03f] transition-colors line-clamp-1">
              {lamaran.lowongan.jenis_pekerjaan.nama_jenis}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400" />
                {lamaran.lowongan.lokasi_kerja}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={16} className="text-gray-400" />
                {lamaran.lowongan.status === 'aktif' ? 'Status: Aktif' : 'Status: Tutup'}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:items-end gap-3 shrink-0">
            {lamaran.penilaian && (
              <div className="bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Skor SAW</p>
                  <p className="text-base font-bold text-gray-900">{lamaran.penilaian.nilai_preferensi?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Ranking</p>
                  <p className="text-base font-bold text-[#efc03f]">#{lamaran.penilaian.peringkat || '-'}</p>
                </div>
              </div>
            )}
            
            {lamaran.keputusan_hrd && (
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                lamaran.keputusan_hrd === 'diterima' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                lamaran.keputusan_hrd === 'ditolak' ? 'bg-red-50 text-red-600 border border-red-100' :
                'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {lamaran.keputusan_hrd === 'diterima' ? <BadgeCheck size={16} /> : <AlertCircle size={16} />}
                <span className="capitalize">{lamaran.keputusan_hrd}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline View */}
        <div className="mt-8 relative">
          <div className="absolute top-[18px] left-0 right-0 h-0.5 bg-gray-100" />
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isPast = index < currentIdx;
              const isCurrent = index === currentIdx;
              const isFuture = index > currentIdx;
              const isDecision = step.key === 'keputusan';

              return (
                <div key={step.key} className="flex flex-col items-center z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isPast ? 'bg-[#fccf54] border-[#fccf54] text-white' :
                    isCurrent ? 'bg-white border-[#fccf54] text-[#efc03f] shadow-lg shadow-[#fccf54]/20 scale-110' :
                    'bg-white border-gray-100 text-gray-300'
                  }`}>
                    {isPast ? <BadgeCheck size={18} /> : index + 1}
                  </div>
                  <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
import { AlertCircle } from 'lucide-react';
