"use client";

import { ReactNode } from "react";

interface ParallaxBackgroundWrapperProps {
  /** URL of the vertical image to use as background */
  imageUrl: string;
  /** Alt text for accessibility - not used but kept for consistency */
  alt?: string;
  /** Speed factor - not used in CSS parallax but kept for API consistency */
  speed?: number;
  /** Overlay gradient type */
  overlayType?: "dark" | "light" | "gradient" | "none";
  /** Additional CSS classes for the container */
  className?: string;
  /** Children content to render on top */
  children: ReactNode;
  /** Unique ID for the section */
  id?: string;
}

export function ParallaxBackgroundWrapper({
  imageUrl,
  alt = "Section background",
  speed = 0.4,
  overlayType = "dark",
  className = "",
  children,
  id,
}: ParallaxBackgroundWrapperProps) {
  const overlayStyles = {
    dark: "bg-gradient-to-b from-[#0f1419]/90 via-[#0f1419]/80 to-[#0f1419]/90",
    light: "bg-gradient-to-b from-white/90 via-white/70 to-white/90",
    gradient: "bg-gradient-to-br from-[#0f1419]/88 via-[#0f1419]/75 to-[#0f1419]/88",
    none: "",
  };

  return (
    <div 
      className={`relative ${className}`}
      id={id}
    >
      {/* CSS Parallax Background using background-attachment: fixed */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
        role="img"
        aria-label={alt}
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${overlayStyles[overlayType]} z-[1]`} />

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,20,25,0.25)_100%)] z-[2] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Top and bottom fade for seamless transitions */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0f1419] to-transparent z-[4] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1419] to-transparent z-[4] pointer-events-none" />
    </div>
  );
}
