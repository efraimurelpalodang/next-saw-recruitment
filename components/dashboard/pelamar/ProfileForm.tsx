'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/lib/validations/profile';
import { updateProfile } from '@/app/actions/profileActions';
import { uploadDocument, deleteDocument } from '@/app/actions/fileActions';
import { 
  User, MapPin, GraduationCap, Briefcase, 
  Save, Upload, Trash2, FileText, Loader2, CheckCircle2, Search
} from 'lucide-react';
import { JenisKelamin, PendidikanTerakhir } from "@prisma/client";

interface ProfileFormProps {
  initialData: any;
  isLocked?: boolean;
}

const ProfileForm = ({ initialData, isLocked }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData ? {
      ...initialData,
      tanggal_lahir: initialData.tanggal_lahir ? new Date(initialData.tanggal_lahir).toISOString().split('T')[0] : '',
    } : {
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
    setMessage(null);
    
    // Add file URLs from initialData if not changed
    const finalData = {
      ...data,
      berkas_ijazah: initialData?.berkas_ijazah || "",
      berkas_cv: initialData?.berkas_cv || "",
      berkas_sertifikat: initialData?.berkas_sertifikat || "",
    };

    const result = await updateProfile(finalData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Gagal memperbarui profil' });
    }
    
    setIsSubmitting(false);
    // Scroll to top to see message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ijazah' | 'cv' | 'sertifikat') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ATURAN VALIDASI CLIENT-SIDE
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Format file tidak diizinkan. Hanya PDF, JPG, atau PNG.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 2MB.");
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    const result = await uploadDocument(file, type);
    
    if (result.success) {
      // In a real app, you might want to update local state or revalidate
      alert(`${type.toUpperCase()} berhasil diunggah!`);
      window.location.reload(); // Quick way to see changes
    } else {
      alert(result.error);
    }
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const handleFileDelete = async (url: string, type: 'ijazah' | 'cv' | 'sertifikat') => {
    if (!confirm(`Hapus berkas ${type.toUpperCase()}?`)) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    const result = await deleteDocument(url, type);
    
    if (result.success) {
      alert(`${type.toUpperCase()} berhasil dihapus!`);
      window.location.reload();
    } else {
      alert(result.error);
    }
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#fccf54] focus:ring-2 focus:ring-[#fccf54]/20 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-400";
  const labelClasses = "block text-sm font-bold text-gray-700 mb-1.5 ml-1";
  const errorClasses = "text-xs text-red-500 mt-1 ml-1 font-medium";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <Loader2 size={20} />}
          <p className="font-bold text-sm">{message.text}</p>
        </div>
      )}

      {isLocked && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3 mb-6">
          <Loader2 className="animate-spin text-amber-500" size={20} />
          <p className="text-sm font-bold text-amber-800">
            Profil terkunci (Freeze) selama lamaran sedang aktif.
          </p>
        </div>
      )}

      {/* Identitas Diri */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Identitas Diri</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClasses}>NIK (16 Digit)</label>
            <input 
              {...register('nik')} 
              placeholder="Masukkan 16 digit NIK" 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.nik && <p className={errorClasses}>{errors.nik.message as string}</p>}
          </div>

          <div>
            <label className={labelClasses}>Tempat Lahir</label>
            <input 
              {...register('tempat_lahir')} 
              placeholder="Contoh: Jakarta" 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.tempat_lahir && <p className={errorClasses}>{errors.tempat_lahir.message as string}</p>}
          </div>

          <div>
            <label className={labelClasses}>Tanggal Lahir</label>
            <input 
              type="date"
              {...register('tanggal_lahir')} 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.tanggal_lahir && <p className={errorClasses}>{errors.tanggal_lahir.message as string}</p>}
          </div>

          <div>
            <label className={labelClasses}>Jenis Kelamin</label>
            <select 
              {...register('jenis_kelamin')} 
              className={inputClasses}
              disabled={isLocked}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value={JenisKelamin.L}>Laki-laki</option>
              <option value={JenisKelamin.P}>Perempuan</option>
            </select>
            {errors.jenis_kelamin && <p className={errorClasses}>{errors.jenis_kelamin.message as string}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>Alamat Lengkap (Domisili)</label>
            <textarea 
              {...register('alamat')} 
              rows={3}
              placeholder="Masukkan alamat lengkap Anda" 
              className={`${inputClasses} resize-none`}
              disabled={isLocked}
            />
            {errors.alamat && <p className={errorClasses}>{errors.alamat.message as string}</p>}
          </div>
        </div>
      </section>

      {/* Pendidikan */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <GraduationCap size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Riwayat Pendidikan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Jenjang Terakhir</label>
            <select 
              {...register('pendidikan_terakhir')} 
              className={inputClasses}
              disabled={isLocked}
            >
              <option value="">Pilih Jenjang</option>
              {Object.values(PendidikanTerakhir).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.pendidikan_terakhir && <p className={errorClasses}>{errors.pendidikan_terakhir.message as string}</p>}
          </div>

          <div>
            <label className={labelClasses}>Jurusan</label>
            <input 
              {...register('jurusan')} 
              placeholder="Contoh: Teknik Informatika" 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.jurusan && <p className={errorClasses}>{errors.jurusan.message as string}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>Nama Institusi / Kampus / Sekolah</label>
            <input 
              {...register('nama_institusi')} 
              placeholder="Nama lengkap sekolah atau universitas" 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.nama_institusi && <p className={errorClasses}>{errors.nama_institusi.message as string}</p>}
          </div>

          <div>
            <label className={labelClasses}>Tahun Lulus</label>
            <input 
              type="number"
              {...register('tahun_lulus', { valueAsNumber: true })} 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.tahun_lulus && <p className={errorClasses}>{errors.tahun_lulus.message as string}</p>}
          </div>
        </div>
      </section>

      {/* Pengalaman Kerja */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
            <Briefcase size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Pengalaman Kerja</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Lama Pengalaman (Tahun)</label>
            <input 
              type="number"
              {...register('pengalaman_kerja_tahun', { valueAsNumber: true })} 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.pengalaman_kerja_tahun && <p className={errorClasses}>{errors.pengalaman_kerja_tahun.message as string}</p>}
          </div>

          <div>
            <label className={labelClasses}>Bidang Utama</label>
            <input 
              {...register('pengalaman_bidang')} 
              placeholder="Contoh: Web Developer" 
              className={inputClasses}
              disabled={isLocked}
            />
            {errors.pengalaman_bidang && <p className={errorClasses}>{errors.pengalaman_bidang.message as string}</p>}
          </div>
        </div>
      </section>

      {/* Berkas / Dokumen */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
            <FileText size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Berkas Pendukung</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'ijazah', label: 'Ijazah Terakhir', required: true, accept: 'application/pdf,image/*' },
            { id: 'cv', label: 'Curriculum Vitae (CV)', required: true, accept: 'application/pdf' },
            { id: 'sertifikat', label: 'Sertifikat (Opsional)', required: false, accept: 'application/pdf,image/*' },
          ].map((doc) => {
            const url = initialData?.[`berkas_${doc.id}`];
            const isUploading = uploading[doc.id];

            return (
              <div key={doc.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{doc.label}</p>
                
                {url ? (
                  <div className="w-full">
                    <div className="w-full aspect-[4/3] bg-white rounded-xl border border-gray-200 flex items-center justify-center p-3 mb-3 shadow-sm group relative">
                      <FileText size={40} className="text-[#fccf54] opacity-50 transition-opacity group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                        <a href={url} target="_blank" className="p-2 bg-white rounded-lg text-gray-900 hover:scale-110 transition-transform">
                          <Search size={18} />
                        </a>
                        {!isLocked && (
                          <button 
                            type="button" 
                            onClick={() => handleFileDelete(url, doc.id as any)}
                            className="p-2 bg-red-500 rounded-lg text-white hover:scale-110 transition-transform"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className={`w-full aspect-[4/3] bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-3 mb-3 cursor-pointer hover:border-[#fccf54] hover:bg-white transition-all ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept={doc.accept}
                      disabled={isLocked || isUploading}
                      onChange={(e) => handleFileUpload(e, doc.id as any)}
                    />
                    {isUploading ? (
                      <Loader2 className="animate-spin text-[#fccf54]" size={24} />
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-300 mb-2" />
                        <span className="text-[10px] font-bold text-gray-400">PILIH FILE</span>
                      </>
                    )}
                  </label>
                )}
                
                <p className="text-[10px] text-gray-400 font-medium">PDF/JPG, Maks 2MB</p>
              </div>
            );
          })}
        </div>
      </section>

      {!isLocked && (
        <div className="flex justify-end gap-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-[#fccf54] text-gray-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#efc03f] transition-all shadow-xl shadow-[#fccf54]/20 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Simpan Perubahan</span>
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
