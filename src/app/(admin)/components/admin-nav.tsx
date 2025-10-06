'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { ComponentType } from "react";
import {
  LayoutDashboard,
  BookOpenText,
  PlusCircle,
  Folders,
  Settings2,
  UserRoundCog,
  Zap,
  Inbox,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: Inbox,
  },
  {
    href: "/client-dashboard-content",
    label: "Dashboard content",
    icon: BookOpenText,
  },
  {
    href: "/add-project",
    label: "Add project",
    icon: PlusCircle,
  },
  {
    href: "/edit-project",
    label: "Manage projects",
    icon: Folders,
  },
  {
    href: "/manage-technologies",
    label: "Manage technologies",
    icon: Zap,
  },
  {
    href: "/client-site-settings",
    label: "Site settings",
    icon: Settings2,
  },
  {
    href: "/settings",
    label: "Admin profile",
    icon: UserRoundCog,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition',
              'text-white/60 hover:text-white hover:bg-white/10',
              active && 'border-white/20 bg-white/15 text-white shadow-lg shadow-indigo-500/20'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
