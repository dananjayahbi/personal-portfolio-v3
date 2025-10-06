import Link from "next/link";
import { User, Briefcase, ArrowRight } from "lucide-react";
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
    <section id="about" className="py-20 bg-slate-900/50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          {summary && (
            <p className="text-lg text-slate-400">
              {summary}
            </p>
          )}
        </div>

        {/* Content Stack */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Background Section */}
          {narrative && (
            <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Background</h3>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {narrative}
              </p>
            </div>
          )}

          {/* Experience Section */}
          {experiences && experiences.length > 0 && (
            <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Experience</h3>
              </div>

              <div className="relative">
                <div className="space-y-6">
                  {experiences.slice(0, 3).map((exp, index) => (
                    <div 
                      key={index} 
                      className={`relative pl-6 border-l-2 border-slate-700 transition-opacity ${
                        index === 2 && experiences.length > 2 ? 'opacity-40' : 'opacity-100'
                      }`}
                    >
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-cyan-500' : 'bg-slate-600'}`} />
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                        <p className="text-cyan-400 text-sm">{exp.company}</p>
                        <p className="text-slate-400 text-sm">{exp.period}</p>
                        {exp.description && (
                          <p className="text-slate-300 text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show "See Full" button if more than 2 experiences */}
                {experiences.length > 2 && (
                  <div className="mt-6 text-center">
                    <Button 
                      asChild 
                      size="sm" 
                      variant="outline" 
                      className="group border-slate-700 hover:border-cyan-500"
                    >
                      <Link href="/about">
                        See Full Experience
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GitHub Contributions Graph */}
          <GitHubGraph />
        </div>

        {/* See More Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="group border-slate-700 hover:border-cyan-500">
            <Link href="/about">
              Learn More About Me
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
