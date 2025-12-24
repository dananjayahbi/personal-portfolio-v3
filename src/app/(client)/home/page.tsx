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
import { Metadata } from "next";

export const revalidate = 60;

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
      
      {/* Each section now has its own parallax background */}
      <AboutSection 
        content={aboutContent} 
        experiences={experiences} 
        githubGraphUrl={githubGraphUrl}
        backgroundImage="/images/internal-images/sec2.webp"
      />
      
      <SkillsSection 
        technologies={technologies}
        backgroundImage="/images/internal-images/code5.webp"
      />
      
      <FeaturedProjects 
        projects={featuredProjects}
        backgroundImage="/images/internal-images/code5.webp"
      />
      
      <FeaturedFeedbackSection backgroundImage="/images/internal-images/sec3.2.webp" />
      <FeedbackSection backgroundImage="/images/internal-images/sec3.2.webp" />
      
      <ContactSection 
        settings={siteSettings as Record<string, unknown> | undefined}
        backgroundImage="/images/internal-images/code2.webp"
      />
    </div>
  );
}
