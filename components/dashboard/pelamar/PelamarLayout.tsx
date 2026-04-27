'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BriefcaseBusiness, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/authActions';

interface PelamarLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function PelamarLayout({ children, user }: PelamarLayoutProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    // set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const initials = user?.nama_lengkap
    ?.split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('') || 'U';

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col font-plus">
      {/* Spacer agar konten tidak tertutup header */}
      <div className="h-24" />

      {/* Top Navigation Bar — always centered pill */}
      <header
        className="fixed top-0 left-0 right-0 z-50  flex justify-center pt-3 px-4 sm:px-6 transition-all duration-300 ease-out"
      >
        <div
          className={`w-full max-w-270 rounded-2xl px-5 transition-all duration-300 ease-out ${
            scrolled
              ? 'border border-white/60 bg-white/90 backdrop-blur-xl'
              : 'shadow-xs border border-white/80 bg-white/70 backdrop-blur-md'
          }`}
        >
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-[#fccf54] rounded-xl flex items-center justify-center shadow-md shadow-[#fccf54]/30 group-hover:scale-105 transition-transform">
                  <BriefcaseBusiness className="text-gray-900" size={18} />
                </div>
                <div>
                  <h1 className="text-base font-black text-gray-900 leading-tight">SAW</h1>
                  <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase -mt-0.5">Recruitment</p>
                </div>
              </Link>

              {/* Desktop Nav Tabs */}
              <nav className="hidden md:flex items-center gap-0.5">
                <Link
                  href="/#careers"
                  className="px-3.5 py-2 text-sm text-gray-500 hover:text-gray-800 rounded-lg hover:bg-black/5 transition-all"
                >
                  Peluang Karir
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3.5 py-2 text-sm rounded-lg transition-all font-medium relative ${
                        isActive
                          ? 'text-gray-900 bg-black/5 font-semibold'
                          : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#fccf54] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5">
                {/* Avatar initials */}
                <div className="w-8 h-8 rounded-full bg-[#fccf54]/20 border border-[#fccf54]/40 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#b8870c]">{initials}</span>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user.nama_lengkap}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Pelamar</p>
                </div>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-9 h-9 bg-gray-100/70 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-all group"
                  title="Logout"
                >
                  <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs — aligned with pill */}
        <div className="absolute top-full left-4 right-4 sm:left-6 sm:right-6 md:hidden border-t border-gray-100/60 flex overflow-x-auto no-scrollbar bg-white/90 backdrop-blur-md rounded-b-2xl shadow-md shadow-black/5">
          <Link
            href="/#careers"
            className="flex-none px-5 py-3.5 text-xs font-semibold text-gray-500 border-r border-gray-100"
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
                className={`flex-none px-5 py-3.5 text-xs font-semibold transition-all ${
                  isActive ? 'text-gray-900 border-b-2 border-[#fccf54]' : 'text-gray-400'
                } ${isLast ? 'pr-8' : ''}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-10 py-8 md:py-4">
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
