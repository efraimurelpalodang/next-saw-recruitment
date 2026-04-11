import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight, Globe, Camera, Briefcase, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Company Profile */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#fccf54] rounded-xl flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-white">
                  SUMBER PANGAN
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase leading-none text-[#fccf54]">
                  SEJAHTERA
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Penyedia solusi bahan baku pangan terintegrasi yang berfokus pada kualitas premium dan ketepatan distribusi bagi industri manufaktur pangan nasional.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, Camera, Briefcase, Send].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#fccf54] hover:text-gray-900 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">Tautan Langsung</h3>
            <div className="flex flex-col gap-3">
              {["Beranda", "Tentang Kami", "Layanan Utama", "Katalog Produk", "Karir", "Blog"].map((link) => (
                <Link key={link} href="#" className="text-gray-400 text-sm hover:text-[#fccf54] hover:translate-x-2 transition-all flex items-center gap-2 group">
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Core Business */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">Bisnis Inti</h3>
            <div className="flex flex-col gap-3 text-gray-400 text-sm font-medium">
              <div className="flex flex-col">
                <span className="text-white font-bold mb-1">Industrial Sourcing</span>
                <span>Pengadaan bahan baku pangan global.</span>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-white font-bold mb-1">Logistics Solution</span>
                <span>Distribusi bahan baku tepat waktu.</span>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-white font-bold mb-1">Quality Assurance</span>
                <span>Standar keamanan pangan tinggi.</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Detail */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">Hubungi Kami</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#fccf54] shrink-0" size={20} />
                <p className="text-gray-400 text-sm leading-relaxed">
                  Kawasan Industri Jababeka II, <br />
                  Jl. Industri Selatan No. 12, Kalimantan Selatan, <br />
                  BanjarBaru, Indonesia 17530
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[#fccf54] shrink-0" size={20} />
                <p className="text-gray-400 text-sm">+62 (21) 8934 1234</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[#fccf54] shrink-0" size={20} />
                <p className="text-gray-400 text-sm">info@sumberpangan.co.id</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Jam Operasional</p>
              <p className="text-xs font-medium text-white">Senin - Jumat: 08:30 - 17:30 WIB</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Efraim urel palodang. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs text-gray-500 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
