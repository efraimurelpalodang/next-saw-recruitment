import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/dashboard/pelamar/ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dataPelamar = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { 
      profil: true,
      peran: true 
    },
  });

  if (!dataPelamar || dataPelamar.peran.nama_peran.toLowerCase() !== "pelamar") {
    redirect("/dashboard");
  }

  // Check for active application to lock the profile
  const activeApplication = await prisma.lamaran.findFirst({
    where: {
      id_pengguna: session.id_pengguna,
      NOT: {
        status: 'keputusan'
      }
    }
  });

  const isLocked = !!activeApplication;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-10">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#efc03f] transition-colors mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profil Saya</h1>
          <p className="text-gray-500 mt-1 font-medium">Kelola data diri dan berkas kualifikasi Anda.</p>
        </div>

        <ProfileForm initialData={dataPelamar.profil} isLocked={isLocked} />
      </div>
    </div>
  );
}
