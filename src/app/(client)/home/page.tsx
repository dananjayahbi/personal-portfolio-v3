import { HeroSection } from "./components/hero-section";
import { FeaturedProjects } from "./components/featured-projects";
import { SkillsSection } from "./components/skills-section";
import { AboutSection } from "./components/about-section";
import { ContactSection } from "./components/contact-section";
import FeedbackSection from "./components/feedback-section";
import FeaturedFeedbackSection from "./components/featured-feedback-section";
import { ParallaxBackgroundWrapper } from "./components/parallax-background-wrapper";
import { getFeaturedProjects } from "@/services/project.service";
import { getPortfolioContent, getSiteSettings } from "@/services/content.service";
import { getAllTechnologies } from "@/services/technology.service";
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
  const [featuredProjects, portfolioContent, siteSettings, technologies] = await Promise.all([
    getFeaturedProjects(6),
    getPortfolioContent(),
    getSiteSettings(),
    getAllTechnologies(),
  ]);

  const heroContent = portfolioContent?.hero as any;
  const callToActions = portfolioContent?.callToActions as any;
  const aboutContent = portfolioContent?.about as any;
  const experiences = portfolioContent?.experiences as any;
  const githubGraphUrl = siteSettings?.githubGraphUrl as string | null | undefined;

  return (
    <div className="min-h-screen">
      <HeroSection content={heroContent} callToActions={callToActions} settings={siteSettings as any} />
      
      {/* First parallax background wrapper - covers About and Skills sections */}
      <ParallaxBackgroundWrapper
        imageUrl="/images/internal-images/sec2.webp"
        overlayType="gradient"
        id="about-skills-parallax"
      >
        <AboutSection content={aboutContent} experiences={experiences} githubGraphUrl={githubGraphUrl} />
        <SkillsSection technologies={technologies} />
      </ParallaxBackgroundWrapper>
      
      {/* Second parallax background wrapper - covers Projects section */}
      <ParallaxBackgroundWrapper
        imageUrl="/images/internal-images/code5.webp"
        overlayType="dark"
        id="projects-parallax"
      >
        <FeaturedProjects projects={featuredProjects} />
      </ParallaxBackgroundWrapper>
      
      {/* Third parallax background wrapper - covers Feedback sections */}
      <ParallaxBackgroundWrapper
        imageUrl="/images/internal-images/sec3.2.webp"
        overlayType="gradient"
        id="feedback-parallax"
      >
        <FeaturedFeedbackSection />
        <FeedbackSection />
      </ParallaxBackgroundWrapper>
      
      {/* Contact section with its own subtle background */}
      <ParallaxBackgroundWrapper
        imageUrl="/images/internal-images/code2.webp"
        overlayType="dark"
        id="contact-parallax"
      >
        <ContactSection settings={siteSettings as any} />
      </ParallaxBackgroundWrapper>
    </div>
  );
}
