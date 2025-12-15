import { ClientNav } from "@/components/common/client-nav";
import { ClientFooter } from "@/components/common/client-footer";
import { ViewTracker } from "@/components/common/view-tracker";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a192f] relative overflow-x-hidden">
      {/* Deep blue gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f]" />
      
      {/* Subtle glow effects */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10">
        <ViewTracker />
        <ClientNav />
        <main className="pt-16">{children}</main>
        <ClientFooter />
      </div>
    </div>
  );
}
