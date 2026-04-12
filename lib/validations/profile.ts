import { z } from "zod";
import { JenisKelamin, PendidikanTerakhir } from "@prisma/client";

export const profileSchema = z.object({
  nik: z.string().length(16, "NIK harus 16 digit"),
  tempat_lahir: z.string().min(2, "Tempat lahir minimal 2 karakter"),
  tanggal_lahir: z.coerce.date({
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_date') return { message: 'Format tanggal tidak valid' };
      return { message: 'Tanggal lahir wajib diisi' };
    }
  }),
  jenis_kelamin: z.nativeEnum(JenisKelamin, {
    errorMap: () => ({ message: "Pilih jenis kelamin" }),
  }),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  
  pendidikan_terakhir: z.nativeEnum(PendidikanTerakhir, {
    errorMap: () => ({ message: "Pilih pendidikan terakhir" }),
  }),
  jurusan: z.string().min(2, "Jurusan minimal 2 karakter"),
  nama_institusi: z.string().min(2, "Nama institusi minimal 2 karakter"),
  tahun_lulus: z.number().int().min(1970).max(new Date().getFullYear()),
  
  pengalaman_kerja_tahun: z.number().int().min(0).default(0),
  pengalaman_bidang: z.string().optional(),
});
