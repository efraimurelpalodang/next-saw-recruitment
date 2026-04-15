import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trendValue?: string;
  trendLabel?: string;
  trendColor?: string;
  viewLink?: string;
  viewText?: string;
}

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = "primary",
  trendValue = "+5%",
  trendLabel = "vs Last Month",
  trendColor = "success",
  viewLink = "#",
  viewText = "View"
}: StatCardProps) {
  
  const colorMap: Record<string, string> = {
    primary: "text-[#eb6f4c]",
    danger: "text-[#fa5a6e]",
    warning: "text-[#fbae1c]",
    success: "text-[#13deb9]",
    info: "text-[#5d87ff]",
  };

  const getThemeColor = (colorName: string) => {
    return colorMap[colorName] || colorMap.primary;
  };

  return (
    <div className="bg-white p-6 rounded-[5px] border border-[#f5f2f2] shadow-xs flex flex-col justify-between">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#2a3547] mb-1 tracking-tight">{value}</h2>
          <p className="text-[14px] text-[#5a6a85] font-medium">{label}</p>
        </div>
        <div className={getThemeColor(color)}>
          <Icon size={40} strokeWidth={2.2} />
        </div>
      </div>
      
      <div className="border-t border-[#f5f2f2] pt-4 flex flex-wrap justify-between items-center text-[13px]">
        <div className="flex gap-1">
          <span className={`font-semibold ${getThemeColor(trendColor)}`}>{trendValue}</span>
          <span className="text-[#5a6a85] font-medium">{trendLabel}</span>
        </div>
        <a href={viewLink} className={`font-semibold hover:underline ${getThemeColor(color)}`}>
          {viewText}
        </a>
      </div>
    </div>
  );
}
