import { Metadata } from "next";
import { User, Briefcase, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPortfolioContent, getSiteSettings } from "@/services/content.service";

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
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-white">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {title}
            </h1>
            {summary && (
              <p className="text-xl text-slate-300">
                {summary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* About Content */}
            {narrative && (
              <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Background</h2>
                </div>
                <div className="prose prose-invert prose-slate max-w-none">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                    {narrative}
                  </p>
                </div>
              </div>
            )}

            {/* Experience Timeline */}
            {experiences.length > 0 && (
              <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Professional Experience</h2>
                </div>

                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-slate-700">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-cyan-500' : 'bg-slate-600'}`} />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                        <p className="text-cyan-400 font-medium">{exp.company}</p>
                        <p className="text-slate-400">{exp.period}</p>
                        {exp.description && (
                          <p className="text-slate-300 mt-3 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download CV */}
            {siteSettings?.resumeUrl && (
              <div className="text-center py-8">
                <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                  <a href={siteSettings.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Download CV
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
