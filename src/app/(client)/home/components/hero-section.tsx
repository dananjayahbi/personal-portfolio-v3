"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, Facebook, Instagram, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  content?: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    highlights?: string[];
  };
  callToActions?: {
    primary?: {
      label?: string;
      url?: string;
    };
    secondary?: {
      label?: string;
      url?: string;
    } | null;
  };
  settings?: {
    resumeUrl?: string;
    resumeCloudinaryUrl?: string;
    socialLinks?: Array<{
      platform?: string;
      url?: string;
    }>;
  };
}

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  email: Mail,
};

export function HeroSection({ content, callToActions, settings }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const rafId = useRef<number | null>(null);

  const eyebrow = content?.eyebrow;
  const headline = content?.headline;
  const subheadline = content?.subheadline;
  const highlights = content?.highlights || [];
  
  const primaryCta = callToActions?.primary;
  const secondaryCta = callToActions?.secondary;
  const socialLinks = settings?.socialLinks || [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x: x - 0.5, y: y - 0.5 });
  }, []);

  const updateParallax = useCallback(() => {
    if (!heroRef.current || !bgRef.current) return;
    const scrollY = window.scrollY;
    const heroHeight = heroRef.current.offsetHeight;
    if (scrollY < heroHeight) {
      const offset = scrollY * 0.4;
      bgRef.current.style.transform = "translate3d(0, " + offset + "px, 0) scale(1.1)";
    }
  }, []);

  useEffect(() => {
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
    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateParallax, handleMouseMove]);

  if (!headline && !eyebrow) {
    return null;
  }

  const bgTransform = "translate3d(" + (mousePosition.x * 20) + "px, " + (mousePosition.y * 20) + "px, 0) scale(1.1)";
  const contentTransform = "translate3d(" + (mousePosition.x * 10) + "px, " + (mousePosition.y * 10) + "px, 0)";
  const floatTransform1 = "translate3d(" + (mousePosition.x * -40) + "px, " + (mousePosition.y * -40) + "px, 0)";
  const floatTransform2 = "translate3d(" + (mousePosition.x * -30) + "px, " + (mousePosition.y * -30) + "px, 0) rotate(45deg)";
  const imageTransform = "perspective(1000px) rotateY(" + (mousePosition.x * 5) + "deg) rotateX(" + (-mousePosition.y * 5) + "deg)";

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: "url(/images/internal-images/hero.webp)",
          top: "-20%",
          bottom: "-20%",
          left: "-5%",
          right: "-5%",
          transform: bgTransform,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#030014]/95 via-[#030014]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-[#030014]/50" />
      </div>

      {/* Subtle floating elements */}
      <div
        className="absolute w-64 h-64 border border-blue-500/10 rounded-full pointer-events-none z-[2]"
        style={{
          top: "20%", right: "10%",
          transform: floatTransform1,
          transition: "transform 0.5s ease-out",
        }}
      />
      <div
        className="absolute w-32 h-32 border border-cyan-500/10 pointer-events-none z-[2]"
        style={{
          bottom: "30%", left: "15%",
          transform: floatTransform2,
          transition: "transform 0.5s ease-out",
        }}
      />

      {/* Content */}
      <div
        className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-12 py-20"
        style={{
          transform: contentTransform,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center min-h-[calc(100vh-10rem)]">
          {/* Profile Image - Shows first on mobile, second on desktop */}
          <div 
            className={"order-first lg:order-last lg:text-right space-y-6 lg:space-y-8 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0 lg:translate-y-0 lg:translate-x-0" : "opacity-0 translate-y-8 lg:translate-y-0 lg:translate-x-12")} 
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex justify-center lg:justify-end mb-4 lg:mb-8">
              <div className="relative group" style={{ transform: imageTransform, transition: "transform 0.3s ease-out" }}>
                <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500/30 transition-all duration-500 ring-4 ring-blue-500/5 ring-offset-4 ring-offset-[#030014]">
                  <Image src="/images/internal-images/me.png" alt="Profile" fill className="object-cover transition-transform duration-700 group-hover:scale-110" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>

            {/* Headline & Subheadline - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              {headline && (
                <h2 
                  className={"text-2xl sm:text-3xl md:text-4xl font-heading font-semibold text-white leading-tight transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                  style={{ transitionDelay: "600ms" }}
                >
                  {headline}
                </h2>
              )}

              {subheadline && (
                <p 
                  className={"text-lg text-white/50 leading-relaxed font-light max-w-md lg:ml-auto mt-4 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                  style={{ transitionDelay: "800ms" }}
                >
                  {subheadline}
                </p>
              )}

              {(settings?.resumeCloudinaryUrl || settings?.resumeUrl) && (
                <div 
                  className={"mt-6 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                  style={{ transitionDelay: "1000ms" }}
                >
                  <a href={settings.resumeCloudinaryUrl || settings.resumeUrl!} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-6 py-3 text-sm text-white/60 hover:text-white transition-colors border border-white/10 rounded-full hover:border-white/20">
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Text Content - Shows second on mobile, first on desktop */}
          <div className="order-last lg:order-first space-y-6 lg:space-y-10 text-center lg:text-left">
            {eyebrow && (
              <div 
                className={"flex items-center justify-center lg:justify-start gap-3 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} 
                style={{ transitionDelay: "400ms" }}
              >
                <div className="w-12 h-[1px] bg-blue-500" />
                <span className="text-sm tracking-[0.3em] uppercase font-light text-blue-400">{eyebrow}</span>
              </div>
            )}

            <div 
              className={"space-y-2 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
              style={{ transitionDelay: "500ms" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[0.9] tracking-tight">
                <span className="block text-white">Work fast.</span>
                <span className="block text-blue-400">Live slow.</span>
              </h1>
            </div>

            {/* Headline & Subheadline - Shown on mobile only */}
            <div className="lg:hidden space-y-3">
              {headline && (
                <h2 
                  className={"text-xl sm:text-2xl font-heading font-semibold text-white leading-tight transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                  style={{ transitionDelay: "550ms" }}
                >
                  {headline}
                </h2>
              )}

              {subheadline && (
                <p 
                  className={"text-base text-white/50 leading-relaxed font-light max-w-sm mx-auto transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                  style={{ transitionDelay: "600ms" }}
                >
                  {subheadline}
                </p>
              )}
            </div>

            {highlights.length > 0 && (
              <div 
                className={"flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 pt-2 lg:pt-4 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                style={{ transitionDelay: "650ms" }}
              >
                {highlights.map((highlight, index) => (
                  <span key={index} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/80 font-light tracking-wide bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:border-white/20 transition-all duration-300">{highlight}</span>
                ))}
              </div>
            )}

            <div 
              className={"flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 lg:pt-4 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
              style={{ transitionDelay: "750ms" }}
            >
              {primaryCta?.label && primaryCta?.url && (
                <Link href={primaryCta.url} className="group inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-white text-sm font-medium tracking-wide transition-colors duration-300">
                  <span>{primaryCta.label}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {secondaryCta?.label && secondaryCta?.url && (
                <Link href={secondaryCta.url} className="group inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-4 text-white/60 hover:text-white transition-colors text-sm tracking-wide border border-white/20 rounded-full hover:border-white/40">
                  {secondaryCta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            {/* Resume Download - Mobile only */}
            {(settings?.resumeCloudinaryUrl || settings?.resumeUrl) && (
              <div 
                className={"lg:hidden transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                style={{ transitionDelay: "850ms" }}
              >
                <a href={settings.resumeCloudinaryUrl || settings.resumeUrl!} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-5 py-2.5 text-sm text-white/60 hover:text-white transition-colors border border-white/10 rounded-full hover:border-white/20">
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div 
                className={"flex gap-3 pt-2 lg:pt-4 justify-center lg:justify-start transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} 
                style={{ transitionDelay: "900ms" }}
              >
                {socialLinks.map((link, index) => {
                  const platform = link.platform?.toLowerCase() || "";
                  const Icon = SOCIAL_ICONS[platform] || Mail;
                  return (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300" aria-label={link.platform}>
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={"absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 " + (isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} 
        style={{ transitionDelay: "1200ms" }}
      >
        <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} className="group flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
