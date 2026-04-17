"use client";

import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Power, 
  ExternalLink,
  Users
} from "lucide-react";
import { format, differenceInDays, isAfter } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Vacancy {
  id_lowongan: string;
  deskripsi: string;
  persyaratan: string;
  lokasi_kerja: string;
  tanggal_buka: Date;
  tanggal_tutup: Date;
  status: "aktif" | "tutup" | "selesai";
  status_aktif: boolean;
  jenis_pekerjaan: {
    nama_jenis: string;
  };
  pengguna: {
    nama_lengkap: string;
  };
  _count: {
    lamaran: number;
  };
}

interface VacancyTableProps {
  data: Vacancy[];
  onEdit: (vacancy: Vacancy) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

export default function VacancyTable({ data, onEdit, onToggleStatus, onDelete }: VacancyTableProps) {
  
  const getDeadlineBadge = (v: Vacancy) => {
    const today = new Date();
    const isClosed = v.status === "tutup";
    const isPast = isAfter(today, new Date(v.tanggal_tutup));

    if (isClosed) {
      return (
        <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
          Ditutup
        </span>
      );
    }

    if (isPast) {
      return (
        <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider">
          Berakhir
        </span>
      );
    }

    const diff = differenceInDays(new Date(v.tanggal_tutup), today);
    return (
      <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">
        Sisa {diff} Hari
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Informasi Lowongan</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Lokasi & HRD</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Periode</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                  Belum ada data lowongan.
                </td>
              </tr>
            ) : (
              data.map((v) => (
                <tr key={v.id_lowongan} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900 group-hover:text-[#3c50e0] transition-colors">
                          {v.jenis_pekerjaan.nama_jenis}
                        </span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500">
                          <ExternalLink size={8} />
                          {v._count.lamaran} Pelamar
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1 max-w-[200px]">
                        {v.deskripsi}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin size={12} className="text-gray-400" />
                        <span>{v.lokasi_kerja}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 italic">
                        <span>Oleh: {v.pengguna.nama_lengkap}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs">
                    <div className="flex flex-col gap-1.5 text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#fccf54]" />
                        <span>{format(new Date(v.tanggal_buka), "dd MMM yyyy", { locale: localeId })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-red-400" />
                        <span>{format(new Date(v.tanggal_tutup), "dd MMM yyyy", { locale: localeId })}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getDeadlineBadge(v)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-1 transition-all">
                      <Link
                        href={`/dashboard/lowongan/${v.id_lowongan}/pelamar`}
                        className="p-2 text-[#3c50e0] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Pelamar"
                      >
                        <Users size={16} />
                      </Link>
                      <button 
                        onClick={() => onToggleStatus(v.id_lowongan, v.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          v.status === 'aktif' 
                            ? 'text-amber-500 hover:bg-amber-50' 
                            : 'text-green-500 hover:bg-green-50'
                        }`}
                        title={v.status === 'aktif' ? 'Tutup Lowongan' : 'Buka Lowongan'}
                      >
                        <Power size={16} />
                      </button>
                      <button 
                        onClick={() => v.status !== 'tutup' && onEdit(v)}
                        disabled={v.status === 'tutup'}
                        className={`p-2 rounded-lg transition-colors ${
                          v.status === 'tutup' 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-blue-500 hover:bg-blue-50'
                        }`}
                        title={v.status === 'tutup' ? 'Buka lowongan terlebih dahulu untuk mengedit' : 'Edit Lowongan'}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(v.id_lowongan)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Lowongan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
