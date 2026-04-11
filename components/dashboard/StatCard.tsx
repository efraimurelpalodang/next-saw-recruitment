import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({ label, value, icon: Icon, color = "primary" }: StatCardProps) {
  return (
   <div className="bg-white p-6 rounded-[7px] border border-[#f5f2f2] shadow-xs transition-shadow group flex items-center justify-between overflow-hidden">
    <div>
     <h4 className="text-[13px] font-semibold text-[#5a6a85] mb-2 uppercase tracking-tight">{label}</h4>
     <div className="flex items-center gap-1">
      <span className="text-2xl font-bold text-[#2a3547]">{value}</span>
     </div>
    </div>

    <div
     className={`w-[45px] h-[45px] rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
      color === "primary" ? "bg-[#fef7df] text-[#fccf54]" : color === "success" ? "bg-[#e8f7ff] text-[#0085db]" : color === "info" ? "bg-[#ecf2ff] text-[#5d87ff]" : "bg-[#fdf3f5] text-[#fa896b]"
     }`}
    >
     <Icon size={22} strokeWidth={2.2} />
    </div>
   </div>
  );
}
