import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GraduationCap, Edit3, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import ApplicationCard from "@/components/dashboard/ApplicationCard";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Ambil data pengguna dan profil pelamar
  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: {
      profil: true,
    }
  });

  if (!pengguna) {
    redirect("/login");
  }

  // Ambil lamaran pelamar beserta relasinya
  const lamaranAktif = await prisma.lamaran.findMany({
    where: {
      id_pengguna: session.id_pengguna,
      // Status 'selesai' atau 'tutup' untuk lowongan mungkin diabaikan, tapi untuk sekarang kita ambil semua yang statusnya bukan keputusan final
    },
    include: {
      lowongan: {
        include: {
          jenis_pekerjaan: true,
        }
      }
    },
    orderBy: {
      dibuat_pada: 'desc'
    }
  });

  const profil = pengguna.profil;

  // Hitung kelengkapan profil
  let kelengkapan = 0;
  let totalField = 10;
  if (profil) {
    if (profil.nik) kelengkapan++;
    if (profil.tempat_lahir) kelengkapan++;
    if (profil.tanggal_lahir) kelengkapan++;
    if (profil.jenis_kelamin) kelengkapan++;
    if (profil.alamat) kelengkapan++;
    if (profil.pendidikan_terakhir) kelengkapan++;
    if (profil.jurusan) kelengkapan++;
    if (profil.nama_institusi) kelengkapan++;
    if (profil.berkas_ijazah) kelengkapan++;
    if (profil.berkas_cv) kelengkapan++;
  }

  const percentage = Math.round((kelengkapan / totalField) * 100);

  // Fallback nama avatar
  const avatarName = pengguna.nama_lengkap.split(' ').join('+');

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col relative">

            {/* Header / Title */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[15px] font-bold text-gray-900">Ringkasan Info Pelamar</h2>
            </div>

            {/* Profile Info & Edit Button */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={`https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff&size=128`}
                    alt={pengguna.nama_lengkap}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="max-w-[120px]">
                  <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-1.5 leading-tight truncate">
                    <span className="truncate">{pengguna.nama_lengkap}</span>
                  </h3>
                  <p className="text-[13px] text-gray-500 font-medium mt-0.5">Kandidat Pelamar</p>
                </div>
              </div>
              <Link href="/applicant/profil" className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0">
                <Edit3 size={14} />
                Detail Profil
              </Link>
            </div>

            <hr className="border-t border-dashed border-gray-200 mb-6" />

            {/* Grid Data */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                  <Mail size={14} />
                  <span className="text-[13px] font-medium">Email</span>
                </div>
                <p className="text-[14px] font-medium text-gray-800 truncate" title={pengguna.email}>{pengguna.email}</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                  <Phone size={14} />
                  <span className="text-[13px] font-medium">Telepon</span>
                </div>
                <p className="text-[14px] font-medium text-gray-800 truncate" title={pengguna.nomor_telepon || "-"}>{pengguna.nomor_telepon || "-"}</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                  <MapPin size={14} />
                  <span className="text-[13px] font-medium">Lokasi</span>
                </div>
                <p className="text-[14px] font-medium text-gray-800 truncate" title={profil?.alamat || "Belum diisi"}>{profil?.alamat || "Belum diisi"}</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                  <CreditCard size={14} />
                  <span className="text-[13px] font-medium">NIK</span>
                </div>
                <p className="text-[14px] font-medium text-gray-800 truncate" title={profil?.nik || "Belum diisi"}>{profil?.nik || "Belum diisi"}</p>
              </div>
            </div>

            <hr className="border-t border-dashed border-gray-200 mb-6" />

            {/* Progress Bar (sama persis dengan sebelumnya) */}
            <div className="w-full mb-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-900">Kelengkapan Profil</span>
                <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Applications */}
        <div className="lg:col-span-8">
          <h2 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
            Status Lamaran Aktif
          </h2>

          <div className="flex flex-col gap-4">
            {lamaranAktif.length > 0 ? (
              lamaranAktif.map((lamaran) => (
                <ApplicationCard key={lamaran.id_lamaran} lamaran={lamaran} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                Belum ada lamaran aktif saat ini.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
