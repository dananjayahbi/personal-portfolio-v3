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
import { getSiteSettings } from "@/services/content.service";
import Image from "next/image";

const SOCIAL_ICONS: Record<string, any> = {
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
    <footer className="border-t border-white/5 bg-[#0a0d10]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            {/* Logo - Minimal Circle Icon */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                <Image
                  src="/images/internal-images/me.png"
                  alt="Logo"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            </Link>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
              {settings?.footerNote ||
                "Building innovative software solutions with modern technologies."}
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
                  className="text-white/40 hover:text-white text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Home
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-white/40 hover:text-white text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Projects
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/40 hover:text-white text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  About
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-white/40 hover:text-white text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Contact
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-dashboard"
                  className="text-white/40 hover:text-white text-sm font-light transition-colors inline-flex items-center gap-1 group"
                >
                  Admin
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      className="p-2.5 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
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
                className="text-white/40 hover:text-white text-sm font-light transition-colors block"
              >
                {settings.contactEmail}
              </a>
            )}
            {settings?.location && (
              <p className="text-white/30 text-sm font-light">
                {settings.location}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-xs font-light text-center md:text-left tracking-wide">
              © {currentYear} Portfolio. All rights reserved.
            </p>
            {(settings?.resumeCloudinaryUrl || settings?.resumeUrl) && (
              <a
                href={settings.resumeCloudinaryUrl || settings.resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors font-light tracking-wide"
              >
                Download Resume
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
