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
      <div className="h-16 w-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
    </div>
  );
}
