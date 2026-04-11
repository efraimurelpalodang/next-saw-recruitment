"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Activity, 
  Briefcase, 
  UserRoundSearch, 
  ClipboardCheck, 
  Weight, 
  FileBox, 
  UserCheck,
  Circle
} from "lucide-react";

interface SidebarProps {
  user: any;
}

const adminMenus = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Manajemen User", href: "/dashboard/users" },
  { icon: ShieldCheck, label: "Pengaturan Peran", href: "/dashboard/roles" },
  { icon: Activity, label: "Log Sistem", href: "/dashboard/logs" },
];

const hrdMenus = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Data Lowongan", href: "/dashboard/vacancies" },
  { icon: UserRoundSearch, label: "Daftar Pelamar", href: "/dashboard/applicants" },
  { icon: ClipboardCheck, label: "Penilaian SAW", href: "/dashboard/scoring" },
  { icon: Weight, label: "Master Bobot", href: "/dashboard/weights" },
];

const manajerMenus = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileBox, label: "Laporan Seleksi", href: "/dashboard/reports" },
  { icon: UserCheck, label: "Persetujuan", href: "/dashboard/approvals" },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = user.peran.nama_peran.toLowerCase();

  const getMenuData = () => {
    if (role === 'admin') return adminMenus;
    if (role === 'hrd') return hrdMenus;
    if (role === 'manajer') return manajerMenus;
    return [{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" }];
  };

  const navItems = getMenuData();

  return (
    <aside className="hidden lg:flex flex-col w-[270px] bg-white border-r border-[#f5f2f2] h-screen sticky top-0 overflow-hidden shrink-0">
      {/* Brand Logo - Modernize Style */}
      <div className="px-6 py-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-[#fccf54] flex items-center justify-center font-bold text-gray-900 border border-[#fccf54] text-xs">
              SAW
           </div>
           <span className="text-xl font-bold text-[#2a3547] leading-none">Recruitment.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-[#2a3547] uppercase tracking-widest mb-4 mt-2">
          Home
        </p>

        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-300 group ${
                    isActive 
                      ? "bg-[#fccf54] text-[#2a3547] shadow-sm font-semibold" 
                      : "text-[#5a6a85] hover:bg-[#f2f6fa] hover:text-[#fccf54]" // Modernize hover is blue, but I'll use a neutral gray hover or light yellow tint if needed. Let's keep gray for now as template.
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={`${isActive ? "text-[#2a3547]" : "text-[#5a6a85] group-hover:text-[#2a3547]"} transition-colors`} 
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Extra Section Mockup */}
        <div className="mt-8">
           <p className="px-4 text-[10px] font-bold text-[#2a3547] uppercase tracking-widest mb-4">
            Utilities
          </p>
          <ul className="space-y-1">
             <li>
                <div className="flex items-center gap-3 px-4 py-3 text-[#5a6a85] cursor-not-allowed opacity-50">
                   <Circle size={10} strokeWidth={4} />
                   <span className="text-sm">Settings</span>
                </div>
             </li>
          </ul>
        </div>
      </nav>

      {/* Profile Summary Placeholder inside Sidebar */}
      <div className="p-6">
         <div className="bg-[#f2f6fa] rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-gray-900 text-sm border border-gray-100 uppercase">
                  {user.nama_lengkap.charAt(0)}
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#2a3547] truncate">{user.nama_lengkap}</span>
                  <span className="text-[10px] font-medium text-gray-500 truncate">{user.peran.nama_peran}</span>
               </div>
            </div>
         </div>
      </div>
    </aside>
  );
}
