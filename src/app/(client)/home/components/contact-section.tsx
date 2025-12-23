"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";

interface ContactSectionProps {
  settings?: {
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
  };
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-24 md:py-32 scroll-mt-16 relative">
      {/* Subtle background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-900/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Premium Typography */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-6">
            Let's Connect
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-8">
            Get in Touch
          </h2>
          <p className="text-white/50 text-lg font-light">
            Have a project in mind? Let's discuss how I can help bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 md:p-10 rounded-2xl glass-dark">
              <h3 className="text-lg font-light text-white mb-8 tracking-wide">
                Contact Information
              </h3>
              
              <div className="space-y-8">
                {settings?.contactEmail && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                      <Mail className="h-5 w-5 text-white/40" />
                    </div>
                    <div>
                      <h4 className="text-xs font-light text-white/40 mb-2 tracking-wider uppercase">
                        Email
                      </h4>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="text-white/70 hover:text-white transition-colors font-light"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.contactPhone && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                      <Phone className="h-5 w-5 text-white/40" />
                    </div>
                    <div>
                      <h4 className="text-xs font-light text-white/40 mb-2 tracking-wider uppercase">
                        Phone
                      </h4>
                      <a
                        href={`tel:${settings.contactPhone}`}
                        className="text-white/70 hover:text-white transition-colors font-light"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.location && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                      <MapPin className="h-5 w-5 text-white/40" />
                    </div>
                    <div>
                      <h4 className="text-xs font-light text-white/40 mb-2 tracking-wider uppercase">
                        Location
                      </h4>
                      <p className="text-white/70 font-light">{settings.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl glass-dark space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs text-white/40 mb-3 font-light tracking-wider uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all font-light"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs text-white/40 mb-3 font-light tracking-wider uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all font-light"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs text-white/40 mb-3 font-light tracking-wider uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all font-light"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs text-white/40 mb-3 font-light tracking-wider uppercase">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none font-light"
                  placeholder="Tell me about your project..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0f1419] rounded-full font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-50 text-sm tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0f1419]/30 border-t-[#0f1419] rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {submitStatus === "success" && (
                  <p className="text-emerald-400/80 text-sm font-light">✓ Message sent successfully!</p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-400/80 text-sm font-light">✕ Failed to send. Please try again.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
