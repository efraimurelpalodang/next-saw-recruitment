import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { SessionPayload } from "@/lib/auth";

interface ApplicantNavbarProps {
  session?: SessionPayload | null;
}

const ApplicantNavbar = ({ session }: ApplicantNavbarProps) => {
  const avatarName = session?.nama_lengkap?.split(" ").join("+") || "User";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-16">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group mr-4">
            <div className="w-8 h-8 bg-[#fccf54] rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-lg">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] leading-tight text-indigo-700">
                SumberPangan
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1 h-16">
            <Link href="/applicant/dashboard" className="px-4 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 h-full flex items-center">
              Dashboard
            </Link>
            <Link href="/applicant/lamaran" className="px-4 text-sm font-medium text-gray-500 hover:text-gray-900 h-full flex items-center">
              Lamaran Saya
            </Link>
            <Link href="/applicant/lowongan" className="px-4 text-sm font-medium text-gray-500 hover:text-gray-900 h-full flex items-center">
              Lowongan
            </Link>
            <Link href="/applicant/bantuan" className="px-4 text-sm font-medium text-gray-500 hover:text-gray-900 h-full flex items-center">
              Bantuan
            </Link>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-2 border border-gray-200 cursor-pointer">
            <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff`} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ApplicantNavbar;
