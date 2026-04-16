import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import KontenPelamar from "@/components/dashboard/KontenPelamar";
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

  // Pelamar: layout.tsx sudah handle wrapping, page ini hanya render konten
  if (roleAuth === "pelamar") {
    const dataPelamar = await prisma.pengguna.findUnique({
      where: { id_pengguna: session.id_pengguna },
      include: { 
        profil: true,
        lamaran: {
          include: {
            lowongan: {
              include: { jenis_pekerjaan: true }
            },
          },
          orderBy: { tanggal_lamar: 'desc' },
          take: 5, // summary saja, rekap lengkap ada di /dashboard/lamaran
        }
      },
    });
    return <KontenPelamar pengguna={dataPelamar} />;
  }

  // Management dashboards (Placeholders for rebuild)
  if (roleAuth === "admin") {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 mt-2 text-sm">Ini halaman Dashboard Admin. Konten sedang dalam proses pembangunan ulang.</p>
      </div>
    );
  }

  if (roleAuth === "hrd") {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard HRD</h1>
        <p className="text-gray-500 mt-2 text-sm">Ini halaman Dashboard. Konten sedang dalam proses pembangunan ulang.</p>
      </div>
    );
  }

  if (roleAuth === "manajer") {
    return (
      <div className="animate-in">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Manajer</h1>
        <p className="text-gray-500 mt-2 text-sm">Ini halaman Dashboard Manajer. Konten sedang dalam proses pembangunan ulang.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto mt-20 bg-red-50 border border-red-200 rounded-lg">
      <h1 className="text-xl font-bold text-red-700 mb-2">Akses Ditolak</h1>
      <p className="text-red-600">Peran Anda tidak dikenali oleh sistem ({roleAuth}).</p>
    </div>
  );
}
