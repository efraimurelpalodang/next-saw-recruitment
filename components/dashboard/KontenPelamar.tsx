import React from 'react';
import ProfileCard from './pelamar/ProfileCard';
import ApplicationList from './pelamar/ApplicationList';

export default function KontenPelamar({ pengguna }: { pengguna: any }) {
  if (!pengguna) return null;

  const firstName = pengguna.nama_lengkap?.split(' ')[0] ?? 'Pelamar';

  return (
    <div className="space-y-10">
      {/* Profil Ringkasan */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-10 bg-[#fccf54]" />
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Ringkasan Profil</h2>
        </div>
        <ProfileCard profil={pengguna.profil} user={pengguna} />
      </section>

      {/* Status Lamaran Terbaru */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-10 bg-[#fccf54]" />
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Status Lamaran Terbaru</h2>
        </div>
        <ApplicationList lamaran={pengguna.lamaran || []} />
      </section>
    </div>
  );
}
