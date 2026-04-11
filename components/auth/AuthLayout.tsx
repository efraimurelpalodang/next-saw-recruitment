import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  imageSrc,
  imageAlt,
}: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans">
      <div className="flex-1 flex flex-col md:flex-row h-full">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center bg-white px-8 md:px-16 lg:px-24">
          <div className="max-w-sm w-full mx-auto py-8">
            {/* Logo placeholder if needed */}
            <div className="mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#fccf54] rounded-lg flex items-center justify-center font-bold text-gray-900 shadow-sm text-sm">
                SAW
              </div>
              <span className="font-semibold text-lg tracking-tight text-gray-900">Recruitment</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-gray-500 font-normal text-base mb-6 leading-relaxed">
              {subtitle}
            </p>

            {children}
          </div>
        </div>

        {/* Right Side: Visual */}
        <div className="hidden md:flex md:w-1/2 h-full p-4 relative">
          <div className="w-full h-full relative bg-[#f5f0d3] overflow-hidden rounded-[2rem] shadow-inner">
            <div className="absolute inset-0 z-0 scale-105 hover:scale-100 transition-transform duration-1000">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent z-10" />

            <div className="absolute bottom-6 left-6 right-6 z-20 text-white drop-shadow-md">
              <h2 className="text-xl font-bold mb-2 leading-tight text-white">
                Rekrutmen Pintar untuk Masa Depan.
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${100 * i} flex items-center justify-center text-[8px] font-bold text-gray-900 overflow-hidden`}>
                      <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" width={32} height={32} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-semibold opacity-90 underline underline-offset-4 decoration-[#fccf54]">
                  Bergabung dengan profesional lainnya.
                </p>
              </div>
            </div>

            {/* Decorative floating card */}
            <div className="hidden lg:block absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-[1.5rem] shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#fccf54] rounded-full flex items-center justify-center text-gray-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-xs leading-tight">Keputusan Terukur</p>
                  <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Metode SAW Murni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
