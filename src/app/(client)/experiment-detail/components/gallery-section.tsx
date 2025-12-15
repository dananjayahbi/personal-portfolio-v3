"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "@/components/common/gallery-lightbox";

interface GalleryImage {
  url: string;
  alt: string | null;
}

interface GallerySectionProps {
  images: GalleryImage[];
  title: string;
  type: "project" | "experiment";
}

export function GallerySection({ images, title, type }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
          {type === "project" ? "Project" : "Experiment"} Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {images.map((item, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-[#0a192f]/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/20 cursor-pointer"
            >
              <Image
                src={item.url}
                alt={item.alt || `${title} screenshot ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-cyan-300 font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  {item.alt || `Screenshot ${index + 1}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <GalleryLightbox
        images={images}
        initialIndex={selectedImageIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
      />
    </>
  );
}
