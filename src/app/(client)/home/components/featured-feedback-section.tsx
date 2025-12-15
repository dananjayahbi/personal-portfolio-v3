"use client";

import { useEffect, useState, useRef } from "react";
import { Star, Quote } from "lucide-react";

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
        const checkResponse = await fetch("/api/feedback/featured/check");
        
        if (!checkResponse.ok) {
          setIsLoading(false);
          return;
        }

        const checkData = await checkResponse.json();

        if (!checkData.hasEnough) {
          setShouldMount(false);
          setIsLoading(false);
          return;
        }

        setShouldMount(true);

        const response = await fetch("/api/feedback/featured");
        if (response.ok) {
          const data = await response.json();
          setFeaturedFeedback(data);
        }
      } catch (error) {
        console.error("[Featured Section] Error:", error);
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
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (isLoading) {
    return (
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (!shouldMount) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFullStar = star <= rating;
          const isHalfStar = star - 0.5 === rating;
          
          return (
            <div key={star} className="relative">
              <Star
                className={`w-4 h-4 ${
                  isFullStar
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }`}
              />
              {isHalfStar && (
                <Star
                  className="w-4 h-4 absolute top-0 left-0 fill-amber-400 text-amber-400"
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
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
            Kind Words
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What People Say
          </h2>
          <p className="text-slate-400 text-lg">
            Feedback from those I've had the pleasure to work with
          </p>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative -mx-6 sm:-mx-8 lg:-mx-12">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-hide px-6 sm:px-8 lg:px-12"
            style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
            <div className="flex gap-6 w-max animate-scroll-infinite hover:animation-paused">
              {/* First set of cards */}
              {featuredFeedback.map((item) => (
                <article
                  key={`${item.id}-1`}
                  className="w-[320px] md:w-[380px] p-6 flex-shrink-0 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm pointer-events-none relative overflow-hidden group"
                >
                  {/* Quote icon */}
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-500/10" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {(item.isAnonymous ? "A" : (item.name?.[0] || "A")).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white block">
                        {item.isAnonymous ? "Anonymous" : item.name || "Anonymous"}
                      </span>
                      <time className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="ml-auto">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
                    "{item.feedback}"
                  </p>
                </article>
              ))}
              {/* Duplicate set for infinite scroll effect */}
              {featuredFeedback.map((item) => (
                <article
                  key={`${item.id}-2`}
                  className="w-[320px] md:w-[380px] p-6 flex-shrink-0 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm pointer-events-none relative overflow-hidden group"
                >
                  {/* Quote icon */}
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-500/10" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {(item.isAnonymous ? "A" : (item.name?.[0] || "A")).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white block">
                        {item.isAnonymous ? "Anonymous" : item.name || "Anonymous"}
                      </span>
                      <time className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="ml-auto">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
                    "{item.feedback}"
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Custom CSS for infinite scroll animation */}
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
