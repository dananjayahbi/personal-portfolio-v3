"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
              Your Opinion Matters
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Share Your Feedback
            </h2>
            <p className="text-slate-400 text-lg">
              Help me improve by sharing your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm text-slate-300 mb-2 font-medium">
                Name {!isAnonymous && <span className="text-slate-500">(optional)</span>}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? "Anonymous" : "Your name"}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="anonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0"
              />
              <label htmlFor="anonymous" className="text-sm text-slate-400 cursor-pointer">
                Submit anonymously
              </label>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm text-slate-300 mb-3 font-medium">
                Rating <span className="text-cyan-400">*</span>
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
                          ? "fill-amber-400 text-amber-400 scale-110"
                          : star - 0.5 === (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 hover:text-slate-500"
                      }`}
                      style={{
                        clipPath:
                          star - 0.5 === (hoveredRating || rating)
                            ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                            : undefined,
                      }}
                    />
                    {star - 0.5 === (hoveredRating || rating) && (
                      <Star className="w-8 h-8 absolute top-0 left-0 text-slate-600 pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-cyan-400 mt-2">
                  {rating} star{rating !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div>
              <label htmlFor="feedback" className="block text-sm text-slate-300 mb-2 font-medium">
                Your feedback <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or experience..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Minimum 5 characters
              </p>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div
                className={`p-4 rounded-xl text-sm ${
                  submitStatus.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-6 text-base font-medium rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
