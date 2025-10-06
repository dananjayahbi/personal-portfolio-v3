import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const eyebrow = content?.eyebrow;
  const headline = content?.headline;
  const subheadline = content?.subheadline;
  const highlights = content?.highlights || [];
  
  const primaryCta = callToActions?.primary;
  const secondaryCta = callToActions?.secondary;

  // Parse social links from settings
  const socialLinks = settings?.socialLinks || [];

  // Only show section if there's content
  if (!headline && !eyebrow) {
    return null;
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Greeting */}
          <div className="space-y-2 animate-fade-in">
            {eyebrow && (
              <p className="text-sm sm:text-base text-cyan-400 font-mono tracking-wider">
                {eyebrow}
              </p>
            )}
            {headline && (
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
                {headline}
              </h1>
            )}
            {subheadline && (
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 font-light">
                {subheadline}
              </p>
            )}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300"
                >
                  {highlight}
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {primaryCta?.label && primaryCta?.url && (
              <Button
                asChild
                size="lg"
                className="group bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-base shadow-lg shadow-cyan-500/20"
              >
                <Link href={primaryCta.url}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
            {secondaryCta?.label && secondaryCta?.url && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-700 hover:border-cyan-500 text-black px-8 py-6 text-base"
              >
                <Link href={secondaryCta.url}>
                  {secondaryCta.label}
                </Link>
              </Button>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              {socialLinks.map((link, index) => {
                const platform = link.platform?.toLowerCase() || '';
                const Icon = SOCIAL_ICONS[platform] || Mail;
                
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110"
                    aria-label={link.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Resume Download */}
          {settings?.resumeUrl && (
            <div className="pt-4">
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-slate-600" />
        </div>
      </div>
    </section>
  );
}
