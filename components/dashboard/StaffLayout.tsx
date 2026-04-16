"use client";

import React from "react";
import SidebarHRD from "./SidebarHRD";
import HeaderHRD from "./HeaderHRD";

interface StaffLayoutProps {
  user: any;
  children: React.ReactNode;
}

export default function StaffLayout({ user, children }: StaffLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f2f6fa]">
      {/* Sidebar - Fixed width */}
      <SidebarHRD />

      {/* Main Content Area - Compensate for sidebar width */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <HeaderHRD user={user} />
        
        <main className="flex-1 p-8 overflow-y-auto mt-2">
          {children}
        </main>
      </div>
    </div>
  );
}
