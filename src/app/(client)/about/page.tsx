import { Metadata } from "next";
import { User, Briefcase, Download, ArrowLeft, GraduationCap, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
              Get to Know Me
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {summary && (
              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                {summary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* About Content */}
            {narrative && (
              <div className="p-8 md:p-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Background</h2>
                </div>
                <div className="prose prose-invert prose-slate max-w-none">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                    {narrative}
                  </p>
                </div>
              </div>
            )}

            {/* GitHub Contributions Graph */}
            <div className="p-8 md:p-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">GitHub Activity</h2>
              </div>
              <GitHubGraph />
            </div>

            {/* Experience Timeline */}
            {experiences.length > 0 && (
              <div className="p-8 md:p-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Professional Experience</h2>
                </div>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent" />
                  
                  <div className="space-y-10">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#0a192f] border-2 border-cyan-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-cyan-400" />
                        </div>
                        
                        <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-cyan-500/30 transition-colors">
                          <span className="inline-block text-xs text-cyan-400 font-semibold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-cyan-400/10">
                            {exp.period}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">{exp.role}</h3>
                          <p className="text-cyan-400 font-medium">{exp.company}</p>
                          {exp.description && (
                            <p className="text-slate-400 mt-3 leading-relaxed">
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
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-10 py-7 text-lg font-medium rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                  <a href={siteSettings.resumeCloudinaryUrl || siteSettings.resumeUrl!} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
