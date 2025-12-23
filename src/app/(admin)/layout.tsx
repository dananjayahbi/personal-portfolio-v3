import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminNav } from "./components/admin-nav";
import { logoutAction } from "@/app/(auth)/admin-login/actions";
import { LogoutButton } from "./components/logout-button";

export const metadata = {
  title: "Admin Console | Portfolio Studio",
};

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const admin = await requireAdmin();

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_55%),radial-gradient(circle_at_15%_60%,_rgba(59,130,246,0.2),_transparent_60%),radial-gradient(circle_at_85%_35%,_rgba(147,51,234,0.18),_transparent_65%)]" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl md:flex">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500">
                {admin.avatarUrl ? (
                  <Image src={admin.avatarUrl} alt={admin.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/90">
                    {admin.name
                      .split(' ')
                      .map((part) => part[0]?.toUpperCase())
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Admin access</p>
                <h2 className="text-base font-semibold text-white">{admin.name}</h2>
                <p className="text-xs text-white/60">{admin.email}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mt-6">
              <AdminNav />
            </div>
          </div>

          <div className="border-t border-white/10 p-6 text-xs text-white/50">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Session</p>
            <p className="mt-2 text-xs">Manage your secure access in one click.</p>
            <form action={logoutAction} className="mt-4">
              <LogoutButton />
            </form>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-white/10 bg-slate-950/60 px-6 py-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">Portfolio studio</p>
                <h1 className="text-2xl font-semibold text-white">Welcome back, {admin.name.split(' ')[0] ?? 'Admin'}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  View public site
                </Link>
                <form action={logoutAction} className="md:hidden">
                  <LogoutButton />
                </form>
              </div>
            </div>
          </header>

          <div className="md:hidden border-b border-white/10 bg-slate-950/80 px-6 py-4">
            <AdminNav />
          </div>

          <div className="flex-1 overflow-y-auto">
            <section className="min-h-full bg-slate-950/70 p-5 shadow-[0_30px_70px_-50px_rgba(79,70,229,0.35)] backdrop-blur-xl md:p-8">
              {children}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
