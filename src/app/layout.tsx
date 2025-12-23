import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { PageLoader } from "@/components/common/page-loader";
import "./globals.css";

// Premium serif font for headings - elegant and sophisticated
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Clean sans-serif for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
        className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
