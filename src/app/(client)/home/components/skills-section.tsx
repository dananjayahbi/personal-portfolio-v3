"use client";

import { useState } from "react";
import Image from "next/image";

interface Technology {
  id: string;
  name: string;
  icon: string | null;
  category: string;
  order: number;
}

interface SkillsSectionProps {
  technologies: Technology[];
}

function TechIcon({ tech }: { tech: Technology }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!tech.icon || hasError) {
    return (
      <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center bg-white/5 rounded-lg">
        <span className="text-lg font-serif text-white/30">{tech.name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 md:h-12 md:w-12">
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 rounded-lg animate-pulse" />
      )}
      <Image
        src={tech.icon}
        alt={tech.name}
        fill
        className={`object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 ${isLoading ? 'opacity-0' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

export function SkillsSection({ technologies }: SkillsSectionProps) {
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
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Large decorative image - left side */}
      <div className="absolute -left-16 top-20 w-[380px] h-[480px] opacity-[0.35] pointer-events-none hidden lg:block animate-float-slow">
        <div className="relative w-full h-full decorative-frame">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=90"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/80 via-[#0f1419]/30 to-transparent" />
        </div>
      </div>

      {/* Large decorative image - right side */}
      <div className="absolute -right-16 bottom-20 w-[350px] h-[420px] opacity-[0.30] pointer-events-none hidden lg:block animate-float-reverse">
        <div className="relative w-full h-full decorative-frame">
          <Image
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=90"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0f1419]/80 via-[#0f1419]/30 to-transparent" />
        </div>
      </div>

      {/* Floating geometric decorations */}
      <div className="absolute top-32 right-1/4 w-20 h-20 border-2 border-amber-400/20 rotate-45 pointer-events-none animate-float" />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 border-2 border-white/10 rounded-full pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-20 w-12 h-12 border border-amber-400/15 rounded-full pointer-events-none animate-float-subtle" />

      {/* Ambient glow effects */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-900/12 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-900/8 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Premium Typography */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-6">
            My Expertise
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-8">
            Skills & Technologies
          </h2>
          <p className="text-white/50 text-lg font-light">
            Tools and technologies I use to bring ideas to life
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="space-y-16">
          {Object.entries(groupedTechnologies).map(([category, techs]) => (
            <div key={category}>
              {/* Category Title */}
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-sm font-light text-white/60 tracking-[0.2em] uppercase whitespace-nowrap">
                  {category}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Technology Items */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className="group flex flex-col items-center gap-4 p-4 md:p-6 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-500"
                  >
                    {/* Technology Icon with Skeleton */}
                    <TechIcon tech={tech} />

                    {/* Technology Name */}
                    <span className="text-[10px] md:text-xs text-white/40 group-hover:text-white/70 text-center transition-colors duration-500 font-light tracking-wide line-clamp-1">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
