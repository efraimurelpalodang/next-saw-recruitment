'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/lib/validations/profile';
import { updateProfile } from '@/app/actions/profileActions';
import { uploadDocument, deleteDocument } from '@/app/actions/fileActions';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { 
  User, Loader2, Save, Edit2, Mail, FileText, Search, Trash2, Upload, CheckCircle2
} from 'lucide-react';
import { JenisKelamin, PendidikanTerakhir } from "@prisma/client";

// Tambahkan nama_lengkap ke schema khusus untuk form ini agar tidak difilter oleh resolver Zod bawaan
const extendedProfileSchema = profileSchema.extend({
  nama_lengkap: z.string().min(2, "Nama tidak boleh kosong"),
});

interface ProfileFormProps {
  user: any;
  isLocked?: boolean;
}

const ProfileForm = ({ user, isLocked }: ProfileFormProps) => {
  const router = useRouter();
  const initialData = user?.profil;
  
  const [editState, setEditState] = useState({
    profile: false,
    personal: false,
    qual: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const showToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(extendedProfileSchema),
    defaultValues: initialData ? {
      ...initialData,
      tanggal_lahir: initialData.tanggal_lahir ? new Date(initialData.tanggal_lahir).toISOString().split('T')[0] : '',
      nama_lengkap: user?.nama_lengkap || '',
    } : {
      nama_lengkap: user?.nama_lengkap || '',
      nik: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: undefined,
      alamat: '',
      pendidikan_terakhir: undefined,
      jurusan: '',
      nama_institusi: '',
      tahun_lulus: new Date().getFullYear(),
      pengalaman_kerja_tahun: 0,
      pengalaman_bidang: '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    const finalData = {
      ...data,
      berkas_ijazah: initialData?.berkas_ijazah || "",
      berkas_cv: initialData?.berkas_cv || "",
      berkas_sertifikat: initialData?.berkas_sertifikat || "",
    };

    const result = await updateProfile(finalData);
    
    if (result.success) {
      showToast("Data profil Anda berhasil disimpan.");
      // Tutup semua form edit
      setEditState({ profile: false, personal: false, qual: false });
      // Lakukan refresh data secara mulus tanpa memuat ulang seluruh halaman
      router.refresh();
    } else {
      alert(result.error || "Gagal menyimpan data.");
    }
    
    setIsSubmitting(false);
  };

  const onInvalid = (formErrors: any) => {
    alert("Gagal menyimpan. Terdapat data wajib pada formulir yang belum lengkapi.");
    // Buka section yang berisi error 
    setEditState(prev => {
      const next = { ...prev };
      if (formErrors.nik || formErrors.tempat_lahir || formErrors.tanggal_lahir || formErrors.jenis_kelamin || formErrors.alamat) next.personal = true;
      if (formErrors.pendidikan_terakhir || formErrors.nama_institusi || formErrors.jurusan || formErrors.tahun_lulus || formErrors.pengalaman_bidang || formErrors.pengalaman_kerja_tahun) next.qual = true;
      if (formErrors.nama_lengkap) next.profile = true;
      return next;
    });
  };

  const cancelEdit = (section: keyof typeof editState) => {
    reset(); // Kembalikan ke original
    setEditState(prev => ({ ...prev, [section]: false }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ijazah' | 'cv' | 'sertifikat') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 2MB.");
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    const result = await uploadDocument(file, type);
    if (result.success) {
      showToast(`${type.toUpperCase()} berhasil diunggah.`);
      router.refresh();
    } else alert(result.error || "Gagal mengunggah berkas.");
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const handleFileDelete = async (url: string, type: 'ijazah' | 'cv' | 'sertifikat') => {
    if (!confirm(`Apakah Anda yakin ingin menghapus berkas ${type.toUpperCase()} ini?`)) return;
    setUploading(prev => ({ ...prev, [type]: true }));
    const result = await deleteDocument(url, type);
    if (result.success) {
       router.refresh();
       showToast(`${type.toUpperCase()} berhasil dihapus.`);
    } else alert(result.error);
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const inputClasses = "w-full rounded-md border border-[#e2e8f0] bg-transparent py-2.5 px-4 text-sm outline-none transition focus:border-black disabled:bg-gray-50 disabled:text-gray-500";
  const labelClasses = "block text-xs font-semibold text-gray-500 mb-1.5";
  const valueClasses = "text-sm text-gray-900 border-b border-transparent py-2.5";
  const errorClasses = "text-[10px] text-red-500 mt-1 font-semibold block";

  const initials = user?.nama_lengkap?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') || 'U';

  // HELPER FUNCTION BUKAN COMPONENT (Mencegah React Unmount penyebab scroll lompat)
  const renderCardContainer = (title: string, editKey: keyof typeof editState, children: React.ReactNode) => {
    const isEdit = editState[editKey];

    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 md:p-8 shadow-xs transition-all duration-300">
        <div className="flex items-center justify-between mb-8 border-b border-[#e2e8f0] pb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {!isLocked && (
            isEdit ? (
               <div className="flex items-center gap-2">
                 <button 
                  type="button" 
                  onClick={() => cancelEdit(editKey)} 
                  className="px-4 py-1.5 text-xs border border-[#e2e8f0] text-gray-600 rounded-full text-xs hover:bg-gray-50 transition-colors hidden sm:block hover:cursor-pointer"
                  disabled={isSubmitting}
                 >
                   Batal
                 </button>
                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-1.5 bg-[#fccf54] text-gray-900 rounded-full text-xs hover:bg-[#efc03f] transition-colors hover:cursor-pointer"
                 >
                   {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Simpan
                 </button>
               </div>
            ) : (
                <button 
                  type="button" 
                  onClick={() => setEditState(prev => ({ ...prev, [editKey]: true }))}
                  className="flex items-center gap-1.5 px-4 py-1.5 border border-[#e2e8f0] text-gray-600 rounded-full text-xs hover:bg-gray-50 transition-colors hover:cursor-pointer"
                >
                  <Edit2 size={12} /> Ubah
                </button>
            )
          )}
        </div>
        <div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
           <div className="bg-[#10b981] text-white rounded-full w-6 h-6 flex items-center justify-center">
             <CheckCircle2 size={16} />
           </div>
           <p className="font-bold text-sm tracking-wide">{toast.msg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6 max-w-5xl mx-auto pb-12">

        {isLocked && (
          <div className="bg-[#f59e0b]/10 p-4 rounded-xl flex items-start gap-3">
            <Loader2 className="animate-spin text-[#f59e0b] flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-[#f59e0b] font-medium">
              Perubahan profil dinonaktifkan sementara karena terdapat lamaran Anda yang sedang diproses.
            </p>
          </div>
        )}

        {/* CARD 1: PROFILE HEADER (Identity) */}
        {renderCardContainer("Profil", "profile", (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="h-24 w-24 flex-shrink-0 rounded-full bg-gray-50 border-[1.5px] border-gray-100 flex items-center justify-center">
              <span className="text-3xl font-black text-gray-400">{initials}</span>
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <label className={labelClasses}>Nama Lengkap</label>
              {editState.profile ? (
                  <>
                    <input {...register('nama_lengkap')} className={`${inputClasses} max-w-sm`} placeholder="Nama Lengkap" disabled={isLocked} />
                    {errors.nama_lengkap && <span className={errorClasses}>{errors.nama_lengkap.message as string}</span>}
                  </>
              ) : (
                  <div className={`${valueClasses} justify-center sm:justify-start text-xl py-0 mb-2 font-bold`}>{user?.nama_lengkap}</div>
              )}
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User size={14} className="text-gray-400" /> Pelamar 
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Mail size={14} className="text-gray-400" /> {user?.email}
                  </span>
              </div>
            </div>
          </div>
        ))}

        {/* CARD 2: PERSONAL INFORMATION */}
        {renderCardContainer("Informasi Personal", "personal", (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <label className={labelClasses}>No. KTP / NIK</label>
                {editState.personal ? (
                  <>
                    <input {...register('nik')} className={inputClasses} placeholder="16 Digit" />
                    {errors.nik && <span className={errorClasses}>{errors.nik.message as string}</span>}
                  </>
                ) : <div className={valueClasses}>{initialData?.nik || '-'}</div>}
              </div>
              
              <div>
                <label className={labelClasses}>Tempat Lahir</label>
                {editState.personal ? (
                  <>
                    <input {...register('tempat_lahir')} className={inputClasses} placeholder="Kota lahir" />
                    {errors.tempat_lahir && <span className={errorClasses}>{errors.tempat_lahir.message as string}</span>}
                  </>
                ) : <div className={valueClasses}>{initialData?.tempat_lahir || '-'}</div>}
              </div>

              <div>
                <label className={labelClasses}>Tanggal Lahir</label>
                {editState.personal ? (
                  <>
                    <input type="date" {...register('tanggal_lahir')} className={inputClasses} />
                    {errors.tanggal_lahir && <span className={errorClasses}>{errors.tanggal_lahir.message as string}</span>}
                  </>
                ) : (
                  <div className={valueClasses}>
                    {initialData?.tanggal_lahir ? new Date(initialData.tanggal_lahir).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClasses}>Jenis Kelamin</label>
                {editState.personal ? (
                  <>
                    <select {...register('jenis_kelamin')} className={inputClasses}>
                      <option value="">Pilih</option>
                      <option value={JenisKelamin.L}>Laki-laki</option>
                      <option value={JenisKelamin.P}>Perempuan</option>
                    </select>
                    {errors.jenis_kelamin && <span className={errorClasses}>{errors.jenis_kelamin.message as string}</span>}
                  </>
                ) : (
                  <div className={valueClasses}>{initialData?.jenis_kelamin === 'L' ? 'Laki-laki' : (initialData?.jenis_kelamin === 'P' ? 'Perempuan' : '-')}</div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClasses}>Alamat Lengkap</label>
              {editState.personal ? (
                <>
                  <textarea {...register('alamat')} rows={2} className={`${inputClasses} resize-none`} placeholder="Alamat domisili lengkap" />
                  {errors.alamat && <span className={errorClasses}>{errors.alamat.message as string}</span>}
                </>
              ) : <div className={valueClasses}>{initialData?.alamat || '-'}</div>}
            </div>
          </>
        ))}

        {/* CARD 3: QUALIFICATION & EXPERIENCE */}
        {renderCardContainer("Kualifikasi & Pengalaman", "qual", (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <label className={labelClasses}>Jenjang Pendidikan Terakhir</label>
                {editState.qual ? (
                  <>
                    <select {...register('pendidikan_terakhir')} className={inputClasses}>
                      <option value="">Pilih Jenjang</option>
                      {Object.values(PendidikanTerakhir).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.pendidikan_terakhir && <span className={errorClasses}>{errors.pendidikan_terakhir.message as string}</span>}
                  </>
                ) : <div className={valueClasses}>{initialData?.pendidikan_terakhir || '-'}</div>}
              </div>

              <div>
                <label className={labelClasses}>Nama Institusi / Universitas</label>
                {editState.qual ? (
                  <>
                    <input {...register('nama_institusi')} className={inputClasses} placeholder="Universitas / Sekolah" />
                    {errors.nama_institusi && <span className={errorClasses}>{errors.nama_institusi.message as string}</span>}
                  </>
                ) : <div className={valueClasses}>{initialData?.nama_institusi || '-'}</div>}
              </div>

              <div>
                <label className={labelClasses}>Jurusan / Program Studi</label>
                {editState.qual ? (
                  <>
                    <input {...register('jurusan')} className={inputClasses} placeholder="Contoh: Sistem Informasi" />
                    {errors.jurusan && <span className={errorClasses}>{errors.jurusan.message as string}</span>}
                  </>
                ) : <div className={valueClasses}>{initialData?.jurusan || '-'}</div>}
              </div>

              <div>
                <label className={labelClasses}>Tahun Lulus</label>
                {editState.qual ? (
                  <>
                    <input type="number" {...register('tahun_lulus', { valueAsNumber: true })} className={inputClasses} />
                    {errors.tahun_lulus && <span className={errorClasses}>{errors.tahun_lulus.message as string}</span>}
                  </>
                ) : <div className={valueClasses}>{initialData?.tahun_lulus || '-'}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-6">
              <div>
                  <label className={labelClasses}>Bidang Keahlian Utama</label>
                  {editState.qual ? (
                    <>
                      <input {...register('pengalaman_bidang')} className={inputClasses} placeholder="Contoh: Administrasi / Web Developer" />
                      {errors.pengalaman_bidang && <span className={errorClasses}>{errors.pengalaman_bidang.message as string}</span>}
                    </>
                  ) : <div className={valueClasses}>{initialData?.pengalaman_bidang || '-'}</div>}
              </div>

              <div>
                  <label className={labelClasses}>Lama Pengalaman</label>
                  {editState.qual ? (
                    <div className="flex items-center gap-3">
                      <input type="number" {...register('pengalaman_kerja_tahun', { valueAsNumber: true })} className={`${inputClasses} w-32`} />
                      <span className="text-sm font-semibold text-gray-500">Tahun</span>
                    </div>
                  ) : <div className={valueClasses}>{initialData?.pengalaman_kerja_tahun ? `${initialData.pengalaman_kerja_tahun} Tahun` : '-'}</div>}
              </div>
            </div>
          </>
        ))}

        {/* CARD 4: DOCUMENTS */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm">
          <div className="mb-6 border-b border-[#e2e8f0] pb-4">
            <h3 className="text-lg font-bold text-gray-900">Berkas Pendukung</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { id: 'ijazah', label: 'Ijazah Terakhir', accept: 'application/pdf,image/*' },
              { id: 'cv', label: 'Curriculum Vitae', accept: 'application/pdf' },
              { id: 'sertifikat', label: 'Sertifikat (Opsional)', accept: 'application/pdf,image/*' },
            ].map((doc) => {
              const url = initialData?.[`berkas_${doc.id}`];
              const isUploading = uploading[doc.id];

              return (
                <div key={doc.id} className="border border-[#e2e8f0] rounded-xl p-5 bg-gray-50 flex flex-col h-full hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-[#fccf54]" />
                    <span className="text-sm text-gray-900 font-medium">{doc.label}</span>
                  </div>
                  
                  {url ? (
                     <div className="mt-auto flex items-center gap-2">
                       <a href={url} target="_blank" className="flex-1 flex justify-center items-center gap-1.5 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-xs font-semibold hover:border-black transition-colors">
                         <Search size={14} /> Lihat Berkas
                       </a>
                       {!isLocked && (
                         <button type="button" onClick={() => handleFileDelete(url, doc.id as any)} className="p-2.5 border border-[#dc3545]/20 bg-[#dc3545]/10 text-[#dc3545] rounded-lg hover:bg-[#dc3545] hover:text-white transition-colors">
                           <Trash2 size={16} />
                         </button>
                       )}
                     </div>
                  ) : (
                    <label className={`mt-auto w-full py-4 border-2 border-dashed border-[#e2e8f0] rounded-lg flex flex-col justify-center items-center gap-2 text-xs font-semibold text-[#64748b] bg-white hover:border-black hover:text-black transition-colors cursor-pointer ${isLocked || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                       {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                       Unggah File
                       <input type="file" className="sr-only" accept={doc.accept} disabled={isLocked || isUploading} onChange={(e) => handleFileUpload(e, doc.id as any)} />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
