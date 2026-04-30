import ApplicantNavbar from "@/components/dashboard/ApplicantNavbar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <ApplicantNavbar session={session} />
      <main className="pt-24 pb-12 flex-1">
        {children}
      </main>
      <footer className="py-6 bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
          <p>&copy; 2026 Sumber Pangan Sejahtera. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">Privasi</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Ketentuan</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
