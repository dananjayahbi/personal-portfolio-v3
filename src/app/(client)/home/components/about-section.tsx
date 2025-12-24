"use client";

import { useEffect, useRef, useCallback } from "react";
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
  backgroundImage?: string;
}

export function AboutSection({ content, experiences, githubGraphUrl, backgroundImage }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const title = content?.title || "About Me";
  const summary = content?.summary;
  const narrative = content?.narrative;

  // Enhanced 3D parallax scroll effect
  const updateParallax = useCallback(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    // Check if section is in view
    const isInView = rect.bottom > 0 && rect.top < windowHeight;
    
    if (isInView) {
      // Calculate parallax offset based on scroll position - aggressive
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
      const yOffset = (scrollProgress - 0.5) * sectionHeight * 0.7; // More aggressive movement
      
      // Add rotation for 3D effect
      const rotateX = (scrollProgress - 0.5) * 5; // Stronger 3D rotation
      
      bgRef.current.style.transform = "perspective(1000px) translate3d(0, " + yOffset + "px, 80px) rotateX(" + rotateX + "deg) scale(1.25)";
    }
  }, []);

  useEffect(() => {
    if (!backgroundImage) return;

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
    window.addEventListener("resize", updateParallax, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateParallax);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateParallax, backgroundImage]);

  if (!summary && !narrative && (!experiences || experiences.length === 0)) {
    return null;
  }

  return (
    <section ref={sectionRef} id="about" className="py-24 md:py-32 scroll-mt-16 relative overflow-hidden">
      {/* Parallax Background */}
      {backgroundImage && (
        <>
          <div
            ref={bgRef}
            className="absolute bg-cover bg-center will-change-transform pointer-events-none"
            style={{
              backgroundImage: "url(" + backgroundImage + ")",
              top: "-20%",
              bottom: "-20%",
              left: "-10%",
              right: "-10%",
              transformOrigin: "center center",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/90 via-[#030014]/75 to-[#030014]/90 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/15 via-transparent to-cyan-900/15 z-[1]" />
          
          {/* Enhanced edge transitions with blur */}
          <div 
            className="absolute top-0 left-0 right-0 h-48 z-[2] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #030014 0%, rgba(3, 0, 20, 0.95) 20%, rgba(3, 0, 20, 0.7) 50%, rgba(3, 0, 20, 0.3) 80%, transparent 100%)",
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none"
            style={{
              background: "linear-gradient(to top, #030014 0%, rgba(3, 0, 20, 0.95) 20%, rgba(3, 0, 20, 0.7) 50%, rgba(3, 0, 20, 0.3) 80%, transparent 100%)",
            }}
          />
        </>
      )}

      {/* Simple background accent */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 z-[2]"
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
                  
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
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
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
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
                        
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
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
