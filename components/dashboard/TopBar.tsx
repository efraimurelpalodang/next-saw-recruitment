import React from "react";
import { Bell, Menu, User, LogOut } from "lucide-react";
import Image from "next/image";
import LogoutButton from "../ui/LogoutButton";

interface TopBarProps {
  user: any;
  title: string;
}

export default function TopBar({ user, title }: TopBarProps) {
  return (
    <header className="h-[70px] bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm shadow-gray-100/50">
      {/* Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-[#5a6a85] hover:bg-gray-50 rounded-lg transition-colors">
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-[#2a3547] leading-none">{title}</h1>
        </div>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
         {/* Simple notification dot */}
         <button className="p-2 text-[#5a6a85] hover:text-[#2a3547] transition-all relative">
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#fccf54] rounded-full border-2 border-white" />
         </button>

         {/* Profile Dropdown Simulation */}
         <div className="flex items-center gap-3 pl-4 border-l border-gray-100 group relative cursor-pointer py-1">
            <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-sm font-bold text-[#2a3547] mb-0.5">{user.nama_lengkap}</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-1.5 py-0.5 rounded">
                  {user.peran.nama_peran}
               </span>
            </div>
            <div className="w-[35px] h-[35px] rounded-full bg-gray-50 border-2 border-white shadow-sm ring-1 ring-gray-100 overflow-hidden group-hover:ring-[#fccf54] transition-all">
               <Image 
                 src={`https://i.pravatar.cc/100?u=${user.email}`} 
                 alt="User Profile" 
                 width={35} 
                 height={35}
                 className="object-cover"
               />
            </div>
            
            {/* Overlay Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
               <div className="pb-3 border-b border-gray-50 mb-2">
                  <p className="text-xs font-bold text-[#2a3547] truncate">{user.nama_lengkap}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
               </div>
               <button className="w-full flex items-center gap-3 p-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition-all">
                  <User size={16} /> Edit Profile
               </button>
               <div className="my-1 border-t border-gray-50" />
               <LogoutButton variant="minimal" />
            </div>
         </div>
      </div>
    </header>
  );
}
