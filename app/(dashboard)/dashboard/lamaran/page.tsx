import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StatusBadge from "@/components/dashboard/pelamar/StatusBadge";
import Link from "next/link";
import { Briefcase, ExternalLink, Calendar } from "lucide-react";

export default async function RekapLamaranPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true },
  });

  if (!pengguna || pengguna.peran.nama_peran.toLowerCase() !== "pelamar") {
    redirect("/dashboard");
  }

  const lamaranList = await prisma.lamaran.findMany({
    where: { id_pengguna: session.id_pengguna },
    include: {
      lowongan: {
        include: { jenis_pekerjaan: true },
      },
    },
    orderBy: { tanggal_lamar: "desc" },
  });

  const formatTanggal = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const hariLagi = (date: Date) => {
    const today = new Date();
    const tutup = new Date(date);
    const diff = Math.ceil((tutup.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diff < 0) return <span className="text-red-400 font-bold text-[11px]">Tutup</span>;
    if (diff === 0) return <span className="text-orange-500 font-bold text-[11px]">Hari ini!</span>;
    return <span className="text-gray-500 font-bold text-[11px]">{diff} hari lagi</span>;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
          Rekap Lamaran
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">
          Pantau status seluruh lamaran pekerjaan yang telah Anda kirimkan.
        </p>
      </div>

      {lamaranList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Briefcase size={48} className="text-gray-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase mb-3 tracking-tight">
            Anda Belum Pernah Melamar
          </h2>
          <p className="text-gray-400 font-bold text-sm max-w-sm mx-auto mb-10 leading-relaxed">
            Mulai perjalanan karir Anda dengan menjelajahi posisi yang tersedia di perusahaan kami.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#fccf54] text-gray-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#efc03f] transition-all shadow-2xl shadow-[#fccf54]/20 group"
          >
            <span>Lihat Lowongan</span>
            <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#fccf54] rounded-full" />
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                Daftar Lamaran ({lamaranList.length})
              </h2>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors group"
            >
              <span>Lihat Lowongan</span>
              <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">No</th>
                  <th className="px-4 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Nama Pekerjaan</th>
                  <th className="px-4 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Posisi / Jenis</th>
                  <th className="px-4 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tgl Lamar</th>
                  <th className="px-4 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tgl Tutup</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                </tr>
              </thead>
              <tbody>
                {lamaranList.map((lamaran, index) => (
                  <tr
                    key={lamaran.id_lamaran}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <span className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-[#fccf54]/20 transition-colors">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <p className="font-black text-gray-900 text-sm">
                        {lamaran.lowongan.jenis_pekerjaan.nama_jenis}
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                        {lamaran.lowongan.lokasi_kerja}
                      </p>
                    </td>
                    <td className="px-4 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-black uppercase tracking-wider">
                        {lamaran.lowongan.jenis_pekerjaan.kode_jenis}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="text-sm font-bold text-gray-500">
                          {formatTanggal(lamaran.tanggal_lamar)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-500">
                          {formatTanggal(lamaran.lowongan.tanggal_tutup)}
                        </span>
                        {hariLagi(lamaran.lowongan.tanggal_tutup)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={lamaran.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-gray-50">
            {lamaranList.map((lamaran, index) => (
              <div key={lamaran.id_lamaran} className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-gray-400">#{String(index + 1).padStart(2, "0")}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-black uppercase">
                        {lamaran.lowongan.jenis_pekerjaan.kode_jenis}
                      </span>
                    </div>
                    <p className="font-black text-gray-900">
                      {lamaran.lowongan.jenis_pekerjaan.nama_jenis}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">{lamaran.lowongan.lokasi_kerja}</p>
                  </div>
                  <StatusBadge status={lamaran.status} />
                </div>
                <div className="flex items-center gap-6 pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Tgl Lamar</p>
                    <p className="text-xs font-bold text-gray-600">{formatTanggal(lamaran.tanggal_lamar)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Tgl Tutup</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-gray-600">{formatTanggal(lamaran.lowongan.tanggal_tutup)}</p>
                      {hariLagi(lamaran.lowongan.tanggal_tutup)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
