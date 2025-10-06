"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-slate-400">
            Have a project in mind? Let's discuss how I can help bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {settings?.contactEmail && (
              <Card className="p-6 bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {settings?.contactPhone && (
              <Card className="p-6 bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {settings?.location && (
              <Card className="p-6 bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                    <p className="text-slate-400 text-sm">{settings.location}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 p-8 bg-slate-800/50 border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Project Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-5 w-5" />
              </Button>

              {submitStatus === "success" && (
                <p className="text-green-400 text-sm">Message sent successfully! I'll get back to you soon.</p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-400 text-sm">Failed to send message. Please try again.</p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
