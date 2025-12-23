"use client";

import Link from "next/link";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="text-center space-y-10 max-w-2xl relative z-10">
        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-[12rem] sm:text-[16rem] font-black leading-none bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 blur-[80px] opacity-40 bg-gradient-to-r from-cyan-400 to-blue-500 pointer-events-none" />
        </div>

        {/* Compass Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Compass className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Lost in Space
          </h2>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            The page you're looking for has drifted into the void. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-6 text-base font-medium rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="border-slate-600 hover:border-cyan-400/50 hover:bg-cyan-400/5 text-white px-8 py-6 text-base font-medium rounded-full transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-10 border-t border-slate-800/50">
          <p className="text-sm text-slate-500 mb-6">You might find these helpful:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/projects" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm transition-colors">
              <span className="w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                📁
              </span>
              Projects
            </Link>
            <Link href="/experiments" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm transition-colors">
              <span className="w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                🧪
              </span>
              Experiments
            </Link>
            <Link href="/about" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm transition-colors">
              <span className="w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                👤
              </span>
              About
            </Link>
            <Link href="/#contact" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm transition-colors">
              <span className="w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                ✉️
              </span>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
