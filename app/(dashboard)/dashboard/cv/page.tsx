import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/dashboard/pelamar/ProfileForm";
import Link from 'next/link';

export default async function CVSayaPage() {
  const session = await getSession();
  if (!session) return redirect("/login");

  const dataPelamar = await prisma.pengguna.findUnique({
    where: { id_pengguna: session!.id_pengguna },
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
    <div className="w-full max-w-5xl mx-auto pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-[22px] font-bold text-gray-900">Detail Profil Pelamar</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Beranda</Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-[#fccf54] font-medium">CV Saya</span>
        </div>
      </div>

      <ProfileForm user={dataPelamar} isLocked={isLocked} />
    </div>
  );
}
