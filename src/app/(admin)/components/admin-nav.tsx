'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin-dashboard",
    label: "Admin Dashboard",
    description: "Pulse of projects, content, and settings",
  },
  {
    href: "/client-dashboard-content",
    label: "Dashboard Content",
    description: "Hero, spotlight, and storytelling modules",
  },
  {
    href: "/add-project",
    label: "Add Project",
    description: "Publish a new case study in minutes",
  },
  {
    href: "/edit-project",
    label: "Manage Projects",
    description: "Curate, reorder, and fine-tune existing work",
  },
  {
    href: "/client-site-settings",
    label: "Site Settings",
    description: "Contact, socials, and SEO controls",
  },
  {
    href: "/settings",
    label: "Admin Profile",
    description: "Profile details and security",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-2">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 px-5 py-4 transition',
              'hover:border-white/15 hover:bg-white/10',
              active && 'border-white/30 bg-white/15 shadow-lg shadow-indigo-500/20'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{item.label}</span>
              <span className="text-xs uppercase tracking-wide text-white/40">{active ? 'Active' : 'Navigate'}</span>
            </div>
            <p className="mt-2 text-xs text-white/60">{item.description}</p>
          </Link>
        );
      })}
    </nav>
  );
}
