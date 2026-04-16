import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PelamarLayout from "@/components/dashboard/pelamar/PelamarLayout";
import StaffLayout from "@/components/dashboard/StaffLayout";

export default async function DashboardParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch user role and profile
  const pengguna = await prisma.pengguna.findUnique({
    where: { id_pengguna: session.id_pengguna },
    include: { 
      peran: true,
      profil: true 
    },
  });

  if (!pengguna || !pengguna.status_aktif) {
    redirect("/login");
  }

  const role = pengguna.peran.nama_peran.toLowerCase();

  // If Pelamar, use the Horizontal Tab Layout
  if (role === "pelamar") {
    return (
      <PelamarLayout user={pengguna}>
        {children}
      </PelamarLayout>
    );
  }
  
  // For HRD, Admin, and Manager, use the StaffLayout
  return (
    <StaffLayout user={pengguna}>
      {children}
    </StaffLayout>
  );
}
