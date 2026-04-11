"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      {loading ? "Keluar..." : "Log Out"}
    </button>
  );
}
