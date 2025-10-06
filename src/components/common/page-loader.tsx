'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader on initial page load
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="h-24 w-24 rounded-full border-4 border-transparent border-t-cyan-500 border-r-blue-500 animate-spin" />
        
        {/* Middle rotating ring */}
        <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-transparent border-b-indigo-500 border-l-purple-500 animate-spin-slow" />
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 animate-pulse" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
      </div>
    </div>
  );
}
