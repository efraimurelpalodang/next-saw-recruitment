import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  title: string;
}

export default function DashboardLayout({ children, user, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#fff] font-plus overflow-hidden">
      {/* Sidebar - Strict Modernize Width (270px) */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header / TopBar - Sticky Style (Height 70px) */}
        <TopBar user={user} title={title} />

        {/* Scrollable Page Content - Standard Padding 24px */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pt-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
