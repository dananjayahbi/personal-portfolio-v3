"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const eyebrow = content?.eyebrow;
  const headline = content?.headline;
  const subheadline = content?.subheadline;
  const highlights = content?.highlights || [];
  
  const primaryCta = callToActions?.primary;
  const secondaryCta = callToActions?.secondary;
  const socialLinks = settings?.socialLinks || [];

  if (!headline && !eyebrow) {
    return null;
  }

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Strong Parallax Effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=85"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient Overlays for Premium Dark Look */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/90 via-[#0f1419]/60 to-[#0f1419]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-[#0f1419]/20" />
      </div>

      {/* Additional decorative parallax elements */}
      <div 
        className="absolute bottom-20 left-10 w-32 h-32 border-2 border-white/10 rounded-full pointer-events-none z-[1]"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      />
      <div 
        className="absolute top-1/3 right-10 w-24 h-24 border-2 border-amber-500/15 rotate-45 pointer-events-none z-[1]"
        style={{ transform: `rotate(45deg) translateY(${scrollY * 0.12}px)` }}
      />

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
