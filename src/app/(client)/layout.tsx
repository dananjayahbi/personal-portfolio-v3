import { ClientNav } from "@/components/common/client-nav";
import { ClientFooter } from "@/components/common/client-footer";
import { ViewTracker } from "@/components/common/view-tracker";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <ViewTracker />
      <ClientNav />
      <main className="pt-16">{children}</main>
      <ClientFooter />
    </div>
  );
}
