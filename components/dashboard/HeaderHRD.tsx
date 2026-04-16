"use client";

import React from "react";
import Image from "next/image";
import { Search, ChevronDown, Bell } from "lucide-react";

interface HeaderHRDProps {
  user: any;
}

export default function HeaderHRD({ user }: HeaderHRDProps) {
  const roleName = user.peran?.nama_peran || "HRD";
  
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-gray-100/50">
      {/* Search Bar - TailAdmin Inspired */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3c50e0] transition-colors">
            <Search size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Ketik untuk mencari..."
            className="w-full bg-transparent pl-8 pr-4 py-2 text-sm focus:outline-none placeholder-gray-400 text-gray-600 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications Placeholder */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:text-[#3c50e0] transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile Area */}
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1c2434] group-hover:text-[#3c50e0] transition-colors">{user.nama_lengkap}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{roleName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center shadow-inner group-hover:border-[#3c50e0]/20 transition-all">
              {user.profil?.foto_profil ? (
                <Image 
                  src={user.profil.foto_profil} 
                  alt={user.nama_lengkap} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-black text-gray-300">
                  {user.nama_lengkap?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-[#3c50e0] transition-all" />
          </div>
        </div>
      </div>
    </header>
  );
}
