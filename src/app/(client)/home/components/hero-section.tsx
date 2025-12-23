"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, Facebook, Instagram, ChevronDown } from "lucide-react";

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

const SOCIAL_ICONS: Record<string, any> = {
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
  const rafId = useRef<number | null>(null);

  const eyebrow = content?.eyebrow;
  const headline = content?.headline;
  const subheadline = content?.subheadline;
  const highlights = content?.highlights || [];
  
  const primaryCta = callToActions?.primary;
  const secondaryCta = callToActions?.secondary;
  const socialLinks = settings?.socialLinks || [];

  // Smooth parallax effect for hero background
  const updateParallax = useCallback(() => {
    if (!heroRef.current || !bgRef.current) return;

    const scrollY = window.scrollY;
    const heroHeight = heroRef.current.offsetHeight;
    
    // Only apply parallax when hero is in view
    if (scrollY < heroHeight) {
      // Background moves at 40% of scroll speed for subtle depth effect
      const offset = scrollY * 0.4;
      bgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
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

    // Initial update
    updateParallax();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateParallax]);

  if (!headline && !eyebrow) {
    return null;
  }

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background with extended bounds */}
      <div 
        ref={bgRef}
        className="absolute bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80)`,
          // Extend beyond container to hide edges during parallax movement
          top: '-30%',
          bottom: '-30%',
          left: '-5%',
          right: '-5%',
        }}
        role="img"
        aria-label="Hero background"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/95 via-[#0f1419]/70 to-[#0f1419]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-[#0f1419]/30" />
      </div>

      {/* Decorative geometric elements */}
      <div className="absolute bottom-32 left-10 w-32 h-32 border border-white/10 rounded-full pointer-events-none z-[2]" />
      <div className="absolute top-1/4 right-16 w-24 h-24 border border-amber-500/15 rotate-45 pointer-events-none z-[2]" />
      <div className="absolute bottom-1/4 right-1/3 w-16 h-16 border border-white/5 rounded-full pointer-events-none z-[2]" />

      {/* Glassmorphism card effect */}
      <div className="absolute inset-x-4 md:inset-x-12 lg:inset-x-24 top-1/2 -translate-y-1/2 h-[70vh] rounded-3xl overflow-hidden z-[3] pointer-events-none">
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[2px] border border-white/[0.05] rounded-3xl" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-10rem)]">
          {/* Left Column - Main Content */}
          <div className="space-y-8 lg:space-y-10">
            {/* Tagline/Motto - Premium styling inspired by reference */}
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white leading-[1.1] tracking-tight">
                Work fast.
              </p>
              <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white leading-[1.1] tracking-tight">
                Live slow.
              </p>
            </div>

            {/* Domain/Brand Identifier */}
            {eyebrow && (
              <div className="flex items-center gap-3 text-white/60">
                <span className="text-sm tracking-[0.3em] uppercase font-light">{eyebrow}</span>
              </div>
            )}

            {/* Services/Highlights Row */}
            {highlights.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                {highlights.map((highlight, index) => (
                  <span key={index} className="flex items-center gap-2">
                    <span className="text-sm text-white/70 font-light tracking-wide">{highlight}</span>
                    {index < highlights.length - 1 && (
                      <span className="text-white/30 text-lg">+</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - CTA Section */}
          <div className="lg:text-right space-y-8">
            {/* Headline */}
            {headline && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white leading-tight">
                {headline}
              </h1>
            )}

            {/* Subheadline */}
            {subheadline && (
              <p className="text-lg text-white/60 leading-relaxed font-light max-w-md lg:ml-auto">
                {subheadline}
              </p>
            )}

            {/* CTA Button - Premium outlined style */}
            <div className="flex flex-col sm:flex-row lg:justify-end items-start sm:items-center gap-4">
              {primaryCta?.label && primaryCta?.url && (
                <Link
                  href={primaryCta.url}
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-white/30 rounded-full text-white hover:bg-white hover:text-[#0f1419] transition-all duration-500 text-sm tracking-wide"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {secondaryCta?.label && secondaryCta?.url && (
                <Link
                  href={secondaryCta.url}
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm tracking-wide"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex lg:justify-end gap-4 pt-4">
                {socialLinks.map((link, index) => {
                  const platform = link.platform?.toLowerCase() || '';
                  const Icon = SOCIAL_ICONS[platform] || Mail;
                  
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-white/40 hover:text-white transition-colors duration-300"
                      aria-label={link.platform}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Resume Download */}
            {(settings?.resumeCloudinaryUrl || settings?.resumeUrl) && (
              <div className="lg:text-right">
                <a
                  href={settings.resumeCloudinaryUrl || settings.resumeUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="font-light tracking-wide">Download Resume</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-[0.2em] uppercase font-light">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
