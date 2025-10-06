"use client";

import { useEffect, useRef } from "react";

export function ViewTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    // Track view only once per session
    if (tracked.current) return;
    tracked.current = true;

    const trackView = async () => {
      try {
        await fetch("/api/page-views", {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    trackView();
  }, []);

  return null; // This component doesn't render anything
}
