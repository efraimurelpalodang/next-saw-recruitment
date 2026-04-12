import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import KontenHRD from "@/components/dashboard/KontenHRD";
import KontenPelamar from "@/components/dashboard/KontenPelamar";
import KontenManajer from "@/components/dashboard/KontenManajer";
import KontenAdmin from "@/components/dashboard/KontenAdmin";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch full user data to get accurate role
  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { peran: true },
  });

  if (!pengguna || !pengguna.status_aktif) {
    redirect("/login");
  }

  const roleAuth = pengguna.peran.nama_peran.toLowerCase();

  // Pelamar dashboard remains simple as requested
  if (roleAuth === "pelamar") {
    const dataPelamar = await prisma.pengguna.findUnique({
      where: { id_pengguna: session.id_pengguna },
      include: { 
        profil: true,
        lamaran: {
          include: {
            lowongan: {
              include: {
                jenis_pekerjaan: true
              }
            },
            penilaian: true
          },
          orderBy: {
            tanggal_lamar: 'desc'
          }
        }
      },
    });
    return <KontenPelamar pengguna={dataPelamar} />;
  }

  // Management dashboards use the new Adon-inspired Layout
  if (roleAuth === "admin") {
    return (
      <DashboardLayout user={pengguna} title="System Dashboard">
        <KontenAdmin pengguna={pengguna} />
      </DashboardLayout>
    );
  }

  if (roleAuth === "hrd") {
    return (
      <DashboardLayout user={pengguna} title="Recruitment Overview">
        <KontenHRD pengguna={pengguna} />
      </DashboardLayout>
    );
  }

  if (roleAuth === "manajer") {
    return (
      <DashboardLayout user={pengguna} title="Managerial Overview">
        <KontenManajer pengguna={pengguna} />
      </DashboardLayout>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto mt-20 bg-red-50 border border-red-200 rounded-lg">
      <h1 className="text-xl font-bold text-red-700 mb-2">Akses Ditolak</h1>
      <p className="text-red-600">Peran Anda tidak dikenali oleh sistem ({roleAuth}).</p>
    </div>
  );
}
