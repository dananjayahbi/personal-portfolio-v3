"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
            <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            <p className="text-white/40 font-light">Loading testimonials...</p>
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
                className={`w-3.5 h-3.5 ${
                  isFullStar
                    ? "fill-amber-400/80 text-amber-400/80"
                    : "text-white/20"
                }`}
              />
              {isHalfStar && (
                <Star
                  className="w-3.5 h-3.5 absolute top-0 left-0 fill-amber-400/80 text-amber-400/80"
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
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Large decorative image - left */}
      <div className="absolute -left-16 top-20 w-[350px] h-[400px] opacity-[0.30] pointer-events-none hidden lg:block animate-float-slow">
        <div className="relative w-full h-full decorative-frame">
          <Image
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=85"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/80 via-[#0f1419]/30 to-transparent" />
        </div>
      </div>

      {/* Large decorative quote mark - right side */}
      <div className="absolute right-10 top-20 opacity-[0.15] pointer-events-none animate-float">
        <Quote className="w-72 h-72 text-amber-400/50" />
      </div>

      {/* Secondary quote mark - left side */}
      <div className="absolute left-20 bottom-1/3 opacity-[0.08] pointer-events-none rotate-180 animate-float-reverse">
        <Quote className="w-40 h-40 text-white" />
      </div>

      {/* Floating geometric decorations */}
      <div className="absolute right-1/4 bottom-32 w-20 h-20 border-2 border-purple-400/20 rounded-full pointer-events-none animate-float" />
      <div className="absolute left-1/3 top-1/3 w-14 h-14 border-2 border-amber-400/15 rotate-45 pointer-events-none animate-float-subtle" />

      {/* Ambient glow effects */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[180px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-900/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Premium Typography */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-6">
            Kind Words
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-8">
            What People Say
          </h2>
          <p className="text-white/50 text-lg font-light">
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
                  className="w-[320px] md:w-[380px] p-8 flex-shrink-0 rounded-2xl glass-dark pointer-events-none relative overflow-hidden"
                >
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 font-light text-sm">
                      {(item.isAnonymous ? "A" : (item.name?.[0] || "A")).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-light text-white block tracking-wide">
                        {item.isAnonymous ? "Anonymous" : item.name || "Anonymous"}
                      </span>
                      <time className="text-xs text-white/30 font-light">
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
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-4 font-light italic">
                    "{item.feedback}"
                  </p>
                </article>
              ))}
              {/* Duplicate set for infinite scroll effect */}
              {featuredFeedback.map((item) => (
                <article
                  key={`${item.id}-2`}
                  className="w-[320px] md:w-[380px] p-8 flex-shrink-0 rounded-2xl glass-dark pointer-events-none relative overflow-hidden"
                >
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 font-light text-sm">
                      {(item.isAnonymous ? "A" : (item.name?.[0] || "A")).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-light text-white block tracking-wide">
                        {item.isAnonymous ? "Anonymous" : item.name || "Anonymous"}
                      </span>
                      <time className="text-xs text-white/30 font-light">
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
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-4 font-light italic">
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
