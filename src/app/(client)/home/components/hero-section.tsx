import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  content?: {
    title?: string;
    subtitle?: string;
    tagline?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  settings?: {
    resumeUrl?: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      email?: string;
    };
  };
}

export function HeroSection({ content, settings }: HeroSectionProps) {
  const title = content?.title || "Hi, I'm a Software Engineer";
  const subtitle = content?.subtitle || "Building Digital Experiences";
  const tagline = content?.tagline || "Passionate about creating elegant solutions to complex problems using modern technologies and best practices.";

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
            <p className="text-sm sm:text-base text-cyan-400 font-mono tracking-wider">
              &lt;/&gt; Welcome to my portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
              {title}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 font-light">
              {subtitle}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="group bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-base shadow-lg shadow-cyan-500/20"
            >
              <Link href="/projects">
                View My Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-700 hover:border-cyan-500 text-white px-8 py-6 text-base"
            >
              <Link href="/#contact">
                Get in Touch
              </Link>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 pt-8">
            {settings?.socialLinks?.github && (
              <a
                href={settings.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {settings?.socialLinks?.linkedin && (
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {settings?.socialLinks?.email && (
              <a
                href={`mailto:${settings.socialLinks.email}`}
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>

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
