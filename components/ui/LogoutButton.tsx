"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "minimal";
}

export default function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center gap-3 p-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-all group"
        title="Logout"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} strokeWidth={2.5} />}
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2 bg-[#2a3547] text-white rounded-[7px] hover:opacity-90 transition-all disabled:opacity-50 text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fccf54] focus:ring-offset-2"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          <LogOut size={16} strokeWidth={2.5} />
          Logout Account
        </>
      )}
    </button>
  );
}
