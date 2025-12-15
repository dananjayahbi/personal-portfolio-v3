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
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Content */}
          <div className="space-y-6">
            {eyebrow && (
              <p className="inline-block text-sm text-cyan-400 font-medium tracking-wider uppercase px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5">
                {eyebrow}
              </p>
            )}
            {headline && (
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent">
                  {headline}
                </span>
              </h1>
            )}
            {subheadline && (
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                {subheadline}
              </p>
            )}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-sm text-cyan-300/80 border border-cyan-400/20 bg-cyan-400/5 rounded-full backdrop-blur-sm"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            {primaryCta?.label && primaryCta?.url && (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-6 text-base font-medium rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
              >
                <Link href={primaryCta.url}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            {secondaryCta?.label && secondaryCta?.url && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-600 hover:border-cyan-400/50 hover:bg-cyan-400/5 text-white px-8 py-6 text-base font-medium rounded-full transition-all duration-300"
              >
                <Link href={secondaryCta.url}>
                  {secondaryCta.label}
                </Link>
              </Button>
            )}
          </div>

          {/* Social Links & Resume */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((link, index) => {
                  const platform = link.platform?.toLowerCase() || '';
                  const Icon = SOCIAL_ICONS[platform] || Mail;
                  
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-full transition-all duration-300"
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
              <a
                href={settings.resumeCloudinaryUrl || settings.resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors px-4 py-2 rounded-full border border-slate-700 hover:border-cyan-400/50 hover:bg-cyan-400/5"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
