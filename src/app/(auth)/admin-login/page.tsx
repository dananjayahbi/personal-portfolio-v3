import { redirect } from "next/navigation";
import Link from "next/link";
import { getOptionalAdmin } from "@/lib/auth/guards";
import { LoginForm } from "./components/login-form";
import { Lock, FolderKanban, BarChart3, Settings, ArrowLeft } from "lucide-react";

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

  const features = [
    { icon: FolderKanban, text: 'Manage Projects & Experiments' },
    { icon: BarChart3, text: 'View Analytics & Insights' },
    { icon: Settings, text: 'Configure Site Settings' },
  ];

  return (
    <main className="min-h-screen bg-[#030014] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Back to Home Button */}
      <Link 
        href="/"
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 group flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Home</span>
      </Link>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 -left-20 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/15 rounded-full blur-[120px] sm:blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[140px] sm:blur-[180px]" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center relative z-10">
        {/* Left Side - Illustration & Text (Desktop only) */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
          {/* Animated Lock Icon */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float">
              <Lock className="w-16 h-16 text-blue-400" strokeWidth={1.5} />
            </div>
            {/* Decorative rings */}
            <div className="absolute -inset-4 border border-blue-500/10 rounded-3xl animate-ping-slow" />
            <div className="absolute -inset-8 border border-cyan-500/5 rounded-3xl animate-ping-slower" />
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-medium text-white">
              Admin <span className="text-blue-400">Dashboard</span>
            </h1>
            <p className="text-white/50 max-w-sm leading-relaxed">
              Manage your portfolio content, projects, and settings from a secure control center.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-white/60 text-sm"
              >
                <feature.icon className="w-5 h-5 text-blue-400/70" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 mb-3 sm:mb-4">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl sm:text-2xl font-medium text-white">Admin Login</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/50">Sign in to access your dashboard</p>
          </div>

          <LoginForm notice={notice} />
        </div>
      </div>

      {/* Floating geometric shapes (Desktop only) */}
      <div className="absolute top-20 right-20 w-20 h-20 border border-blue-500/10 rounded-lg rotate-12 animate-float-slow hidden lg:block" />
      <div className="absolute bottom-32 left-32 w-12 h-12 border border-cyan-500/10 rotate-45 animate-float-slower hidden lg:block" />
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '0.5s' }} />
    </main>
  );
}