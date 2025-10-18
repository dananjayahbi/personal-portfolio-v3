"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        message: "Thank you for your feedback! 🎉",
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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-3 text-white">Share Your Feedback</h2>
          <p className="text-muted-foreground">
            Your thoughts help me improve. Let me know what you think!
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name {!isAnonymous && "(Optional)"}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? "Anonymous" : "Enter your name"}
                className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="anonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="anonymous" className="text-sm cursor-pointer">
                Submit anonymously
              </label>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Rating <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-1">
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
                      className={`w-8 h-8 relative pointer-events-none transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : star - 0.5 === (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      style={{
                        clipPath:
                          star - 0.5 === (hoveredRating || rating)
                            ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                            : undefined,
                      }}
                    />
                    {star - 0.5 === (hoveredRating || rating) && (
                      <Star className="w-8 h-8 absolute top-0 left-0 text-muted-foreground pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  You selected {rating} star{rating !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                Your Feedback <span className="text-destructive">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or experience..."
                rows={5}
                className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 5 characters
              </p>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div
                className={`p-4 rounded-md ${
                  submitStatus.type === "success"
                    ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
