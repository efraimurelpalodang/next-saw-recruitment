"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { SessionPayload } from "@/lib/auth";

interface NavbarProps {
  session?: SessionPayload | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Layanan", href: "#services" },
    { name: "Produk", href: "#products" },
    { name: "Karir", href: "#careers" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#fccf54] rounded-xl flex items-center justify-center shadow-lg shadow-[#fccf54]/20 group-hover:rotate-6 transition-transform">
            <span className="text-gray-900 font-bold text-xl">S</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-tight ${isScrolled ? "text-gray-900" : "text-white"}`}>
              SUMBER PANGAN
            </span>
            <span className={`text-[10px] font-medium tracking-[0.2em] uppercase leading-none ${isScrolled ? "text-[#efc03f]" : "text-[#fccf54]"}`}>
              SEJAHTERA
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-[#fccf54] ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border transition-all ${
                  isScrolled 
                    ? "border-gray-200 hover:bg-gray-50 text-gray-700" 
                    : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#fccf54] flex items-center justify-center text-gray-900 text-xs font-bold ring-2 ring-white/50">
                  {session.nama_lengkap?.charAt(0).toUpperCase() || <User size={16} />}
                </div>
                <span className="text-sm font-semibold max-w-[120px] truncate">{session.nama_lengkap}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-bottom border-gray-50 mb-1">
                    <p className="text-xs text-gray-400 font-medium">Halaman Saya</p>
                  </div>
                  <Link 
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#efc03f] transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard Saya</span>
                  </Link>
                  <hr className="my-1 border-gray-50" />
                  <button 
                    onClick={async () => {
                      const response = await fetch("/api/auth/logout", { method: "POST" });
                      if (response.ok) window.location.reload();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                isScrolled
                  ? "bg-[#fccf54] text-gray-900 hover:bg-[#efc03f] shadow-lg shadow-[#fccf54]/20"
                  : "bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {session && (
            <Link href="/dashboard" className="w-9 h-9 rounded-full bg-[#fccf54] flex items-center justify-center text-gray-900 text-xs font-bold">
               {session.nama_lengkap?.charAt(0).toUpperCase()}
            </Link>
          )}
          <button
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-gray-900" : "text-white"} size={28} />
            ) : (
              <Menu className={isScrolled ? "text-gray-900" : "text-white"} size={28} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-2xl font-bold text-gray-900 hover:text-[#fccf54]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="w-48 py-4 bg-gray-900 text-white text-center rounded-full font-bold text-lg shadow-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  const response = await fetch("/api/auth/logout", { method: "POST" });
                  if (response.ok) window.location.reload();
                }}
                className="text-red-600 font-bold text-xl"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="w-48 py-4 bg-[#fccf54] text-gray-900 text-center rounded-full font-bold text-lg shadow-xl shadow-[#fccf54]/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Masuk Sekarang
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
