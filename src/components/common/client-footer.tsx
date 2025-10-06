import Link from "next/link";
import { Github, Linkedin, Mail, Twitter, ExternalLink } from "lucide-react";
import { getSiteSettings } from "@/services/content.service";

export async function ClientFooter() {
  const settings = await getSiteSettings();
  const socialLinks = settings?.socialLinks as any;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Portfolio</h3>
            <p className="text-slate-400 text-sm">
              {settings?.footerNote || "Building innovative software solutions with modern technologies."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
            {settings?.contactEmail && (
              <p className="text-slate-400 text-sm">
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-cyan-400 transition-colors">
                  {settings.contactEmail}
                </a>
              </p>
            )}
            {settings?.location && (
              <p className="text-slate-400 text-sm">{settings.location}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} Portfolio. All rights reserved.
            </p>
            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Download Resume
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
