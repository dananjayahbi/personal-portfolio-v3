"use client";

import { useEffect, useState, useRef, useCallback, ReactNode } from "react";
import Image from "next/image";

interface ParallaxSectionBackgroundProps {
  /** URL of the vertical image to use as background */
  imageUrl: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Parallax speed factor (0 = no movement, 1 = full scroll speed) */
  speed?: number;
  /** Overlay gradient type */
  overlayType?: "dark" | "light" | "gradient" | "none";
  /** Additional CSS classes for the container */
  className?: string;
  /** Children content to render on top */
  children?: ReactNode;
  /** Starting vertical position offset in viewport height */
  startOffset?: number;
  /** Height of the section in viewport height units */
  sectionHeight?: number;
  /** Blur amount for glassmorphism effect */
  blurAmount?: number;
  /** Whether to show decorative elements */
  showDecorations?: boolean;
}

export function ParallaxSectionBackground({
  imageUrl,
  alt = "Background image",
  speed = 0.3,
  overlayType = "dark",
  className = "",
  children,
  startOffset = 0,
  sectionHeight = 2,
  blurAmount = 0,
  showDecorations = true,
}: ParallaxSectionBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Check if element is in viewport
          if (rect.top < windowHeight && rect.bottom > 0) {
            setIsVisible(true);
            // Calculate scroll position relative to element
            const relativeScroll = window.scrollY - (containerRef.current.offsetTop - windowHeight);
            setScrollY(relativeScroll);
          } else {
            setIsVisible(false);
          }
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const overlayStyles = {
    dark: "bg-gradient-to-b from-[#0f1419]/90 via-[#0f1419]/70 to-[#0f1419]/90",
    light: "bg-gradient-to-b from-white/80 via-white/50 to-white/80",
    gradient: "bg-gradient-to-br from-[#0f1419]/80 via-transparent to-[#0f1419]/80",
    none: "",
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: `${sectionHeight * 100}vh` }}
    >
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{
          transform: isVisible ? `translateY(${scrollY * speed}px) scale(1.15)` : 'scale(1.15)',
          transition: 'transform 0.1s ease-out',
          top: `${startOffset * -50}vh`,
          height: `${(sectionHeight + 1) * 100}vh`,
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={`object-cover object-center ${blurAmount > 0 ? `blur-[${blurAmount}px]` : ''}`}
          sizes="100vw"
          priority={startOffset === 0}
        />
      </div>

      {/* Overlay */}
      {overlayType !== "none" && (
        <div className={`absolute inset-0 ${overlayStyles[overlayType]} z-[1]`} />
      )}

      {/* Decorative Elements */}
      {showDecorations && (
        <>
          {/* Floating orbs with parallax */}
          <div 
            className="absolute top-1/4 left-1/6 w-40 h-40 bg-amber-500/8 rounded-full blur-[80px] pointer-events-none z-[2] will-change-transform"
            style={{ 
              transform: isVisible ? `translateY(${scrollY * 0.15}px)` : 'none',
              transition: 'transform 0.15s ease-out',
            }}
          />
          <div 
            className="absolute bottom-1/3 right-1/5 w-56 h-56 bg-emerald-500/6 rounded-full blur-[100px] pointer-events-none z-[2] will-change-transform"
            style={{ 
              transform: isVisible ? `translateY(${scrollY * -0.1}px)` : 'none',
              transition: 'transform 0.15s ease-out',
            }}
          />

          {/* Geometric decorations */}
          <div 
            className="absolute top-1/3 right-10 w-24 h-24 border border-white/10 rounded-full pointer-events-none z-[2] will-change-transform hidden lg:block"
            style={{ 
              transform: isVisible ? `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.05}deg)` : 'none',
              transition: 'transform 0.15s ease-out',
            }}
          />
          <div 
            className="absolute bottom-1/4 left-16 w-16 h-16 border border-amber-400/15 rotate-45 pointer-events-none z-[2] will-change-transform hidden lg:block"
            style={{ 
              transform: isVisible ? `rotate(${45 + scrollY * 0.08}deg) translateY(${scrollY * -0.15}px)` : 'rotate(45deg)',
              transition: 'transform 0.15s ease-out',
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * A simpler fixed parallax background that spans the entire viewport
 * Used for creating immersive full-page effects
 */
interface FixedParallaxBackgroundProps {
  imageUrl: string;
  alt?: string;
  speed?: number;
  overlayOpacity?: number;
}

export function FixedParallaxBackground({
  imageUrl,
  alt = "Background",
  speed = 0.5,
  overlayOpacity = 0.7,
}: FixedParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none will-change-transform"
      style={{
        transform: `translateY(${scrollY * speed}px) scale(1.3)`,
        transition: 'transform 0.1s linear',
      }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      <div 
        className="absolute inset-0 bg-[#0f1419]"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
