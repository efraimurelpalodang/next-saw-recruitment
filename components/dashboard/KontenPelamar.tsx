import React from 'react';
import ProfilPelamarCard from './pelamar/ProfilPelamarCard';
import DataDiriCard from './pelamar/DataDiriCard';
import UploadBerkasCard from './pelamar/UploadBerkasCard';
import DaftarLowonganDilamar from './pelamar/DaftarLowonganDilamar';

export default function KontenPelamar({ pengguna }: { pengguna: any }) {
  if (!pengguna) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 items-start">
      {/* ===== Kolom Kiri ===== */}
      <div className="flex flex-col gap-6">
        <ProfilPelamarCard pengguna={pengguna} profil={pengguna.profil} />
        <DataDiriCard profil={pengguna.profil} />
        <UploadBerkasCard profil={pengguna.profil} />
      </div>

      {/* ===== Kolom Kanan ===== */}
      <div>
        <DaftarLowonganDilamar lamaran={pengguna.lamaran || []} />
      </div>
    </div>
  );
}
