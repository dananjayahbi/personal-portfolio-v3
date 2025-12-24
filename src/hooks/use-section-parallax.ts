"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ParallaxState {
  offset: number;
  opacity: number;
  isInView: boolean;
}

interface UseSectionParallaxOptions {
  speed?: number; // 0.1 to 1, how fast the background moves relative to scroll
  mobileEnabled?: boolean; // Enable parallax on mobile
}

export function useSectionParallax(options: UseSectionParallaxOptions = {}) {
  const { speed = 0.3, mobileEnabled = true } = options;
  
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  
  const [parallaxState, setParallaxState] = useState<ParallaxState>({
    offset: 0,
    opacity: 0,
    isInView: false,
  });

  const updateParallax = useCallback(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    // Check if section is in view
    const isInView = rect.bottom > 0 && rect.top < windowHeight;
    
    if (isInView) {
      // Calculate how far the section is from the center of the viewport
      const sectionCenter = rect.top + sectionHeight / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = sectionCenter - viewportCenter;
      
      // Calculate parallax offset based on scroll position
      const offset = distanceFromCenter * speed;
      
      // Calculate opacity for fade effect (1 when fully in view)
      const progress = 1 - Math.abs(distanceFromCenter) / (windowHeight / 2 + sectionHeight / 2);
      const opacity = Math.max(0, Math.min(1, progress));
      
      // Apply transform directly for performance
      bgRef.current.style.transform = `translate3d(0, ${offset}px, 0) scale(1.15)`;
      
      setParallaxState({ offset, opacity, isInView: true });
    } else {
      setParallaxState(prev => ({ ...prev, isInView: false }));
    }
  }, [speed]);

  useEffect(() => {
    // Check if mobile and parallax should be disabled
    const isMobile = window.innerWidth < 768;
    if (isMobile && !mobileEnabled) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
      }
    };

    // Initial update
    updateParallax();
    
    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateParallax, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateParallax);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateParallax, mobileEnabled]);

  return {
    sectionRef,
    bgRef,
    parallaxState,
  };
}
