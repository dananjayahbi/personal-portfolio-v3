'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Only show loader after component mounts (prevents SSR mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Show loader on route change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, mounted]);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030014]">
      {/* Elegant loading animation */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo/Brand mark */}
        <div className="font-serif text-4xl text-white/80 tracking-wide">
          Portfolio
        </div>
        
        {/* Minimal loading bar with halo effect */}
        <div className="relative w-48 h-[2px] bg-white/10 overflow-hidden rounded-full">
          <div className="absolute inset-0 animate-page-loader-shimmer" />
        </div>
        
        {/* Loading text */}
        <span className="text-white/30 text-xs font-light tracking-[0.3em] uppercase">
          Loading
        </span>
      </div>
    </div>
  );
}
