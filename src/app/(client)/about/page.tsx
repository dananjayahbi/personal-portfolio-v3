import { Metadata } from "next";
import { User, Briefcase, Download, ArrowLeft, Award } from "lucide-react";
import Link from "next/link";
import { getPortfolioContent, getSiteSettings } from "@/services/content.service";
import { GitHubGraph } from "@/components/common/github-graph";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const seo = siteSettings?.seo as any;

  return {
    title: "About",
    description: seo?.description || "Learn more about my professional journey",
    openGraph: {
      title: "About | Portfolio",
      description: seo?.description || "Learn more about my professional journey",
      images: seo?.image ? [seo.image] : [],
    },
  };
}

export default async function AboutPage() {
  const [portfolioContent, siteSettings] = await Promise.all([
    getPortfolioContent(),
    getSiteSettings(),
  ]);

  const aboutContent = portfolioContent?.about as any;
  const experiences = (portfolioContent?.experiences as Array<{
    company: string;
    role: string;
    period: string;
    description?: string;
  }>) || [];

  const title = aboutContent?.title || "About Me";
  const summary = aboutContent?.summary;
  const narrative = aboutContent?.narrative;

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/5 rounded-full blur-[180px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-amber-400/80 transition-colors text-sm font-light tracking-wide mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="max-w-4xl mb-16">
          <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-4">
            Get to Know Me
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-6">
            {title}
          </h1>
          {summary && (
            <p className="text-lg text-white/50 leading-relaxed max-w-2xl font-light">
              {summary}
            </p>
          )}
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {/* About Content */}
          {narrative && (
            <div className="p-8 md:p-12 bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-amber-400/70" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-white">Background</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/60 leading-relaxed whitespace-pre-line text-lg font-light">
                  {narrative}
                </p>
              </div>
            </div>
          )}

          {/* GitHub Contributions Graph */}
          <div className="p-8 md:p-12 bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-400/70" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-white">GitHub Activity</h2>
            </div>
            <GitHubGraph />
          </div>

          {/* Experience Timeline */}
          {experiences.length > 0 && (
            <div className="p-8 md:p-12 bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-amber-400/70" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-white">Professional Experience</h2>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/40 via-white/10 to-transparent" />
                
                <div className="space-y-12">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-14">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#0f1419] border border-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400/70" />
                      </div>
                      
                      <div className="p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
                        <span className="inline-block text-xs text-amber-400/70 font-light tracking-[0.15em] uppercase mb-3">
                          {exp.period}
                        </span>
                        <h3 className="text-xl font-serif text-white mb-1">{exp.role}</h3>
                        <p className="text-amber-400/60 text-sm font-light">{exp.company}</p>
                        {exp.description && (
                          <p className="text-white/50 mt-4 leading-relaxed font-light">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Download CV */}
          {(siteSettings?.resumeCloudinaryUrl || siteSettings?.resumeUrl) && (
            <div className="text-center py-8">
              <a 
                href={siteSettings.resumeCloudinaryUrl || siteSettings.resumeUrl!} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 text-sm font-light tracking-wide"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
