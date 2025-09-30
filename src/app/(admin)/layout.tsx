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
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500">
              {admin.avatarUrl ? (
                <Image src={admin.avatarUrl} alt={admin.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white/90">
                  {admin.name
                    .split(' ')
                    .map((part) => part[0]?.toUpperCase())
                    .slice(0, 2)
                    .join('')}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">Admin Access</p>
              <h2 className="text-lg font-semibold text-white">{admin.name}</h2>
              <p className="text-sm text-white/60">{admin.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 text-sm text-white/60 md:flex-row md:items-center">
            <Link href="/" className="rounded-full bg-white/10 px-4 py-2 font-medium text-white hover:bg-white/20">
              View public site
            </Link>
            <form action={logoutAction}>
              <LogoutButton />
            </form>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-[320px,1fr]">
          <aside className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div>
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/40">Navigation</h3>
              <p className="mt-2 text-sm text-white/60">
                Sculpt every touchpoint of your portfolio with purpose-driven controls.
              </p>
            </div>
            <AdminNav />
          </aside>

          <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
