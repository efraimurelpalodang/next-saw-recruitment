"use client";

import Image from "next/image";
import { ClipboardCheck, Truck, Search, ShieldCheck, ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "Quality Control",
    desc: "Inspeksi ketat di setiap tahap supply chain untuk menjamin standar keamanan pangan pabrik.",
    icon: ClipboardCheck,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=90&w=800",
  },
  {
    title: "Distribusi Cepat",
    desc: "Armada logistik handal yang menjamin ketepatan waktu pengiriman hingga ke pintu pabrik Anda.",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=90&w=800",
  },
  {
    title: "Konsultasi Supply",
    desc: "Layanan manajemen stok dan peramalan kebutuhan bahan baku untuk efisiensi produksi.",
    icon: Search,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=90&w=800",
  },
  {
    title: "Sertifikasi Lengkap",
    desc: "Semua produk kami memiliki sertifikasi Halal, HACCP, dan izin resmi dari BPOM RI.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=90&w=800",
  },
];

const ServiceCards = () => {
  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
          <div className="flex flex-col gap-4">
            <h2 className="text-[#fccf54] font-bold tracking-[0.2em] uppercase text-sm">Layanan Kami</h2>
            <p className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Solusi End-to-End <br /> Pasokan Bahan Pangan
            </p>
          </div>
          <p className="text-gray-500 max-w-sm mb-2 font-medium">
            Meningkatkan efisiensi industri pangan Anda melalui standar kualitas global dan integrasi rantai pasok yang cerdas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div 
              key={service.title}
              className="group relative h-[500px] overflow-hidden bg-gray-900 cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent group-hover:bg-gray-900/60 transition-all duration-500"></div>
              </div>

              {/* Bottom aligned content that slides UP on hover */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-10 flex flex-col justify-end">
                <div className="transform translate-y-[135px] group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {service.title}
                    </h3>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <p className="text-gray-300 text-sm leading-relaxed mb-8">
                            {service.desc}
                        </p>
                        <div className="flex items-center gap-3 text-sm font-bold text-[#fccf54] group/btn">
                            Pelajari Selengkapnya <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
