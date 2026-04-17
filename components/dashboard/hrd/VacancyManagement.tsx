"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import VacancyTable from "./VacancyTable";
import VacancyForm from "./VacancyForm";
import { upsertLowongan, toggleLowonganStatus, deleteLowongan } from "@/app/actions/hrd/lowongan";

interface Vacancy {
  id_lowongan: string;
  deskripsi: string;
  persyaratan: string;
  lokasi_kerja: string;
  tanggal_buka: Date;
  tanggal_tutup: Date;
  status: "aktif" | "tutup" | "selesai";
  status_aktif: boolean;
  id_jenis_pekerjaan: string;
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

interface JenisPekerjaan {
  id_jenis_pekerjaan: string;
  nama_jenis: string;
}

interface VacancyManagementProps {
  initialVacancies: Vacancy[];
  jenisPekerjaan: JenisPekerjaan[];
}

export default function VacancyManagement({ initialVacancies, jenisPekerjaan }: VacancyManagementProps) {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync state dengan server props saat terjadi router.refresh()
  useEffect(() => {
    setVacancies(initialVacancies);
  }, [initialVacancies]);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVacancies = vacancies.filter(v => 
    v.jenis_pekerjaan.nama_jenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.lokasi_kerja.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingVacancy(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setMessage(null);
    const result = await upsertLowongan(data);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: editingVacancy ? "Lowongan berhasil diperbarui!" : "Lowongan baru berhasil dipublikasikan!" });
      setIsFormOpen(false);
      // Data will be updated by server action and revalidatePath logic
      router.refresh(); 
    } else {
      setMessage({ type: 'error', text: result.error || "Terjadi kesalahan" });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (!confirm(`Apakah Anda yakin ingin ${currentStatus === 'aktif' ? 'menutup' : 'membuka kembali'} lowongan ini?`)) return;

    setLoading(true);
    const result = await toggleLowonganStatus(id, currentStatus);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: "Status lowongan berhasil diubah!" });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error || "Gagal mengubah status" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak dapat dibatalkan.")) return;

    setLoading(true);
    const result = await deleteLowongan(id);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: "Lowongan berhasil dihapus!" });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error || "Gagal menghapus lowongan" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari lowongan atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#fccf54]/20 focus:border-[#fccf54] outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-[#fccf54] text-gray-900 rounded-2xl text-sm font-black shadow-lg shadow-[#fccf54]/20 hover:bg-[#fbbd24] hover:translate-y-[-2px] active:scale-95 transition-all"
          >
            <Plus size={18} />
            TAMBAH LOWONGAN
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in ${
          message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      {/* Table Section */}
      <VacancyTable 
        data={filteredVacancies} 
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <VacancyForm 
          initialData={editingVacancy}
          jenisPekerjaan={jenisPekerjaan}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          loading={loading}
          canEditJobType={!editingVacancy || editingVacancy._count.lamaran === 0}
        />
      )}
    </div>
  );
}
