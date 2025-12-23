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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f1419]">
      {/* Elegant loading animation */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo/Brand mark */}
        <div className="font-serif text-4xl text-white/80 tracking-wide">
          Portfolio
        </div>
        
        {/* Minimal loading bar */}
        <div className="relative w-48 h-px bg-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent animate-shimmer" />
        </div>
        
        {/* Loading text */}
        <span className="text-white/30 text-xs font-light tracking-[0.3em] uppercase">
          Loading
        </span>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
