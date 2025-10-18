"use client";

import { useEffect, useState, useRef } from "react";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeaturedFeedback {
  id: string;
  name: string | null;
  isAnonymous: boolean;
  rating: number;
  feedback: string;
  createdAt: string;
}

export default function FeaturedFeedbackSection() {
  const [featuredFeedback, setFeaturedFeedback] = useState<FeaturedFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldMount, setShouldMount] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function checkAndFetchFeaturedFeedback() {
      try {
        // First, check if there are enough featured feedbacks
        console.log("[Featured Section] Checking if there are enough featured feedbacks...");
        const checkResponse = await fetch("/api/feedback/featured/check");
        
        if (!checkResponse.ok) {
          console.error("[Featured Section] Check endpoint failed:", checkResponse.status);
          setIsLoading(false);
          return;
        }

        const checkData = await checkResponse.json();
        console.log("[Featured Section] Check result:", checkData);

        if (!checkData.hasEnough) {
          console.log(`[Featured Section] Not enough featured feedbacks (${checkData.count}/5)`);
          setShouldMount(false);
          setIsLoading(false);
          return;
        }

        // If enough, set shouldMount to true and fetch the full data
        console.log(`[Featured Section] Sufficient featured feedbacks (${checkData.count}), fetching data...`);
        setShouldMount(true);

        const response = await fetch("/api/feedback/featured");
        if (response.ok) {
          const data = await response.json();
          console.log("[Featured Section] Featured feedback fetched:", data.length, "items");
          setFeaturedFeedback(data);
        } else {
          console.error("[Featured Section] Failed to fetch featured feedback:", response.status);
        }
      } catch (error) {
        console.error("[Featured Section] Error in checkAndFetchFeaturedFeedback:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAndFetchFeaturedFeedback();
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Don't render if still loading or if not enough featured feedbacks
  if (isLoading) {
    console.log("[Featured Section] Component is loading...");
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Loading featured feedback...</p>
        </div>
      </section>
    );
  }
  
  if (!shouldMount) {
    console.log("[Featured Section] Component should not mount (not enough featured feedbacks)");
    return null;
  }

  console.log(`[Featured Section] Rendering carousel with ${featuredFeedback.length} items`);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFullStar = star <= rating;
          const isHalfStar = star - 0.5 === rating;
          
          return (
            <div key={star} className="relative">
              <Star
                className={`w-4 h-4 ${
                  isFullStar
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
              {isHalfStar && (
                <Star
                  className="w-4 h-4 absolute top-0 left-0 fill-yellow-400 text-yellow-400"
                  style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-3 text-white">What People Say</h2>
          <p className="text-muted-foreground">
            Feedback from amazing people I've worked with
          </p>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
            style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
            <div className="flex gap-6 w-max animate-scroll-infinite hover:animation-paused">
              {/* First set of cards */}
              {featuredFeedback.map((item) => (
                <Card
                  key={`${item.id}-1`}
                  className="w-[350px] p-6 flex-shrink-0 hover:shadow-lg transition-shadow pointer-events-none"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {item.isAnonymous ? "Anonymous" : item.name || "Anonymous"}
                        </h3>
                        {renderStars(item.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </Card>
              ))}
              {/* Duplicate set for infinite scroll effect */}
              {featuredFeedback.map((item) => (
                <Card
                  key={`${item.id}-2`}
                  className="w-[350px] p-6 flex-shrink-0 hover:shadow-lg transition-shadow pointer-events-none"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {item.isAnonymous ? "Anonymous" : item.name || "Anonymous"}
                        </h3>
                        {renderStars(item.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Add custom CSS for infinite scroll animation */}
        <style jsx>{`
          @keyframes scroll-infinite {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll-infinite {
            animation: scroll-infinite 40s linear infinite;
          }

          .animate-scroll-infinite:hover,
          .animation-paused {
            animation-play-state: paused;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}
