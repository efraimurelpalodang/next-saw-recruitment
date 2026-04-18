'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileUser, ClipboardList, BriefcaseBusiness, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/authActions';

interface PelamarLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function PelamarLayout({ children, user }: PelamarLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'CV Saya', href: '/dashboard/cv', icon: FileUser },
    { name: 'Rekap Lamaran', href: '/dashboard/lamaran', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-plus">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-[#fccf54] rounded-xl flex items-center justify-center shadow-lg shadow-[#fccf54]/20 group-hover:scale-105 transition-transform">
                  <BriefcaseBusiness className="text-gray-900" size={22} />
                </div>
                <div>
                  <h1 className="text-lg font-black text-gray-900 leading-tight">SAW</h1>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase -mt-1">Recruitment</p>
                </div>
              </Link>

              {/* Desktop Nav Tabs */}
              <nav className="hidden md:flex items-center gap-1 ml-4">
                <Link
                  href="/#careers"
                  className="px-4 py-2 text-sm text-gray-500 hover:text-[#efc03f] transition-colors"
                >
                  Info Peluang Karir
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 text-sm rounded-lg transition-all relative ${isActive
                        ? 'text-gray-900 bg-gray-50 font-bold'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                        }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#fccf54] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <p className="text-sm font-semibold text-gray-900">{user.nama_lengkap}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">PELAMAR</p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-all group"
                  title="Logout"
                >
                  <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs (Bottom Bar Style or Scrollable) */}
        <div className="md:hidden border-t border-gray-100 flex overflow-x-auto no-scrollbar bg-white">
          <Link
            href="/#careers"
            className="flex-none px-6 py-4 text-xs font-bold text-gray-500 border-r border-gray-50"
          >
            Peluang Karir
          </Link>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isLast = index === navItems.length - 1;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-none px-6 py-4 text-xs font-bold transition-all ${isActive
                  ? 'text-gray-900 border-b-2 border-[#fccf54]'
                  : 'text-gray-400'
                  } ${isLast ? 'pr-8' : ''}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
