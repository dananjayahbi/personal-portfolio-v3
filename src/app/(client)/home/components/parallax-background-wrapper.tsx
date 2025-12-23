import { ReactNode } from "react";

interface ParallaxBackgroundWrapperProps {
  /** URL of the image to use as background */
  imageUrl: string;
  /** Alt text for accessibility (for screen readers) */
  alt?: string;
  /** Overlay gradient type */
  overlayType?: "dark" | "light" | "gradient" | "none";
  /** Additional CSS classes for the container */
  className?: string;
  /** Children content to render on top */
  children: ReactNode;
  /** Unique ID for the section */
  id?: string;
}

/**
 * CSS-only Parallax Background Wrapper
 * 
 * Uses `background-attachment: fixed` for a simple, memory-efficient parallax effect.
 * This approach doesn't require JavaScript scroll listeners and is GPU-accelerated
 * natively by the browser.
 */
export function ParallaxBackgroundWrapper({
  imageUrl,
  alt = "Section background",
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
    <section 
      className={`parallax-section relative ${className}`}
      id={id}
      aria-label={alt}
    >
      {/* CSS-only Parallax Background - uses background-attachment: fixed */}
      <div 
        className="parallax-bg absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />

      {/* Gradient Overlay */}
      {overlayType !== "none" && (
        <div className={`absolute inset-0 ${overlayStyles[overlayType]} z-[1]`} />
      )}

      {/* Subtle vignette effect for premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,20,25,0.3)_100%)] z-[2] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Top and bottom fade for seamless transitions between sections */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0f1419] to-transparent z-[3] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f1419] to-transparent z-[3] pointer-events-none" />
    </section>
  );
}
