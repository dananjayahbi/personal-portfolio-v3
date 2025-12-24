import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getSiteSettings } from "@/services/content.service";
import Image from "next/image";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
};

export async function ClientFooter() {
  const settings = await getSiteSettings();
  const socialLinks =
    (settings?.socialLinks as Array<{ platform?: string; url?: string }>) || [];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#030014] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-all duration-300 overflow-hidden">
                <Image
                  src="/images/internal-images/me.png"
                  alt="Logo"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </Link>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs">
              {settings?.footerNote ||
                "Crafting innovative software solutions with modern technologies and creative design."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-light text-white/60 uppercase tracking-[0.2em]">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-white/50 hover:text-blue-400 text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Home
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-white/50 hover:text-blue-400 text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Projects
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/50 hover:text-blue-400 text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  About
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-white/50 hover:text-blue-400 text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Contact
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-dashboard"
                  className="text-white/50 hover:text-cyan-400 text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Admin
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h4 className="text-xs font-light text-white/60 uppercase tracking-[0.2em]">
              Connect
            </h4>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link, index) => {
                  const platform = link.platform?.toLowerCase() || "";
                  const Icon = SOCIAL_ICONS[platform] || Mail;

                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                      aria-label={link.platform}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
            {settings?.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-white/50 hover:text-blue-400 text-sm font-light transition-colors block"
              >
                {settings.contactEmail}
              </a>
            )}
            {settings?.location && (
              <p className="text-white/40 text-sm font-light">
                📍 {settings.location}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs font-light text-center md:text-left tracking-wide">
              © {currentYear} Portfolio. Built with passion and code.
            </p>
            {(settings?.resumeCloudinaryUrl || settings?.resumeUrl) && (
              <a
                href={settings.resumeCloudinaryUrl || settings.resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-blue-400 transition-colors font-light tracking-wide group"
              >
                Download Resume
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
