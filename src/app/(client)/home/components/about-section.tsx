"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Calendar, Code2 } from "lucide-react";
import { GitHubGraph } from "@/components/common/github-graph";
import { AnimateOnScroll } from "@/components/common/animate-on-scroll";

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

  if (!summary && !narrative && (!experiences || experiences.length === 0)) {
    return null;
  }

  return (
    <section id="about" className="py-24 md:py-32 scroll-mt-16 relative overflow-hidden">
      {/* Simple background accent */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          top: "10%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up" duration={800}>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-blue-500/50" />
              <span className="text-sm tracking-[0.3em] uppercase font-light text-blue-400">Get to know me</span>
              <div className="w-12 h-[1px] bg-blue-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">{title}</h2>
            {summary && (
              <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">{summary}</p>
            )}
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left Column - Narrative */}
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="space-y-8">
              {narrative && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <Code2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-white">My Story</h3>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <p className="text-white/60 leading-relaxed font-light whitespace-pre-line">{narrative}</p>
                  </div>
                </div>
              )}

              {/* GitHub Activity */}
              {githubGraphUrl && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-light text-white/50">GitHub Activity</span>
                    <div className="flex-1 h-[1px] bg-white/5" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <GitHubGraph graphUrl={githubGraphUrl} />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium tracking-wide group transition-colors"
                >
                  Learn more about me
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right Column - Experience */}
          {experiences && experiences.length > 0 && (
            <AnimateOnScroll animation="fade-up" delay={400}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Briefcase className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white">Experience</h3>
                </div>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-3 bottom-3 w-[1px] bg-white/10" />
                  
                  <div className="space-y-6">
                    {experiences.slice(0, 4).map((exp, index) => (
                      <div 
                        key={index}
                        className="relative pl-10 group"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-[#030014] border-2 border-white/20 group-hover:border-blue-500/50 transition-colors" />
                        
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-lg font-heading font-semibold text-white">{exp.role}</h4>
                          </div>
                          <p className="text-blue-400 font-medium text-sm mb-1">{exp.company}</p>
                          <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{exp.period}</span>
                          </div>
                          {exp.description && (
                            <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
