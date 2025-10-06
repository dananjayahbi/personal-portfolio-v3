import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/lib/auth/guards";
import { LoginForm } from "./components/login-form";

type Props = {
  searchParams?: Promise<{
    intent?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const admin = await getOptionalAdmin();
  if (admin) {
    redirect("/client-dashboard-content");
  }

  const resolvedSearchParams = (await searchParams) ?? {};

  const notice =
    resolvedSearchParams.intent === "password-updated"
      ? "Password updated successfully. Please sign in with your new credentials."
      : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(124,58,237,0.16),_transparent_55%),radial-gradient(circle_at_80%_0%,_rgba(236,72,153,0.16),_transparent_60%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.45em] text-white/40">Portfolio Admin</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Welcome back, creator.</h1>
          <p className="mt-3 max-w-xl text-balance text-base text-white/60">
            Securely access the curation console to publish impactful work, craft your narrative, and fine-tune every pixel of your personal brand.
          </p>
        </div>

  <LoginForm notice={notice} />

        <footer className="text-sm text-white/40">
          Need help? Reach out to your developer contact or reset the password via the deployment CLI.
        </footer>
      </div>
    </main>
  );
}