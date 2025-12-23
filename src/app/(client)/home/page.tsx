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

  return (
    <div className="min-h-screen">
      <HeroSection content={heroContent} callToActions={callToActions} settings={siteSettings as any} />
      
      {/* First parallax background wrapper - covers About and Skills sections */}
      <ParallaxBackgroundWrapper
        imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=75"
        overlayType="gradient"
        speed={0.5}
        id="about-skills-parallax"
      >
        <AboutSection content={aboutContent} experiences={experiences} />
        <SkillsSection technologies={technologies} />
      </ParallaxBackgroundWrapper>
      
      {/* Second parallax background wrapper - covers Projects section */}
      <ParallaxBackgroundWrapper
        imageUrl="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=75"
        overlayType="dark"
        speed={0.4}
        id="projects-parallax"
      >
        <FeaturedProjects projects={featuredProjects} />
      </ParallaxBackgroundWrapper>
      
      {/* Third parallax background wrapper - covers Feedback sections */}
      <ParallaxBackgroundWrapper
        imageUrl="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=75"
        overlayType="gradient"
        speed={0.5}
        id="feedback-parallax"
      >
        <FeaturedFeedbackSection />
        <FeedbackSection />
      </ParallaxBackgroundWrapper>
      
      {/* Contact section with its own subtle background */}
      <ParallaxBackgroundWrapper
        imageUrl="https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=75"
        overlayType="dark"
        speed={0.35}
        id="contact-parallax"
      >
        <ContactSection settings={siteSettings as any} />
      </ParallaxBackgroundWrapper>
    </div>
  );
}
