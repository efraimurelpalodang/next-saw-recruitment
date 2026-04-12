import React from 'react';
import Link from 'next/link';
import { User, Settings } from 'lucide-react';

interface WelcomeHeaderProps {
  nama: string;
}

const WelcomeHeader = ({ nama }: WelcomeHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Selamat datang, <span className="text-[#efc03f]">{nama}</span>! 👋
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Pantau progres lamaran dan lengkapi data diri Anda di sini.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Link 
          href="/" 
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <Settings size={18} />
          <span>Ke Landing Page</span>
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-[#fccf54] flex items-center justify-center text-gray-900 shadow-lg shadow-[#fccf54]/20 border-2 border-white">
          <User size={24} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
