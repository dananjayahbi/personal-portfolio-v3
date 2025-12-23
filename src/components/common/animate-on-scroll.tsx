"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  /** Animation type */
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "scale" | "slide-up";
  /** Delay before animation starts (in ms) */
  delay?: number;
  /** Duration of animation (in ms) */
  duration?: number;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate only once */
  once?: boolean;
}

/**
 * AnimateOnScroll - Triggers CSS animations when element enters viewport
 * 
 * Uses Intersection Observer for efficient viewport detection.
 * Minimal JavaScript - only detects visibility, all animations are CSS.
 */
export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, once]);

  const animationClass = isVisible ? `animate-${animation}` : `animate-${animation}-initial`;

  return (
    <div
      ref={ref}
      className={`${animationClass} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Staggered animation wrapper for multiple children
 */
interface StaggeredAnimateProps {
  children: ReactNode[];
  /** Base animation type */
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "scale" | "slide-up";
  /** Delay between each child animation (in ms) */
  staggerDelay?: number;
  /** Base delay before first animation (in ms) */
  baseDelay?: number;
  /** Duration of each animation (in ms) */
  duration?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

export function StaggeredAnimate({
  children,
  animation = "fade-up",
  staggerDelay = 100,
  baseDelay = 0,
  duration = 600,
  className = "",
}: StaggeredAnimateProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimateOnScroll
          key={index}
          animation={animation}
          delay={baseDelay + index * staggerDelay}
          duration={duration}
        >
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
}
