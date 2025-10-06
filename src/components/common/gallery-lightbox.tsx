"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string | null;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  title: string;
}

export function GalleryLightbox({ images, initialIndex, open, onClose, title }: GalleryLightboxProps) {
  // Track zoom per image
  const [zoomLevels, setZoomLevels] = useState<Record<number, number>>({});
  // Track pan position per image
  const [panPositions, setPanPositions] = useState<Record<number, { x: number; y: number }>>({});
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentZoom = zoomLevels[currentIndex] || 1;
  const currentPan = panPositions[currentIndex] || { x: 0, y: 0 };
  const currentImage = images[currentIndex];

  // Reset index when opening
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (imageContainerRef.current && imageContainerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        setZoomLevels(prev => ({
          ...prev,
          [currentIndex]: Math.max(1, Math.min(3, (prev[currentIndex] || 1) + delta))
        }));
      }
    };

    const container = imageContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex]);

  const handleZoomIn = () => {
    setZoomLevels(prev => ({
      ...prev,
      [currentIndex]: Math.min((prev[currentIndex] || 1) + 0.5, 3)
    }));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max((zoomLevels[currentIndex] || 1) - 0.5, 1);
    setZoomLevels(prev => ({
      ...prev,
      [currentIndex]: newZoom
    }));
    // Reset pan when zooming back to 1x
    if (newZoom === 1) {
      setPanPositions(prev => ({
        ...prev,
        [currentIndex]: { x: 0, y: 0 }
      }));
    }
  };

  // Double-click zoom
  const handleDoubleClick = () => {
    const current = zoomLevels[currentIndex] || 1;
    const newZoom = current > 1 ? 1 : 2;
    setZoomLevels(prev => ({
      ...prev,
      [currentIndex]: newZoom
    }));
    // Reset pan when zooming out
    if (newZoom === 1) {
      setPanPositions(prev => ({
        ...prev,
        [currentIndex]: { x: 0, y: 0 }
      }));
    }
  };

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentZoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - currentPan.x, y: e.clientY - currentPan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && currentZoom > 1) {
      setPanPositions(prev => ({
        ...prev,
        [currentIndex]: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch support for mobile panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentZoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - currentPan.x, 
        y: e.touches[0].clientY - currentPan.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && currentZoom > 1 && e.touches.length === 1) {
      setPanPositions(prev => ({
        ...prev,
        [currentIndex]: {
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        }
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleClose = () => {
    setZoomLevels({});
    setPanPositions({});
    onClose();
  };

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-slate-950/95 border-slate-800 p-0">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">{title} - Gallery</DialogTitle>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-slate-950 to-transparent">
          <div className="text-white">
            <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={currentZoom <= 1}
              className="text-white hover:bg-slate-800 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={currentZoom >= 3}
              className="text-white hover:bg-slate-800 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-slate-800 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Image Container with Overflow Hidden */}
        <div className="absolute inset-0 flex items-center justify-center pt-16 sm:pt-20 pb-16 overflow-hidden">
          <div 
            ref={imageContainerRef}
            className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              cursor: currentZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
          >
            <div 
              className="relative w-full h-full transition-transform duration-300"
              style={{ 
                transform: `scale(${currentZoom}) translate(${currentPan.x}px, ${currentPan.y}px)`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt || `Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                draggable={false}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-slate-800/80 border border-slate-700 hover:bg-slate-800 text-white h-10 w-10 sm:h-12 sm:w-12 rounded-full z-40"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-slate-800/80 border border-slate-700 hover:bg-slate-800 text-white h-10 w-10 sm:h-12 sm:w-12 rounded-full z-40"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Footer with alt text */}
        {currentImage.alt && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-slate-950 to-transparent text-center z-40">
            <p className="text-sm sm:text-base text-slate-300">{currentImage.alt}</p>
          </div>
        )}

        {/* Zoom indicator */}
        {currentZoom > 1 && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-800/90 text-white px-3 py-1.5 rounded-full text-sm z-50">
            {Math.round(currentZoom * 100)}%
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
