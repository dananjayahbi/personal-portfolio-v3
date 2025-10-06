import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
