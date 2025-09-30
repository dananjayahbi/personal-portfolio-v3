import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { ProfilePanels } from "./components/profile-panels";

export default async function AdminSettingsPage() {
  const sessionAdmin = await requireAdmin();
  const adminRecord = await prisma.admin.findUnique({ where: { id: sessionAdmin.id } });

  const defaults = {
    name: adminRecord?.name ?? sessionAdmin.name,
    email: adminRecord?.email ?? sessionAdmin.email,
    bio: adminRecord?.bio ?? null,
    avatarUrl: adminRecord?.avatarUrl ?? null,
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Admin settings</p>
        <h1 className="text-3xl font-semibold text-white">Personalize your studio</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Tune the personal details and security credentials that power the portfolio and client dashboard experience.
        </p>
      </header>

      <ProfilePanels defaults={defaults} />
    </div>
  );
}