"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-cyan-400 to-blue-500" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-400">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="border-slate-700 hover:border-cyan-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-4">You might be interested in:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/projects" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
              View Projects
            </Link>
            <Link href="/#about" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
              About Me
            </Link>
            <Link href="/#contact" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
