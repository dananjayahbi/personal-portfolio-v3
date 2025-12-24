import { HeroSection } from "./components/hero-section";
import { FeaturedProjects } from "./components/featured-projects";
import { SkillsSection } from "./components/skills-section";
import { AboutSection } from "./components/about-section";
import { ContactSection } from "./components/contact-section";
import FeedbackSection from "./components/feedback-section";
import FeaturedFeedbackSection from "./components/featured-feedback-section";
import { getFeaturedProjects } from "@/services/project.service";
import { getPortfolioContent, getSiteSettings } from "@/services/content.service";
import { getAllTechnologies } from "@/services/technology.service";
import { SECTION_BACKGROUNDS } from "@/lib/constants/background-images";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const seo = siteSettings?.seo as { title?: string; description?: string; ogTitle?: string; ogDescription?: string; ogImage?: string } | undefined;

  return {
    title: seo?.title || "Home",
    description: seo?.description || "Professional software engineering portfolio",
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Portfolio - Software Engineer",
      description: seo?.ogDescription || seo?.description,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function ClientHomePage() {
  const [featuredProjects, portfolioContent, siteSettings, technologies] = await Promise.all([
    getFeaturedProjects(6),
    getPortfolioContent(),
    getSiteSettings(),
    getAllTechnologies(),
  ]);

  const heroContent = portfolioContent?.hero as Record<string, unknown> | undefined;
  const callToActions = portfolioContent?.callToActions as Record<string, unknown> | undefined;
  const aboutContent = portfolioContent?.about as Record<string, unknown> | undefined;
  const experiences = portfolioContent?.experiences as Array<{ company: string; role: string; period: string; description?: string }> | undefined;
  const githubGraphUrl = siteSettings?.githubGraphUrl as string | null | undefined;

  return (
    <div className="min-h-screen">
      <HeroSection content={heroContent} callToActions={callToActions} settings={siteSettings as Record<string, unknown> | undefined} />
      
      {/* Section backgrounds are configured in @/lib/constants/background-images.ts */}
      <AboutSection 
        content={aboutContent} 
        experiences={experiences} 
        githubGraphUrl={githubGraphUrl}
        backgroundImage={SECTION_BACKGROUNDS.about}
      />
      
      <SkillsSection 
        technologies={technologies}
        backgroundImage={SECTION_BACKGROUNDS.skills}
      />
      
      <FeaturedProjects 
        projects={featuredProjects}
        backgroundImage={SECTION_BACKGROUNDS.featuredProjects}
      />
      
      <FeaturedFeedbackSection backgroundImage={SECTION_BACKGROUNDS.featuredFeedback} />
      <FeedbackSection backgroundImage={SECTION_BACKGROUNDS.feedback} />
      
      <ContactSection 
        settings={siteSettings as Record<string, unknown> | undefined}
        backgroundImage={SECTION_BACKGROUNDS.contact}
      />
    </div>
  );
}
