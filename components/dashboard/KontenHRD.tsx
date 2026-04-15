import React from "react";
import { Briefcase, Users, Search, ClipboardCheck, ArrowUpRight, Plus } from "lucide-react";
import StatCard from "./StatCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface KontenHRDProps {
  pengguna: any;
}

export default async function KontenHRD({ pengguna }: KontenHRDProps) {
  // Fetch real statistics
  const totalLowonganAkitf = await prisma.lowongan.count({ where: { status: "aktif" } });
  
  // Count pelamar (semua lamaran)
  const totalPelamar = await prisma.lamaran.count();
  
  // Count review tahap 1 (pending)
  const pelamarPending = await prisma.lamaran.count({ where: { status: "pending" } });
  
  // Count hired
  const hired = await prisma.lamaran.count({ 
    where: { 
       keputusan_hrd: "diterima" 
    } 
  });

  // Ambil lowongan dengan pelamar terbarunya
  const lowonganAktif = await prisma.lowongan.findMany({
    where: { status: "aktif" },
    include: {
      jenis_pekerjaan: true,
      lamaran: {
        include: {
          pengguna: { include: { profil: true } },
          penilaian: true
        },
        orderBy: { tanggal_lamar: 'desc' },
        take: 5
      }
    },
    take: 4 // Batasi tampilin 4 list lowongan di dashboard
  });

  return (
   <div className="animate-in fade-in duration-500 space-y-6">
    {/* Stats Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
     <StatCard label="Lowongan Aktif" value={totalLowonganAkitf} icon={Briefcase} color="primary" trendValue="" trendLabel="Hingga saat ini" trendColor="success" viewText="Kelola" viewLink="/dashboard/vacancies" />
     <StatCard label="Total Pelamar" value={totalPelamar} icon={Users} color="danger" trendValue="" trendLabel="Seluruh lowongan" trendColor="success" viewText="Lihat" viewLink="/dashboard/applicants" />
     <StatCard label="Review Tahap 1" value={pelamarPending} icon={Search} color="warning" trendValue="" trendLabel="Menunggu Proses" trendColor="warning" viewText="Proses" viewLink="/dashboard/scoring" />
     <StatCard label="Hired" value={hired} icon={ClipboardCheck} color="info" trendValue="" trendLabel="Total Diterima" trendColor="success" viewText="Riwayat" viewLink="/dashboard/applicants" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     {/* Daftar Lamaran List View */}
     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {lowonganAktif.map((lws) => (
        <div key={lws.id_lowongan} className="bg-white rounded-[7px] border border-[#f5f2f2] shadow-xs">
         <div className="p-5 flex items-center justify-between border-b border-[#f5f2f2]">
          <h3 className="font-bold text-[#2a3547] text-[15px] truncate max-w-[150px]">{lws.jenis_pekerjaan.nama_jenis}</h3>
          <Link href={`/dashboard/scoring?vacancy=${lws.id_lowongan}`} className="text-[12px] font-bold text-[#fa896b] hover:underline flex items-center gap-1">
           Lihat Semua
          </Link>
         </div>
         <div className="p-0 flex flex-col">
          {lws.lamaran.length === 0 ? (
             <div className="px-5 py-8 text-center text-xs text-gray-400">Belum ada pelamar.</div>
          ) : (
            lws.lamaran.map((lam, i) => (
              <div key={lam.id_lamaran} className="px-5 py-4 flex items-center justify-between border-b border-[#f5f2f2] last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-[8px] bg-[#f2f6fa] flex items-center justify-center font-bold text-[15px] text-[#5a6a85] shrink-0">
                  {lam.pengguna.nama_lengkap.charAt(0).toUpperCase()}
                  </div>
                  <div>
                  <h4 className="text-[14px] font-semibold text-[#2a3547] leading-tight mb-1 truncate max-w-[120px]">{lam.pengguna.nama_lengkap}</h4>
                  <p className="text-[12px] text-[#5a6a85] font-medium truncate max-w-[120px]">{lam.pengguna.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  {/* For rendering badge we can use static colors based on score status, for now static teal */}
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-[4px] bg-[#e8f7ff] text-[#0085db]`}>
                     {lam.penilaian?.nilai_preferensi ? lam.penilaian.nilai_preferensi.toFixed(2) : "Menunggu"}
                  </span>
                </div>
              </div>
            ))
          )}
         </div>
        </div>
      ))}

      {lowonganAktif.length === 0 && (
         <div className="col-span-2 text-center py-10 bg-white rounded-[7px] border border-[#f5f2f2]">
            <p className="text-gray-400 text-sm">Belum ada lowongan aktif.</p>
         </div>
      )}
     </div>

     {/* Quick Action Widget */}
     <div className="space-y-6">
      <div className="bg-white rounded-[7px] border border-[#f5f2f2] shadow-xs p-6 text-center">
       <div className="w-12 h-12 bg-[#fef7df] rounded-full flex items-center justify-center text-[#fccf54] mx-auto mb-4">
        <Plus size={24} />
       </div>
       <h3 className="font-bold text-[#2a3547] mb-2 uppercase tracking-tight">Buat Lowongan</h3>
       <p className="text-[#5a6a85] text-xs mb-6">Tambah kebutuhan talent baru sesuai departemen.</p>
       <Link href="/dashboard/vacancies/create" className="block w-full py-2 bg-[#fccf54] text-[#2a3547] rounded-[7px] text-xs font-bold shadow-sm hover:opacity-90 hover:cursor-pointer transition-all">Mulai Sekarang</Link>
      </div>

      <div className="bg-[#2a3547] rounded-[7px] p-6 text-white text-center flex flex-col items-center">
       <ClipboardCheck size={40} className="text-[#fccf54] mb-4" />
       <h3 className="font-bold mb-1">Cek Ranking SAW</h3>
       <p className="text-[11px] text-gray-400 mb-6">Lihat urutan pelamar berbasis kriteria cerdas.</p>
       <Link href="/dashboard/scoring" className="block w-full py-2 bg-transparent border border-[#fccf54] text-[#fccf54] rounded-[7px] text-xs font-bold hover:bg-[#fccf54] hover:text-[#2a3547] transition-all">Review Ranking</Link>
      </div>
     </div>
    </div>
   </div>
  );
}
