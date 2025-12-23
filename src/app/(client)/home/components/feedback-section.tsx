"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, ArrowRight } from "lucide-react";

export default function FeedbackSection() {
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setSubmitStatus({
        type: "error",
        message: "Please select a rating",
      });
      return;
    }

    if (feedback.trim().length < 5) {
      setSubmitStatus({
        type: "error",
        message: "Feedback must be at least 5 characters long",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: isAnonymous ? undefined : name.trim() || undefined,
          isAnonymous,
          rating,
          feedback: feedback.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit feedback");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you for your feedback!",
      });

      // Reset form
      setName("");
      setIsAnonymous(false);
      setRating(0);
      setFeedback("");
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to submit feedback",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Large decorative image - right side */}
      <div className="absolute -right-16 top-20 w-[350px] h-[420px] opacity-[0.32] pointer-events-none hidden lg:block animate-float-slow">
        <div className="relative w-full h-full decorative-frame">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0f1419]/80 via-[#0f1419]/30 to-transparent" />
        </div>
      </div>

      {/* Secondary decorative image - left side */}
      <div className="absolute -left-16 bottom-20 w-[300px] h-[360px] opacity-[0.28] pointer-events-none hidden lg:block animate-float-reverse">
        <div className="relative w-full h-full decorative-frame">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=85"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/80 via-[#0f1419]/30 to-transparent" />
        </div>
      </div>

      {/* Floating geometric decorations */}
      <div className="absolute left-1/4 top-32 w-20 h-20 border-2 border-emerald-400/20 rounded-full pointer-events-none animate-float" />
      <div className="absolute right-1/3 bottom-40 w-16 h-16 border-2 border-white/12 rotate-45 pointer-events-none animate-float-reverse" />
      <div className="absolute left-10 bottom-1/3 w-12 h-12 border border-amber-400/15 rounded-full pointer-events-none animate-float-subtle" />

      {/* Ambient glow effects */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-amber-900/8 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Section Header - Premium Typography */}
          <div className="text-center mb-16">
            <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-6">
              Your Opinion Matters
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-8">
              Share Your Feedback
            </h2>
            <p className="text-white/50 text-lg font-light">
              Help me improve by sharing your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl glass-dark space-y-8">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs text-white/40 mb-3 font-light tracking-wider uppercase">
                Name {!isAnonymous && <span className="text-white/30">(optional)</span>}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? "Anonymous" : "Your name"}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="anonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/20 focus:ring-offset-0"
              />
              <label htmlFor="anonymous" className="text-sm text-white/40 cursor-pointer font-light">
                Submit anonymously
              </label>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs text-white/40 mb-4 font-light tracking-wider uppercase">
                Rating <span className="text-white/60">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="relative">
                    {/* Left half */}
                    <button
                      type="button"
                      onClick={() => setRating(star - 0.5)}
                      onMouseEnter={() => setHoveredRating(star - 0.5)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="absolute left-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                      aria-label={`${star - 0.5} stars`}
                    />
                    {/* Right half */}
                    <button
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="absolute right-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                      aria-label={`${star} stars`}
                    />
                    {/* Star SVG */}
                    <Star
                      className={`w-8 h-8 relative pointer-events-none transition-all duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-400/80 text-amber-400/80 scale-110"
                          : star - 0.5 === (hoveredRating || rating)
                          ? "fill-amber-400/80 text-amber-400/80"
                          : "text-white/20 hover:text-white/30"
                      }`}
                      style={{
                        clipPath:
                          star - 0.5 === (hoveredRating || rating)
                            ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                            : undefined,
                      }}
                    />
                    {star - 0.5 === (hoveredRating || rating) && (
                      <Star className="w-8 h-8 absolute top-0 left-0 text-white/20 pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-white/40 mt-3 font-light">
                  {rating} star{rating !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div>
              <label htmlFor="feedback" className="block text-xs text-white/40 mb-3 font-light tracking-wider uppercase">
                Your feedback <span className="text-white/60">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or experience..."
                rows={4}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none font-light"
              />
              <p className="text-xs text-white/30 mt-2 font-light">
                Minimum 5 characters
              </p>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div
                className={`p-4 rounded-xl text-sm font-light ${
                  submitStatus.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400/80 border border-red-500/20"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0f1419] rounded-full font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-50 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0f1419]/30 border-t-[#0f1419] rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Feedback
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
