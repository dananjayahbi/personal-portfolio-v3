"use client";

import { ReactNode } from "react";

interface ParallaxSectionBackgroundProps {
  /** URL of the image to use as background */
  imageUrl: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Overlay gradient type */
  overlayType?: "dark" | "light" | "gradient" | "none";
  /** Additional CSS classes for the container */
  className?: string;
  /** Children content to render on top */
  children?: ReactNode;
  /** Height of the section - can be CSS value like "100vh", "auto", etc. */
  sectionHeight?: string;
  /** Whether to show decorative elements */
  showDecorations?: boolean;
}

/**
 * CSS-only Parallax Section Background
 * 
 * Uses `background-attachment: fixed` for a memory-efficient parallax effect.
 * No JavaScript scroll listeners required - GPU accelerated by browser.
 */
export function ParallaxSectionBackground({
  imageUrl,
  alt = "Background image",
  overlayType = "dark",
  className = "",
  children,
  sectionHeight = "auto",
  showDecorations = false,
}: ParallaxSectionBackgroundProps) {
  const overlayStyles = {
    dark: "bg-gradient-to-b from-[#0f1419]/90 via-[#0f1419]/70 to-[#0f1419]/90",
    light: "bg-gradient-to-b from-white/80 via-white/50 to-white/80",
    gradient: "bg-gradient-to-br from-[#0f1419]/80 via-transparent to-[#0f1419]/80",
    none: "",
  };

  return (
    <section 
      className={`parallax-section relative ${className}`}
      style={{ minHeight: sectionHeight }}
      aria-label={alt}
    >
      {/* CSS-only Parallax Background */}
      <div 
        className="parallax-bg absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />

      {/* Overlay */}
      {overlayType !== "none" && (
        <div className={`absolute inset-0 ${overlayStyles[overlayType]} z-[1]`} />
      )}

      {/* Optional Decorative Elements - CSS-only animations */}
      {showDecorations && (
        <>
          {/* Floating orbs with CSS animation */}
          <div className="absolute top-1/4 left-1/6 w-40 h-40 bg-amber-500/8 rounded-full blur-[80px] pointer-events-none z-[2] animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/5 w-56 h-56 bg-emerald-500/6 rounded-full blur-[100px] pointer-events-none z-[2] animate-pulse-slow" />

          {/* Geometric decorations with CSS animations */}
          <div className="absolute top-1/3 right-10 w-24 h-24 border border-white/10 rounded-full pointer-events-none z-[2] hidden lg:block animate-float-subtle" />
          <div className="absolute bottom-1/4 left-16 w-16 h-16 border border-amber-400/15 rotate-45 pointer-events-none z-[2] hidden lg:block animate-float-reverse" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

/**
 * A simpler fixed background that creates a parallax-like effect
 * Used for full-viewport immersive sections
 */
interface FixedParallaxBackgroundProps {
  imageUrl: string;
  alt?: string;
  overlayOpacity?: number;
}

export function FixedParallaxBackground({
  imageUrl,
  alt = "Background",
  overlayOpacity = 0.7,
}: FixedParallaxBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Fixed background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
        aria-label={alt}
      />
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#0f1419]"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
