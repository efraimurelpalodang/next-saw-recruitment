import prisma from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

const JobListingPreview = async () => {
  const activeJobs = await prisma.lowongan.findMany({
    where: { status: "aktif" },
    take: 3,
    orderBy: { dibuat_pada: "desc" },
    include: {
      jenis_pekerjaan: true,
    },
  });

  return (
    <section id="careers" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#fccf54]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-[#fccf54] font-bold tracking-[0.2em] uppercase text-sm">Karir di PT. SPS</h2>
            <p className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Bangun Masa Depan <br /> Di Industri Pangan
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 p-8 rounded-[32px] max-w-sm">
            <p className="text-gray-600 text-sm leading-relaxed italic">
              &quot;Bergabunglah dengan tim profesional kami yang berdedikasi tinggi dalam menjaga kualitas pasokan pangan nasional.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#fccf54]"></div>
               <div>
                  <p className="text-gray-900 font-bold text-sm">HR Department</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Recruitment Team</p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {activeJobs.length > 0 ? (
            activeJobs.map((job) => (
              <div 
                key={job.id_lowongan}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-[32px] border border-gray-100 hover:border-[#fccf54] hover:bg-gray-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#fccf54] group-hover:text-gray-900 transition-colors">
                    <Briefcase size={28} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-gray-900">{job.jenis_pekerjaan.nama_jenis}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-[#fccf54]" /> {job.lokasi_kerja}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>Full Time</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex items-center gap-4 w-full md:w-auto">
                    <Link
                      href="/login" 
                      className="flex-1 md:flex-none py-3 px-8 rounded-full border border-gray-200 text-sm font-bold text-gray-900 hover:border-gray-900 transition-all text-center"
                    >
                      Detail
                    </Link>
                    <Link
                      href="/login" 
                      className="flex-1 md:flex-none py-3 px-8 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-[#fccf54] hover:text-gray-900 transition-all shadow-lg shadow-gray-900/10 text-center"
                    >
                      Lamar Sekarang
                    </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
               <p className="text-gray-500 font-medium italic">Saat ini belum ada lowongan aktif. Silakan cek kembali nanti.</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
            <Link href="/login" className="flex items-center gap-2 font-bold text-gray-900 hover:text-[#efc03f] transition-colors group">
                Lihat Semua Lowongan <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default JobListingPreview;
