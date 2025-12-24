"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from "react";

interface Parallax3DProps {
  children: ReactNode;
  /** Intensity of the 3D tilt effect (0-1) */
  intensity?: number;
  /** Enable mouse-following effect */
  mouseFollow?: boolean;
  /** Enable scroll-based parallax */
  scrollParallax?: boolean;
  /** Parallax speed multiplier (-1 to 1) */
  parallaxSpeed?: number;
  /** Additional CSS classes */
  className?: string;
  /** Enable perspective container */
  perspective?: boolean;
  /** Enable glow effect on hover */
  glowEffect?: boolean;
}

/**
 * Parallax3D - Advanced 3D parallax and tilt effects
 * 
 * Features:
 * - Mouse-following 3D tilt effect
 * - Scroll-based parallax movement
 * - GPU-accelerated transforms
 * - Mobile-friendly with touch support
 * - Reduced motion support
 */
export function Parallax3D({
  children,
  intensity = 0.1,
  mouseFollow = true,
  scrollParallax = true,
  parallaxSpeed = 0.3,
  className = "",
  perspective = true,
  glowEffect = false,
}: Parallax3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, translateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const rafId = useRef<number | null>(null);
  const isTouchDevice = useRef(false);

  // Detect touch device
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Mouse movement handler for 3D tilt
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || !mouseFollow || isTouchDevice.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center (-1 to 1)
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    // Apply rotation with intensity multiplier
    const rotateX = -mouseY * 15 * intensity;
    const rotateY = mouseX * 15 * intensity;

    setTransform(prev => ({ ...prev, rotateX, rotateY }));
    
    if (glowEffect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGlowPosition({ x, y });
    }
  }, [intensity, mouseFollow, glowEffect]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform(prev => ({ ...prev, rotateX: 0, rotateY: 0 }));
    setGlowPosition({ x: 50, y: 50 });
  }, []);

  // Scroll parallax handler
  const handleScroll = useCallback(() => {
    if (!ref.current || !scrollParallax) return;

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how far through the viewport the element is
    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    
    // Apply parallax offset
    const translateY = (scrollProgress - 0.5) * 100 * parallaxSpeed;
    
    setTransform(prev => ({ ...prev, translateY }));
  }, [scrollParallax, parallaxSpeed]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Throttled scroll handler
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    if (mouseFollow && !isTouchDevice.current) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    if (scrollParallax) {
      window.addEventListener('scroll', scrollHandler, { passive: true });
      handleScroll(); // Initial position
    }

    return () => {
      if (mouseFollow) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (scrollParallax) {
        window.removeEventListener('scroll', scrollHandler);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleScroll, mouseFollow, scrollParallax]);

  const transformStyle = {
    transform: `
      perspective(${perspective ? '1000px' : 'none'})
      rotateX(${transform.rotateX}deg)
      rotateY(${transform.rotateY}deg)
      translateY(${transform.translateY}px)
    `,
    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
  };

  return (
    <div
      ref={ref}
      className={`parallax-3d-container ${className}`}
      style={{
        ...transformStyle,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {glowEffect && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(147, 51, 234, 0.15), transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  /** Y-axis floating range in pixels */
  floatRange?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Enable rotation during float */
  rotate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FloatingElement - Creates a floating animation effect
 */
export function FloatingElement({
  children,
  floatRange = 20,
  duration = 6,
  delay = 0,
  rotate = false,
  className = "",
}: FloatingElementProps) {
  return (
    <div
      className={`floating-element ${className}`}
      style={{
        animation: `floating ${duration}s ease-in-out ${delay}s infinite`,
        '--float-range': `${floatRange}px`,
        '--rotate': rotate ? '5deg' : '0deg',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface MouseFollowerProps {
  children: ReactNode;
  /** Follow intensity (0-1) */
  intensity?: number;
  /** Smoothing factor (higher = smoother) */
  smoothing?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MouseFollower - Element that follows mouse position with lag
 */
export function MouseFollower({
  children,
  intensity = 0.1,
  smoothing = 0.1,
  className = "",
}: MouseFollowerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      target.current = {
        x: (e.clientX - centerX) * intensity,
        y: (e.clientY - centerY) * intensity,
      };
    };

    const animate = () => {
      position.current.x += (target.current.x - position.current.x) * smoothing;
      position.current.y += (target.current.y - position.current.y) * smoothing;
      
      if (ref.current) {
        ref.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      }
      
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [intensity, smoothing]);

  return (
    <div ref={ref} className={`mouse-follower ${className}`} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  /** Z-depth layer (0 = foreground, higher = further back) */
  depth?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ParallaxLayer - Creates layered parallax depth
 */
export function ParallaxLayer({
  children,
  depth = 0,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const scrollY = window.scrollY;
      const speed = 1 - (depth * 0.2);
      const yOffset = scrollY * speed * 0.3;
      
      ref.current.style.transform = `translateY(${yOffset}px) translateZ(${-depth * 100}px) scale(${1 + depth * 0.1})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [depth]);

  return (
    <div
      ref={ref}
      className={`parallax-layer ${className}`}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

interface GlowOrbProps {
  /** Size in pixels */
  size?: number;
  /** Color (CSS color value) */
  color?: string;
  /** Blur amount in pixels */
  blur?: number;
  /** Position */
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  /** Enable pulsing animation */
  pulse?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * GlowOrb - Decorative glowing orb element
 */
export function GlowOrb({
  size = 400,
  color = "rgba(147, 51, 234, 0.15)",
  blur = 100,
  position = {},
  pulse = true,
  className = "",
}: GlowOrbProps) {
  return (
    <div
      className={`glow-orb pointer-events-none absolute rounded-full ${pulse ? 'animate-pulse-slow' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
        ...position,
      }}
    />
  );
}
