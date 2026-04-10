import { z } from "zod";

export const profileSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  usia: z.number().min(18, "Usia minimal 18 tahun"),
  pengalamanKerja: z.number().min(0, "Pengalaman kerja tidak valid"),
  jarakTinggal: z.number().min(0, "Jarak tempat tinggal tidak valid"),
});
