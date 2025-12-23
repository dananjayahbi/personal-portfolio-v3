import { ClientNav } from "@/components/common/client-nav";
import { ClientFooter } from "@/components/common/client-footer";
import { ViewTracker } from "@/components/common/view-tracker";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1419] relative overflow-x-hidden">
      {/* Premium dark background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0f1419] via-[#131920] to-[#0f1419] z-[-10]" />
      
      {/* Subtle ambient lighting - very muted for premium feel */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-amber-900/5 rounded-full blur-[200px] pointer-events-none z-[-9]" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[180px] pointer-events-none z-[-9]" />
      
      <div className="relative z-10">
        <ViewTracker />
        <ClientNav />
        <main>{children}</main>
        <ClientFooter />
      </div>
    </div>
  );
}
