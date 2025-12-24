"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mail, Send, MapPin, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { AnimateOnScroll } from "@/components/common/animate-on-scroll";

interface ContactSectionProps {
  settings?: {
    contactEmail?: string;
    location?: string;
    availability?: string;
  };
  backgroundImage?: string;
}

export function ContactSection({ settings, backgroundImage }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Enhanced 3D parallax scroll effect
  const updateParallax = useCallback(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    const isInView = rect.bottom > 0 && rect.top < windowHeight;
    
    if (isInView) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
      const yOffset = (scrollProgress - 0.5) * sectionHeight * 0.7;
      const rotateX = (scrollProgress - 0.5) * 5;
      
      bgRef.current.style.transform = "perspective(1000px) translate3d(0, " + yOffset + "px, 80px) rotateX(" + rotateX + "deg) scale(1.25)";
    }
  }, []);

  useEffect(() => {
    if (!backgroundImage) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
      }
    };

    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateParallax, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateParallax);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateParallax, backgroundImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="py-24 md:py-32 scroll-mt-16 relative overflow-hidden">
      {/* Parallax Background */}
      {backgroundImage && (
        <>
          <div
            ref={bgRef}
            className="absolute bg-cover bg-center will-change-transform pointer-events-none"
            style={{
              backgroundImage: "url(" + backgroundImage + ")",
              top: "-20%",
              bottom: "-20%",
              left: "-10%",
              right: "-10%",
              transformOrigin: "center center",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/90 via-[#030014]/75 to-[#030014]/90 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/15 via-transparent to-blue-900/15 z-[1]" />
          
          {/* Enhanced edge transitions with blur */}
          <div 
            className="absolute top-0 left-0 right-0 h-48 z-[2] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #030014 0%, rgba(3, 0, 20, 0.95) 20%, rgba(3, 0, 20, 0.7) 50%, rgba(3, 0, 20, 0.3) 80%, transparent 100%)",
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none"
            style={{
              background: "linear-gradient(to top, #030014 0%, rgba(3, 0, 20, 0.95) 20%, rgba(3, 0, 20, 0.7) 50%, rgba(3, 0, 20, 0.3) 80%, transparent 100%)",
            }}
          />
        </>
      )}

      {/* Simple background accent */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-15 z-[3]"
        style={{
          bottom: "0%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-emerald-500/50" />
              <span className="text-sm tracking-[0.3em] uppercase font-light text-emerald-400">Get in touch</span>
              <div className="w-12 h-[1px] bg-emerald-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Let&apos;s Work Together</h2>
            <p className="text-lg text-white/50 font-light">Have a project in mind? I&apos;d love to hear from you.</p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-white">Contact Info</h3>
                </div>
                
                <div className="space-y-4">
                  {settings?.contactEmail && (
                    <a 
                      href={"mailto:" + settings.contactEmail}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-white/5">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider block mb-0.5">Email</span>
                        <span className="text-white/70 text-sm group-hover:text-white transition-colors">{settings.contactEmail}</span>
                      </div>
                    </a>
                  )}
                  
                  {settings?.location && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="p-2 rounded-lg bg-white/5">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider block mb-0.5">Location</span>
                        <span className="text-white/70 text-sm">{settings.location}</span>
                      </div>
                    </div>
                  )}
                  
                  {settings?.availability && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="p-2 rounded-lg bg-white/5">
                        <Clock className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider block mb-0.5">Availability</span>
                        <span className="text-white/70 text-sm">{settings.availability}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <AnimateOnScroll animation="fade-up" delay={200}>
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/50 font-light">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/50 font-light">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <label className="text-sm text-white/50 font-light">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none transition-colors"
                    placeholder="Project inquiry"
                  />
                </div>
                
                <div className="space-y-2 mb-8">
                  <label className="text-sm text-white/50 font-light">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm">Message sent successfully! I&apos;ll get back to you soon.</span>
                  </div>
                )}
                
                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{errorMessage || "Something went wrong. Please try again."}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-white font-medium transition-colors duration-300"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
