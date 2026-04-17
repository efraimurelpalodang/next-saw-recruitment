import React from "react";
import Link from "next/link";
import { getApplicantDetail } from "@/app/actions/hrd/applicants";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Download,
  AlertCircle,
  Building2,
  BookOpen,
  ClipboardList,
  Star
} from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { id as localeId } from "date-fns/locale";

export async function generateMetadata({ params }: { params: Promise<{ id_lowongan: string; id_lamaran: string }> }) {
  return { title: "Detail Pelamar | SAW Recruitment" };
}

const educationLabels: Record<string, string> = {
  SMA: "SMA/Sederajat", SMK: "SMK", D3: "D3 (Diploma)",
  S1: "S1 (Sarjana)", S2: "S2 (Magister)", S3: "S3 (Doktor)"
};

export default async function DetailPelamarPage({
  params
}: {
  params: Promise<{ id_lowongan: string; id_lamaran: string }>
}) {
  const { id_lowongan, id_lamaran } = await params;
  const result = await getApplicantDetail(id_lamaran);

  if (result.error || !result.data) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-3">
        <AlertCircle size={20} />
        {result.error}
      </div>
    );
  }

  const lamaran = result.data;
  const profil = lamaran.pengguna.profil;
  const pengguna = lamaran.pengguna;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 p-4 md:p-8">
      {/* Breadcrumb */}
      <Link
        href={`/dashboard/lowongan/${id_lowongan}/pelamar`}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#3c50e0] transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Pelamar
      </Link>

      {/* Hero Card */}
      <div className="bg-[#1c2434] rounded-[40px] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#fccf54]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#fccf54]/20 to-[#3c50e0]/20 border border-white/10 flex items-center justify-center text-4xl font-black text-white flex-shrink-0">
            {pengguna.nama_lengkap.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-start gap-4 justify-between">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">{pengguna.nama_lengkap}</h1>
                <p className="text-gray-400 font-medium mt-1">{lamaran.lowongan.jenis_pekerjaan.nama_jenis}</p>
              </div>
              {lamaran.keputusan_hrd && (
                <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border ${
                  lamaran.keputusan_hrd === 'diterima' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  lamaran.keputusan_hrd === 'ditolak' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {lamaran.keputusan_hrd}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-gray-500" />
                {pengguna.email}
              </div>
              {pengguna.nomor_telepon && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone size={14} className="text-gray-500" />
                  {pengguna.nomor_telepon}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} className="text-gray-500" />
                Melamar: {format(new Date(lamaran.tanggal_lamar), "dd MMMM yyyy", { locale: localeId })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Biodata */}
          {profil && (
            <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                <User size={18} className="text-[#3c50e0]" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Data Diri</h2>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem icon={<User size={14} />} label="Jenis Kelamin" value={profil.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                <InfoItem icon={<MapPin size={14} />} label="Tempat Lahir" value={profil.tempat_lahir} />
                <InfoItem icon={<Calendar size={14} />} label="Tanggal Lahir" value={format(new Date(profil.tanggal_lahir), "dd MMMM yyyy", { locale: localeId })} />
                <InfoItem icon={<User size={14} />} label="Usia" value={`${differenceInYears(new Date(), new Date(profil.tanggal_lahir))} Tahun`} />
                <InfoItem icon={<MapPin size={14} />} label="NIK" value={profil.nik} />
                <InfoItem icon={<MapPin size={14} />} label="Alamat" value={profil.alamat} className="sm:col-span-2" />
              </div>
            </div>
          )}

          {/* Pendidikan */}
          {profil && (
            <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                <GraduationCap size={18} className="text-[#3c50e0]" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Pendidikan</h2>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem icon={<BookOpen size={14} />} label="Jenjang Pendidikan" value={educationLabels[profil.pendidikan_terakhir] ?? profil.pendidikan_terakhir} />
                <InfoItem icon={<BookOpen size={14} />} label="Jurusan" value={profil.jurusan} />
                <InfoItem icon={<Building2 size={14} />} label="Institusi" value={profil.nama_institusi} />
                <InfoItem icon={<Calendar size={14} />} label="Tahun Lulus" value={String(profil.tahun_lulus)} />
              </div>
            </div>
          )}

          {/* Pengalaman */}
          {profil && (
            <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                <Briefcase size={18} className="text-[#3c50e0]" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Pengalaman Kerja</h2>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem icon={<Briefcase size={14} />} label="Lama Pengalaman" value={`${profil.pengalaman_kerja_tahun} Tahun`} />
                <InfoItem icon={<Briefcase size={14} />} label="Bidang Pengalaman" value={profil.pengalaman_bidang || 'Belum diisi'} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* SAW Score Card */}
          {lamaran.penilaian && (
            <div className="bg-[#1c2434] rounded-[28px] border border-white/5 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                <Star size={16} className="text-[#fccf54]" />
                <h2 className="text-xs font-black text-white uppercase tracking-wider">Skor Seleksi SAW</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-black text-[#fccf54]">
                    {(lamaran.penilaian.nilai_preferensi! * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Nilai Akhir SAW</p>
                  {lamaran.penilaian.peringkat && (
                    <div className="mt-3 inline-block px-4 py-1 bg-white/5 rounded-xl text-xs text-gray-300 font-bold">
                      Peringkat #{lamaran.penilaian.peringkat}
                    </div>
                  )}
                </div>
                <div className="space-y-3 mt-4 pt-4 border-t border-white/5">
                  {[
                    { label: "C1 Pendidikan",   val: lamaran.penilaian.nilai_c1_pendidikan },
                    { label: "C2 Pengalaman",    val: lamaran.penilaian.nilai_c2_pengalaman },
                    { label: "C3 Sertifikasi",   val: lamaran.penilaian.nilai_c3_sertifikasi },
                    { label: "C4 Tes Skill",     val: lamaran.penilaian.nilai_c4_tes_keterampilan },
                    { label: "C5 Wawancara",     val: lamaran.penilaian.nilai_c5_wawancara },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-gray-500 uppercase tracking-widest">{label}</span>
                        <span className="text-white">{val}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#fccf54]/70 rounded-full"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dokumen */}
          {profil && (
            <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
                <FileText size={16} className="text-[#3c50e0]" />
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">Dokumen</h2>
              </div>
              <div className="p-6 space-y-3">
                <a
                  href={profil.berkas_cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl text-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} />
                    <span className="text-xs font-black uppercase tracking-wider">Curriculum Vitae</span>
                  </div>
                  <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </a>
                <a
                  href={profil.berkas_ijazah}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-2xl text-amber-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap size={16} />
                    <span className="text-xs font-black uppercase tracking-wider">Ijazah</span>
                  </div>
                  <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </a>
                {profil.berkas_sertifikat && (
                  <a
                    href={profil.berkas_sertifikat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-2xl text-green-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Award size={16} />
                      <span className="text-xs font-black uppercase tracking-wider">Sertifikat</span>
                    </div>
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <Link
            href={`/dashboard/penilaian?lamaranId=${lamaran.id_lamaran}`}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#fccf54] text-gray-900 rounded-[20px] text-sm font-black shadow-lg shadow-[#fccf54]/20 hover:bg-[#fbbd24] hover:translate-y-[-2px] active:scale-95 transition-all"
          >
            <ClipboardList size={18} />
            LAKUKAN PENILAIAN
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon, label, value, className = ""
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <span className="text-gray-300">{icon}</span>
        {label}
      </div>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}
