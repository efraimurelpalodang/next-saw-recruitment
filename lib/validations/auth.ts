import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Kata sandi tidak boleh kurang dari 6 karakter" }),
});

export const registerSchema = z.object({
  nama_lengkap: z
    .string()
    .min(3, { message: "Nama lengkap minimal 3 karakter" })
    .max(50, { message: "Nama lengkap maksimal 50 karakter" }),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Kata sandi minimal 6 karakter" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
