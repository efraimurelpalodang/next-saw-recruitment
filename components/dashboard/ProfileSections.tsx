"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profileActions";
import { User, Edit3, GraduationCap, Briefcase, FileText, UploadCloud, File, Plus, CheckCircle2, Loader2 } from "lucide-react";

export default function ProfileSections({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [ijazahFile, setIjazahFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nama_lengkap: initialData.pengguna.nama_lengkap || "",
    nik: initialData.profil?.nik || "",
    tempat_lahir: initialData.profil?.tempat_lahir || "",
    tanggal_lahir: initialData.profil?.tanggal_lahir ? new Date(initialData.profil.tanggal_lahir).toISOString().split("T")[0] : "",
    jenis_kelamin: initialData.profil?.jenis_kelamin || "L",
    alamat: initialData.profil?.alamat || "",
    pendidikan_terakhir: initialData.profil?.pendidikan_terakhir || "",
    institusi: initialData.profil?.institusi || "",
    jurusan: initialData.profil?.jurusan || "",
    tahun_lulus: initialData.profil?.tahun_lulus || "",
    pengalaman_tahun: initialData.profil?.pengalaman_tahun || "",
    bidang_pengalaman: initialData.profil?.bidang_pengalaman || "",
  });

  const [editState, setEditState] = useState({
    dataDiri: false,
    pendidikan: false,
    pengalaman: false,
    dokumen: false,
  });

  const toggleEdit = (section: keyof typeof editState) => {
    setEditState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      
      if (ijazahFile) data.append("file_ijazah", ijazahFile);
      if (cvFile) data.append("file_cv", cvFile);

      const result = await updateProfile(data);
      if (result.success) {
        setEditState({ dataDiri: false, pendidikan: false, pengalaman: false, dokumen: false });
        // Optional: you can add a toast notification here
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* 1. Data Diri */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <User size={20} />
            <h2 className="text-lg">Data Diri</h2>
          </div>
          <button 
            onClick={() => toggleEdit("dataDiri")}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <Edit3 size={18} />
          </button>
        </div>

        {editState.dataDiri ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Nama Lengkap</label>
              <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Nomor Induk Kependudukan (NIK)</label>
              <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Tempat, Tanggal Lahir</label>
              <div className="flex gap-2">
                <input type="text" name="tempat_lahir" placeholder="Tempat" value={formData.tempat_lahir} onChange={handleInputChange} className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleInputChange} className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Jenis Kelamin</label>
              <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 bg-white">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Alamat Lengkap</label>
              <textarea name="alamat" rows={3} value={formData.alamat} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 resize-none"></textarea>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nama Lengkap</p>
              <p className="text-sm font-medium text-gray-900">{formData.nama_lengkap || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nomor Induk Kependudukan (NIK)</p>
              <p className="text-sm font-medium text-gray-900">{formData.nik || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tempat, Tanggal Lahir</p>
              <p className="text-sm font-medium text-gray-900">
                {formData.tempat_lahir || "-"}, {formData.tanggal_lahir || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Jenis Kelamin</p>
              <p className="text-sm font-medium text-gray-900">{formData.jenis_kelamin === "L" ? "Laki-laki" : formData.jenis_kelamin === "P" ? "Perempuan" : "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Alamat Lengkap</p>
              <p className="text-sm font-medium text-gray-900">{formData.alamat || "-"}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Pendidikan & Pengalaman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pendidikan */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 p-8 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <GraduationCap size={20} />
              <h2 className="text-lg">Pendidikan</h2>
            </div>
            <button 
              onClick={() => toggleEdit("pendidikan")}
              className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <Edit3 size={18} />
            </button>
          </div>

          {editState.pendidikan ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pendidikan Terakhir</label>
                <select name="pendidikan_terakhir" value={formData.pendidikan_terakhir} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 bg-white">
                  <option value="">Pilih Pendidikan</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Institusi</label>
                <input type="text" name="institusi" value={formData.institusi} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-2/3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Jurusan</label>
                  <input type="text" name="jurusan" value={formData.jurusan} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Tahun Lulus</label>
                  <input type="number" name="tahun_lulus" value={formData.tahun_lulus} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
                </div>
              </div>
              
              {/* Upload Ijazah box */}
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                 <input 
                   type="file" 
                   onChange={(e) => {
                     if (e.target.files && e.target.files[0]) {
                       setIjazahFile(e.target.files[0]);
                     }
                   }}
                   className="absolute inset-0 opacity-0 cursor-pointer" 
                   accept=".pdf,.jpg,.jpeg,.png" 
                 />
                 <UploadCloud className="text-gray-400 mb-2" size={24} />
                 <p className="text-xs text-gray-500 mb-2">Upload Ijazah Terakhir (PDF/JPG)</p>
                 {ijazahFile ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      <CheckCircle2 size={14} />
                      {ijazahFile.name}
                    </span>
                 ) : initialData.profil?.berkas_ijazah ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle2 size={14} />
                      Terunggah sebelumnya
                    </span>
                 ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-y-5">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Pendidikan Terakhir</p>
                <p className="text-sm font-medium text-gray-900">{formData.pendidikan_terakhir || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Institusi</p>
                <p className="text-sm font-medium text-gray-900">{formData.institusi || "-"}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Jurusan</p>
                  <p className="text-sm font-medium text-gray-900">{formData.jurusan || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tahun Lulus</p>
                  <p className="text-sm font-medium text-gray-900">{formData.tahun_lulus || "-"}</p>
                </div>
              </div>
              {initialData.profil?.berkas_ijazah && (
                <div className="mt-2">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Berkas Ijazah</p>
                   <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                      <CheckCircle2 size={14} />
                      Terunggah
                    </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pengalaman */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 p-8 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <Briefcase size={20} />
              <h2 className="text-lg">Pengalaman</h2>
            </div>
            <button 
              onClick={() => toggleEdit("pengalaman")}
              className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <Edit3 size={18} />
            </button>
          </div>

          {editState.pengalaman ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Total Pengalaman (Tahun)</label>
                <input type="number" name="pengalaman_tahun" value={formData.pengalaman_tahun} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Bidang Terakhir</label>
                <input type="text" name="bidang_pengalaman" value={formData.bidang_pengalaman} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-y-5">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Pengalaman (Tahun)</p>
                <p className="text-sm font-medium text-gray-900">{formData.pengalaman_tahun || "0"} Tahun</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Bidang Terakhir</p>
                <p className="text-sm font-medium text-gray-900">{formData.bidang_pengalaman || "-"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Dokumen Pendukung */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <FileText size={20} />
            <h2 className="text-lg">Dokumen Pendukung</h2>
          </div>
          <button 
            onClick={() => toggleEdit("dokumen")}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <Edit3 size={18} />
          </button>
        </div>

        {editState.dokumen ? (
          <div className="flex flex-wrap gap-4">
            {cvFile && (
              <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 min-w-[240px]">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <File className="text-blue-500" size={20} />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{cvFile.name}</p>
                    <p className="text-xs text-gray-500">{(cvFile.size / 1024 / 1024).toFixed(2)} MB (Baru)</p>
                 </div>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 min-w-[240px] hover:bg-gray-50 transition-colors cursor-pointer relative text-gray-600 hover:text-gray-900">
               <input 
                 type="file" 
                 onChange={(e) => {
                   if (e.target.files && e.target.files[0]) {
                     setCvFile(e.target.files[0]);
                   }
                 }}
                 className="absolute inset-0 opacity-0 cursor-pointer" 
                 accept=".pdf" 
               />
               <Plus size={18} />
               <span className="text-sm font-semibold">Unggah Baru</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
             {initialData.profil?.berkas_cv ? (
                <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 min-w-[240px]">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <File className="text-red-500" size={20} />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-gray-900 truncate">{initialData.profil.berkas_cv.split('/').pop()}</p>
                      <p className="text-xs text-gray-500">Tersimpan</p>
                  </div>
                </div>
             ) : (
                <p className="text-sm text-gray-500">Belum ada dokumen CV yang diunggah.</p>
             )}
          </div>
        )}
      </div>

      {/* Action Buttons (Bottom) */}
      {(editState.dataDiri || editState.pendidikan || editState.pengalaman || editState.dokumen) && (
        <div className="flex justify-end gap-3 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button 
            onClick={() => setEditState({ dataDiri: false, pendidikan: false, pengalaman: false, dokumen: false })}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      )}

    </div>
  );
}
