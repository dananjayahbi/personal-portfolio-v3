"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Experiments", path: "/experiments" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/#contact" },
];

export function ClientNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || isOpen
          ? "bg-[#030014]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-all duration-300 overflow-hidden">
              <Image
                src="/images/internal-images/me.png"
                alt="Logo"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative px-4 py-2 text-sm font-light tracking-wide transition-all duration-300 rounded-lg",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-white text-sm font-medium tracking-wide transition-colors duration-300"
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-6 space-y-1 border-t border-white/5">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 rounded-lg",
                    isActive
                      ? "text-white bg-white/5 border-l-2 border-blue-500"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 px-4">
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-blue-600 rounded-xl text-white text-sm font-medium tracking-wide"
              >
                Hire Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
