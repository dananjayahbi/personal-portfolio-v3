"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Calendar } from "lucide-react";
import { GitHubGraph } from "@/components/common/github-graph";

interface AboutSectionProps {
  content?: {
    title?: string;
    summary?: string;
    narrative?: string;
  };
  experiences?: Array<{
    company: string;
    role: string;
    period: string;
    description?: string;
  }>;
  githubGraphUrl?: string | null;
}

export function AboutSection({ content, experiences, githubGraphUrl }: AboutSectionProps) {
  const title = content?.title || "About Me";
  const summary = content?.summary;
  const narrative = content?.narrative;

  // Only show section if there's content
  if (!summary && !narrative && (!experiences || experiences.length === 0)) {
    return null;
  }

  return (
    <section id="about" className="py-24 md:py-32 scroll-mt-16 relative overflow-hidden">
      {/* Floating geometric decorations - enhanced with glassmorphism */}
      <div className="absolute top-20 right-1/4 w-20 h-20 border-2 border-amber-400/20 rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-40 left-1/3 w-16 h-16 border-2 border-white/10 rotate-45 pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 right-10 w-12 h-12 border border-emerald-400/15 rounded-full pointer-events-none animate-float-subtle" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Premium Typography */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-6">
            Who I Am
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-8">
            {title}
          </h2>
          {summary && (
            <p className="text-white/50 text-lg leading-relaxed font-light">
              {summary}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Background & GitHub */}
          <div className="space-y-10">
            {narrative && (
              <div className="p-8 md:p-10 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: 'transform 0.7s ease-out, opacity 0.3s' }} />
                
                <h3 className="flex items-center gap-3 text-lg font-light text-white mb-6">
                  <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center bg-white/[0.02]">
                    <Briefcase className="w-4 h-4 text-amber-400/60" />
                  </div>
                  <span className="tracking-wide">Background</span>
                </h3>
                <p className="text-white/50 leading-relaxed whitespace-pre-line font-light">
                  {narrative}
                </p>
              </div>
            )}

            {/* GitHub Contributions */}
            <div className="p-8 md:p-10 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl relative overflow-hidden hover:bg-white/[0.05] transition-all duration-500">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/8 to-transparent pointer-events-none" />
              <h3 className="text-lg font-light text-white mb-8 tracking-wide">
                GitHub Activity
              </h3>
              <GitHubGraph graphUrl={githubGraphUrl} />
            </div>
          </div>

          {/* Right Column - Experience Timeline */}
          {experiences && experiences.length > 0 && (
            <div className="p-8 md:p-10 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl relative overflow-hidden hover:bg-white/[0.05] transition-all duration-500">
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent rounded-t-2xl" />
              
              <h3 className="flex items-center gap-3 text-lg font-light text-white mb-10">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-400/60" />
                </div>
                <span className="tracking-wide">Experience</span>
              </h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/30 via-white/10 to-transparent" />
                
                <div className="space-y-10">
                  {experiences.slice(0, 4).map((exp, index) => (
                    <div key={index} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-6 h-6 border border-white/20 bg-[#0f1419] flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-400/60" />
                      </div>
                      
                      <div>
                        <span className="text-xs text-amber-400/50 font-light tracking-wider uppercase">
                          {exp.period}
                        </span>
                        <h4 className="text-white font-medium mt-2 tracking-wide">{exp.role}</h4>
                        <p className="text-white/40 text-sm font-light mt-1">{exp.company}</p>
                        {exp.description && (
                          <p className="text-white/30 text-sm mt-3 line-clamp-2 font-light leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* See More Button */}
              {experiences.length > 4 && (
                <div className="mt-10 pt-8 border-t border-white/[0.06]">
                  <Link 
                    href="/about" 
                    className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-amber-400/80 transition-colors font-light tracking-wide"
                  >
                    View full experience
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Learn More Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/about"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white/70 hover:text-white hover:border-amber-500/40 transition-all duration-300 text-sm tracking-wide font-light"
          >
            Learn more about me
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
