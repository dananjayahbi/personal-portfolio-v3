"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/common/animate-on-scroll";
import { Zap } from "lucide-react";

interface Technology {
  id: string;
  name: string;
  icon: string | null;
  category: string;
  order: number;
}

interface SkillsSectionProps {
  technologies: Technology[];
  backgroundImage?: string;
}

function TechIcon({ tech }: { tech: Technology }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isLoaded = !isLoading;

  if (!tech.icon || hasError) {
    return (
      <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
        <span className="text-xl font-heading font-bold text-white/60">
          {tech.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 md:h-14 md:w-14">
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 rounded-xl animate-pulse" />
      )}
      <Image
        src={tech.icon}
        alt={tech.name}
        fill
        sizes="56px"
        className={"object-contain transition-all duration-500 " + (isLoaded ? "opacity-70 group-hover:opacity-100 group-hover:scale-110" : "opacity-0")}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

export function SkillsSection({ technologies, backgroundImage }: SkillsSectionProps) {
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

  if (!technologies || technologies.length === 0) return null;

  // Group technologies by category
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  // Sort technologies within each category by order
  Object.keys(groupedTechnologies).forEach(category => {
    groupedTechnologies[category].sort((a, b) => a.order - b.order);
  });

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
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/90 via-[#030014]/75 to-[#030014]/90 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/15 via-transparent to-blue-900/15 z-[1]" />
          
          {/* Soft edge fades for seamless transitions */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#030014] via-[#030014]/80 to-transparent z-[2]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] via-[#030014]/80 to-transparent z-[2]" />
        </>
      )}

      {/* Simple background accent */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 z-[3]"
        style={{
          top: "20%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <AnimateOnScroll animation="fade-up">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                Skills & Technologies
              </h2>
              <p className="text-white/50 text-sm mt-1">Tools and frameworks I work with</p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedTechnologies).map(([category, techs], categoryIndex) => (
            <AnimateOnScroll 
              key={category} 
              animation="fade-up" 
              delay={categoryIndex * 100}
            >
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <h3 className="text-lg font-heading font-semibold text-white">{category}</h3>
                  <span className="ml-auto text-xs text-white/40">{techs.length} skills</span>
                </div>

                {/* Tech Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {techs.map((tech, techIndex) => (
                    <div
                      key={tech.id}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
                      style={{ animationDelay: (techIndex * 50) + "ms" }}
                    >
                      <TechIcon tech={tech} />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-white/70 group-hover:text-white font-medium truncate block transition-colors duration-300">
                          {tech.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
