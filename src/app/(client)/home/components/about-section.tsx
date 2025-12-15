import Link from "next/link";
import { ArrowRight, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export function AboutSection({ content, experiences }: AboutSectionProps) {
  const title = content?.title || "About Me";
  const summary = content?.summary;
  const narrative = content?.narrative;

  // Only show section if there's content
  if (!summary && !narrative && (!experiences || experiences.length === 0)) {
    return null;
  }

  return (
    <section id="about" className="py-24 md:py-32 scroll-mt-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
            Who I Am
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          {summary && (
            <p className="text-slate-400 text-lg leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Background & GitHub */}
          <div className="space-y-10">
            {narrative && (
              <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                  </div>
                  Background
                </h3>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                  {narrative}
                </p>
              </div>
            )}

            {/* GitHub Contributions */}
            <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6">
                GitHub Activity
              </h3>
              <GitHubGraph />
            </div>
          </div>

          {/* Right Column - Experience Timeline */}
          {experiences && experiences.length > 0 && (
            <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-8">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                Experience
              </h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent" />
                
                <div className="space-y-8">
                  {experiences.slice(0, 4).map((exp, index) => (
                    <div key={index} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                      
                      <div>
                        <span className="text-xs text-cyan-400 font-medium tracking-wide">
                          {exp.period}
                        </span>
                        <h4 className="text-white font-semibold mt-1">{exp.role}</h4>
                        <p className="text-slate-400 text-sm">{exp.company}</p>
                        {exp.description && (
                          <p className="text-slate-500 text-sm mt-2 line-clamp-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* See More Button */}
              {experiences.length > 4 && (
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 p-0 h-auto font-medium"
                  >
                    <Link href="/about" className="inline-flex items-center gap-2">
                      View full experience
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Learn More Button */}
        <div className="mt-12 text-center">
          <Button 
            asChild 
            className="bg-transparent border border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 hover:text-cyan-300 px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
          >
            <Link href="/about">
              Learn more about me
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
