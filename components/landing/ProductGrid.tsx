"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";

const products = [
  {
    name: "Tepung Terigu & Gandum",
    spec: "Grade A | Industrial Use",
    image: "/images/cat-flour.png",
  },
  {
    name: "Gula & Pemanis Alami",
    spec: "Rafinasi | High Purity",
    image: "/images/cat-sugar.png",
  },
  {
    name: "Minyak & Lemak Industri",
    spec: "CPO | RBD Palm Olein",
    image: "/images/hero-warehouse.png", // Fallback to hero image for now
  },
];

const ProductGrid = () => {
  return (
    <section id="products" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-[#fccf54] font-bold tracking-[0.2em] uppercase text-sm">Produk Unggulan</h2>
          <p className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Kategori Bahan Baku <br /> Standar Industri
          </p>
          <div className="h-1.5 w-20 bg-[#fccf54] rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <div key={product.name} className="group relative h-[450px] rounded-[40px] overflow-hidden shadow-xl hover:shadow-[#fccf54]/10 transition-all duration-500">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent group-hover:via-gray-900/60 transition-all"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-2">
                <p className="text-[#fccf54] font-bold text-xs tracking-widest uppercase">{product.spec}</p>
                <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>
                
                <button className="flex items-center justify-between w-full py-4 px-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold text-sm hover:bg-[#fccf54] hover:text-gray-900 hover:border-transparent transition-all">
                  Lihat Spesifikasi <MoveRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
            <button className="px-12 py-5 border-2 border-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white hover:border-transparent transition-all">
                Semua Koleksi Bahan Baku
            </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
