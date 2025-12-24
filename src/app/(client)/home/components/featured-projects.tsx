"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github, Folder, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "@prisma/client";
import { AnimateOnScroll } from "@/components/common/animate-on-scroll";

interface FeaturedProjectsProps {
  projects: Project[];
  backgroundImage?: string;
}

export function FeaturedProjects({ projects, backgroundImage }: FeaturedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Enhanced 3D parallax scroll effect
  const updateParallax = useCallback(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    const isInView = rect.bottom > 0 && rect.top < windowHeight;
    
    if (isInView) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
      const yOffset = (scrollProgress - 0.5) * sectionHeight * 0.7;
      const rotateX = (scrollProgress - 0.5) * 5;
      
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

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/15 via-transparent to-blue-900/15 z-[1]" />
          
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
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 z-[3]"
        style={{
          top: "0%",
          left: "-15%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <Layers className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                  Featured Projects
                </h2>
                <p className="text-white/50 text-sm mt-1">Recent work and experiments</p>
              </div>
            </div>
            
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium tracking-wide group transition-colors"
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} animation="fade-up" delay={index * 100}>
              <article className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                {/* Project Image */}
                {project.heroImage && (
                  <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-white/5">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/50 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <Folder className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-2">
                      {project.sourceUrl && (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                          aria-label="GitHub repository"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                          aria-label="Live demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {project.summary && (
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>
                  )}

                  {/* Technologies */}
                  {project.technologies && (project.technologies as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(project.technologies as string[]).slice(0, 4).map((tech, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-white/5 hover:bg-white/10 text-white/60 border-white/10 text-xs font-light"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {(project.technologies as string[]).length > 4 && (
                        <Badge
                          variant="secondary"
                          className="bg-white/5 text-white/40 border-white/10 text-xs font-light"
                        >
                          +{(project.technologies as string[]).length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* View Project Link */}
                  <div className="pt-4 border-t border-white/5">
                    <Link
                      href={"/project-detail/" + project.slug}
                      className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-blue-400 transition-colors group/link"
                    >
                      View Project
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
