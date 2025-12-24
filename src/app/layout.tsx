import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google";
import { PageLoader } from "@/components/common/page-loader";
import "./globals.css";

// Premium geometric sans-serif for headings - modern and bold
const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Modern, elegant sans-serif for body text
const sora = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600"],
});

// Mono font for code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Portfolio - Software Engineer",
    template: "%s | Portfolio",
  },
  description: "Professional portfolio showcasing software engineering projects, skills, and experience.",
  keywords: ["software engineer", "web developer", "portfolio", "full stack", "React", "Next.js"],
  authors: [{ name: "Software Engineer" }],
  creator: "Software Engineer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio.example.com",
    title: "Portfolio - Software Engineer",
    description: "Professional portfolio showcasing software engineering projects, skills, and experience.",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Software Engineer",
    description: "Professional portfolio showcasing software engineering projects, skills, and experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${sora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
