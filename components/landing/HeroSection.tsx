"use client";

import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-warehouse.png"
          alt="Modern Food Warehouse"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-12 bg-[#fccf54]"></span>
            <span className="text-[#fccf54] font-bold tracking-widest text-xs uppercase">
              Partner Terpercaya Pilihan Industri
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1]">
            Membangun <span className="text-[#fccf54]">Rantai Pasok</span> Pangan yang Berkelanjutan
          </h1>

          <p className="text-lg text-gray-300 max-w-lg leading-relaxed font-medium">
            PT. Sumber Pangan Sejahtera menyediakan bahan baku pangan premium dengan standar QC ketat untuk menyokong operasional pabrik makanan di seluruh Nusantara.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-4">
            <button className="h-14 px-10 bg-[#fccf54] hover:bg-[#efc03f] text-gray-900 rounded-full font-bold text-lg transition-all active:scale-95 shadow-xl shadow-[#fccf54]/20 flex items-center gap-3 hover:cursor-pointer">
              Lihat Katalog Produk <ArrowRight size={20} />
            </button>

            <button className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#fccf54] group-hover:text-gray-900 transition-all hover:cursor-pointer">
                <Play size={20} fill="currentColor" />
              </div>
              <span className="text-white font-bold text-sm tracking-wide">Video Company Profile</span>
            </button>
          </div>

          {/* Quick Stats Overlay (Mobile friendly view) */}
          <div className="mt-1 grid grid-cols-3 gap-8 p-6 md:p-10 rounded-[32px]">
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-white transition-colors">500+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Klien Pabrik</p>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-8">
              <p className="text-3xl font-bold text-white transition-colors">100%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Food Grade</p>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-8">
              <p className="text-3xl font-bold text-white transition-colors">24h</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Support Layanan</p>
            </div>
          </div>
        </div>

        {/* Dynamic Card Overlay like in image (Visual only) */}
        <div className="hidden lg:flex justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300 -translate-y-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] w-80 shadow-2xl relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#fccf54] rounded-3xl flex items-center justify-center shadow-lg transform rotate-12">
              <Image src="/next.svg" alt="Quality" width={30} height={30} className="invert" style={{ height: 'auto' }} />
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Sertifikasi Terbaru</p>
                <div className="flex gap-2">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[#fccf54]"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#fccf54] flex items-center justify-center text-[#fccf54] font-bold italic">ISO</div>
                <div>
                  <p className="text-white font-bold text-sm">ISO 22000:2018</p>
                  <p className="text-gray-400 text-[10px] font-medium tracking-wide">Food Safety Management</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700`}></div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-[#fccf54] flex items-center justify-center text-[10px] font-bold text-gray-900">+12</div>
                </div>
                <p className="text-gray-400 text-[10px] mt-2 font-medium italic">Mitra kami bertambah setiap minggu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave/Transition (Adapted from your reference image's wavy layout) */}
      <div className="absolute bottom-[-1px] left-0 w-full z-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto translate-y-20">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,197.3C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
