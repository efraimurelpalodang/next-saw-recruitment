"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, kata_sandi: values.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Silakan masuk ke akun Anda untuk melanjutkan sesi Anda."
      imageSrc="/images/auth-login.png"
      imageAlt="Login visual professional office"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-4 text-sm font-semibold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{serverError}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 ml-4">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="nama@email.com"
            className={`w-full px-5 py-3 bg-gray-50 border rounded-full text-sm font-normal text-gray-900 placeholder:text-gray-500 transition-all focus:outline-none focus:ring-4 ${
              errors.email 
                ? "border-red-300 focus:ring-red-100 focus:bg-white" 
                : "border-gray-100 focus:border-[#fccf54] focus:ring-[#fccf54]/20 focus:bg-white hover:bg-gray-100"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium ml-4">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5 relative">
          <div className="flex items-center justify-between ml-4">
            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <button type="button" className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors mr-2">Lupa Sandi?</button>
          </div>
          <div className="relative group">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-5 pr-12 py-3 bg-gray-50 border rounded-full text-sm font-normal text-gray-900 placeholder:text-gray-500 transition-all focus:outline-none focus:ring-4 ${
                errors.password 
                  ? "border-red-300 focus:ring-red-100 focus:bg-white" 
                  : "border-gray-100 focus:border-[#fccf54] focus:ring-[#fccf54]/20 focus:bg-white hover:bg-gray-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500 font-medium ml-4">{errors.password.message}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#fccf54] hover:bg-[#efc03f] active:scale-95 text-gray-900 rounded-full shadow-lg shadow-[#fccf54]/10 transition-all font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale disabled:transform-none hover:cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} strokeWidth={2.5} />
            ) : (
              <>Masuk <ArrowRight size={18} strokeWidth={2.5} /></>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500 font-medium text-sm">
          Belum punya akun? {" "}
          <NextLink href="/register" className="text-gray-900 hover:underline underline-offset-4 decoration-[#fccf54] decoration-2 transition-all">
            Daftar Pelamar
          </NextLink>
        </p>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Efraim Urel Palodang.
      </div>
    </AuthLayout>
  );
}
