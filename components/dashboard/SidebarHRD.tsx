"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileSignature, 
  ListOrdered, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";

const menuItems = [
  { group: "MENU UTAMA", items: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Lowongan", href: "/dashboard/lowongan", icon: Briefcase },
    { name: "Pelamar", href: "/dashboard/pelamar", icon: Users },
  ]},
  { group: "SAW & KEPUTUSAN", items: [
    { name: "Penilaian", href: "/dashboard/penilaian", icon: FileSignature },
    { name: "Ranking", href: "/dashboard/ranking", icon: ListOrdered },
    { name: "Keputusan", href: "/dashboard/keputusan", icon: CheckSquare },
  ]},
  { group: "LAINNYA", items: [
    { name: "Laporan", href: "/dashboard/laporan", icon: FileText },
    { name: "Bobot Kriteria", href: "/dashboard/bobot-kriteria", icon: Settings },
  ]}
];

export default function SidebarHRD() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <div className="w-9 h-9 bg-[#3c50e0] rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
          <span className="text-white font-black text-xl">S</span>
        </div>
        <span className="font-extrabold text-[#1c2434] text-xl tracking-tight">SAW RECRUIT</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-6 space-y-8 overflow-y-auto no-scrollbar">
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] ml-2">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${
                      isActive 
                        ? "bg-gray-100 text-[#3c50e0]" 
                        : "text-[#5a6a85] hover:bg-gray-50 hover:text-[#3c50e0]"
                    }`}
                  >
                    <item.icon size={18} className={`${isActive ? "text-[#3c50e0]" : "text-[#5a6a85] group-hover:text-[#3c50e0]"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-gray-100">
        <button 
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          onClick={() => {
            window.location.href = "/api/auth/signout";
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
