import React from 'react';
import ProfileCard from './pelamar/ProfileCard';
import ApplicationList from './pelamar/ApplicationList';

export default function KontenPelamar({ pengguna }: { pengguna: any }) {
  if (!pengguna) return null;

  const firstName = pengguna.nama_lengkap?.split(' ')[0] ?? 'Pelamar';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none mb-1">
          Hi, {firstName}! 👋
        </h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] ml-0.5">
          Selamat datang kembali di panel rekrutmen Anda.
        </p>
      </div>

      {/* Profil Ringkasan */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1.5 h-7 bg-[#fccf54] rounded-full" />
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Ringkasan Profil</h2>
        </div>
        <ProfileCard profil={pengguna.profil} user={pengguna} />
      </section>

      {/* Status Lamaran Terbaru */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1.5 h-7 bg-[#fccf54] rounded-full" />
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Status Lamaran Terbaru</h2>
        </div>
        <ApplicationList lamaran={pengguna.lamaran || []} />
      </section>
    </div>
  );
}
