import { ClientNav } from "@/components/common/client-nav";
import { ClientFooter } from "@/components/common/client-footer";
import { ViewTracker } from "@/components/common/view-tracker";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030014] relative overflow-x-hidden">
      {/* Deep space background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#030014] via-[#050118] to-[#030014] z-[-20]" />
      
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-20 z-[-15]" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {/* Simple ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none z-[-10] opacity-50"
           style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-[-10] opacity-50"
           style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)', filter: 'blur(100px)' }} />

      <div className="relative z-10">
        <ViewTracker />
        <ClientNav />
        <main>{children}</main>
        <ClientFooter />
      </div>
    </div>
  );
}
