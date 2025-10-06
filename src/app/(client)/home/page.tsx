import { HeroSection } from "./components/hero-section";
import { FeaturedProjects } from "./components/featured-projects";
import { SkillsSection } from "./components/skills-section";
import { AboutSection } from "./components/about-section";
import { ContactSection } from "./components/contact-section";
import { getFeaturedProjects } from "@/services/project.service";
import { getPortfolioContent, getSiteSettings } from "@/services/content.service";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const seo = siteSettings?.seo as any;

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
  const [featuredProjects, portfolioContent, siteSettings] = await Promise.all([
    getFeaturedProjects(6),
    getPortfolioContent(),
    getSiteSettings(),
  ]);

  const heroContent = portfolioContent?.hero as any;
  const callToActions = portfolioContent?.callToActions as any;
  const aboutContent = portfolioContent?.about as any;
  const skills = portfolioContent?.skills || [];
  const experiences = portfolioContent?.experiences as any;

  return (
    <div className="min-h-screen">
      <HeroSection content={heroContent} callToActions={callToActions} settings={siteSettings as any} />
      <FeaturedProjects projects={featuredProjects} />
      <SkillsSection skills={skills} />
      <AboutSection content={aboutContent} experiences={experiences} />
      <ContactSection settings={siteSettings as any} />
    </div>
  );
}
